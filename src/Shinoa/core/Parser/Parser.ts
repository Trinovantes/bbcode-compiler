import { RootNode, AstNodeType, AttrNode, TextNode, LinebreakNode, StartTagNode, EndTagNode, TagNode, AstNode, nodeTypeToString } from './AstNode'
import { isStringToken, TokenType, Token, tokenTypeToString } from '../Lexer/Token'
import { AstMap, nodeIsType } from '@/Shinoa/utils/nodeIsType'
import { DEFAULT_RULES, Rule } from '../Generator/Rule'

export class Parser {
    private readonly _tokens: ReadonlyArray<Token>
    private readonly _printDebugInfo: boolean
    private _idx: number
    private _depth: number

    private readonly _tags: ReadonlySet<string>
    private readonly _linebreakTerminatedTags: ReadonlySet<string>
    private readonly _standaloneTags: ReadonlySet<string>

    constructor(tokens: ReadonlyArray<Token>, printDebugInfo = false, rules: ReadonlyArray<Rule> = DEFAULT_RULES) {
        this._tokens = tokens
        this._printDebugInfo = printDebugInfo
        this._idx = NaN
        this._depth = NaN

        this._tags = new Set(rules.map((rule) => rule.name))
        this._linebreakTerminatedTags = new Set(rules.filter((rule) => rule.isLinebreakTerminated).map((rule) => rule.name))
        this._standaloneTags = new Set(rules.filter((rule) => rule.isStandalone).map((rule) => rule.name))
    }

    parse(): RootNode {
        this._idx = 0
        this._depth = 0

        const root = this.parseRoot()
        const transformedRoot = this.matchTagNodes(root)

        return transformedRoot
    }

    // ------------------------------------------------------------------------
    // Parsing Helpers
    // ------------------------------------------------------------------------

    get isFinished(): boolean {
        return this._idx >= this._tokens.length
    }

    private peek(offset = 0): TokenType {
        if (this._idx + offset >= this._tokens.length) {
            throw new Error(`Parser has reached end of token steam and cannot peek:${offset}`)
        }

        return this._tokens[this._idx + offset].type
    }

    private advance(): void {
        if (this.isFinished) {
            throw new Error('Parser has reached end of token stream and cannot advance')
        }

        this._idx += 1
    }

    private checkAndAdvance(expectedType: TokenType): void {
        if (this.peek() !== expectedType) {
            throw new Error(`Expected ${tokenTypeToString(expectedType)} but got ${tokenTypeToString(this.peek())}`)
        }

        this.advance()
    }

    // ------------------------------------------------------------------------
    // Parsers
    // ------------------------------------------------------------------------

    private runParser<T extends keyof AstMap>(nodeType: T, parser: () => AstMap[T]): AstMap[T] {
        const indent = 'depth:' + this._depth.toString().padStart(2, ' ') + ' '.repeat(this._depth * 4)

        let node: AstMap[T]

        try {
            this._depth++
            this._printDebugInfo && console.info(indent, 'Start', nodeTypeToString(nodeType))
            node = parser()
        } finally {
            this._printDebugInfo && console.info(indent, 'End', nodeTypeToString(nodeType))
            this._depth--
        }

        return node
    }

    private parseRoot(): RootNode {
        return this.runParser(AstNodeType.RootNode, () => {
            const root = new RootNode()

            while (!this.isFinished) {
                if (this.peek() === TokenType.L_BRACKET) {
                    const startIdx = this._idx
                    try {
                        const tagNode = this.parseTag()
                        root.push(tagNode)
                    } catch (err) {
                        const invalidTagNodes = this._tokens.slice(startIdx, this._idx)
                        const textNode = new TextNode(invalidTagNodes)
                        root.push(textNode)

                        this._printDebugInfo && console.info('Failed to parseTag', err, '\n', `Falling back to ${textNode.toString()}`)
                    }
                } else if (this.peek() === TokenType.LINEBREAK) {
                    const linebreakNode = this.parseLinebreak()
                    root.push(linebreakNode)
                } else {
                    const textNode = this.parseText()
                    root.push(textNode)
                }
            }

            return root
        })
    }

    private parseLinebreak(): LinebreakNode {
        return this.runParser(AstNodeType.LinebreakNode, () => {
            if (this.peek() !== TokenType.LINEBREAK) {
                throw new Error('Failed to parseLinebreak')
            }

            this.advance()

            return new LinebreakNode()
        })
    }

    private parseText(): TextNode {
        return this.runParser(AstNodeType.TextNode, () => {
            const startIdx = this._idx

            // Advance until we see the start of another RootNode's child (TagNode or LinebreakNode)
            while (!this.isFinished && this.peek() !== TokenType.L_BRACKET && this.peek() !== TokenType.LINEBREAK) {
                this.advance()
            }

            const slice = this._tokens.slice(startIdx, this._idx)
            return new TextNode(slice)
        })
    }

    private parseLabel(): TextNode {
        return this.runParser(AstNodeType.TextNode, () => {
            const startIdx = this._idx

            while (!this.isFinished && isStringToken(this.peek())) {
                this.advance()
            }

            const slice = this._tokens.slice(startIdx, this._idx)
            return new TextNode(slice)
        })
    }

    private parseTag(): StartTagNode | EndTagNode {
        if (this.peek() === TokenType.L_BRACKET && isStringToken(this.peek(1))) {
            return this.runParser(AstNodeType.StartTagNode, () => {
                this.advance() // Consume L_BRACKET

                const labelNode = this.parseLabel()
                if (!this._tags.has(labelNode.str)) {
                    throw new Error(`Unrecognized StartTagNode label:${labelNode.str}`)
                }

                const tagNode = new StartTagNode(labelNode.str)

                while (this.peek() !== TokenType.R_BRACKET) {
                    const attrsNode = this.parseAttr()
                    tagNode.push(attrsNode)
                }

                this.checkAndAdvance(TokenType.R_BRACKET) // Consume R_BRACKET
                return tagNode
            })
        } else if (this.peek() === TokenType.L_BRACKET && this.peek(1) === TokenType.BACKSLASH) {
            return this.runParser(AstNodeType.EndTagNode, () => {
                this.advance() // Consume L_BRACKET
                this.advance() // Consume BACKSLASH

                const labelNode = this.parseLabel()
                if (!this._tags.has(labelNode.str)) {
                    throw new Error(`Unrecognized EndTagNode label:${labelNode.str}`)
                }

                const tagNode = new EndTagNode(labelNode.str)

                this.checkAndAdvance(TokenType.R_BRACKET) // Consume R_BRACKET
                return tagNode
            })
        } else {
            throw new Error('Failed to parseTag')
        }
    }

    private parseAttr(): AttrNode {
        return this.runParser(AstNodeType.AttrNode, () => {
            const attrNode = new AttrNode()

            while (!this.isFinished && this.peek() !== TokenType.R_BRACKET) {
                if (this.peek() === TokenType.EQUALS) { // [Tag=VAL]
                    this.advance() // Consume the EQUALS

                    const valNode = this.parseLabel()
                    attrNode.push(valNode)
                } else if (isStringToken(this.peek()) && this.peek(1) === TokenType.EQUALS) { // [Tag STR=VAL]
                    const keyNode = this.parseLabel()
                    attrNode.push(keyNode)

                    this.advance() // Consume the EQUALS

                    const valNode = this.parseLabel()
                    attrNode.push(valNode)
                } else if (isStringToken(this.peek()) && this.peek(1) !== TokenType.EQUALS) { // [Tag VAL]
                    const valNode = this.parseLabel()
                    attrNode.push(valNode)
                } else {
                    throw new Error('Failed to parseAttr')
                }
            }

            return attrNode
        })
    }

    // ------------------------------------------------------------------------
    // Post Parsing Transforms
    // ------------------------------------------------------------------------

    private matchTagNodes(rootNode: RootNode): RootNode {
        const transformedRoot = new RootNode()

        for (let i = 0; i < rootNode.children.length; i++) {
            const child = rootNode.children[i]

            if (nodeIsType(child, AstNodeType.StartTagNode)) {
                const end = this.findMatchingEndTag(rootNode.children, i, child.tagName)
                if (this._standaloneTags.has(child.tagName) || end) {
                    const tagNode = new TagNode(child, end?.node)
                    transformedRoot.push(tagNode)

                    // If matching end tag exists, consume all nodes between start/end (exclusive) as a subtree
                    if (end) {
                        const subRoot = new RootNode(rootNode.children.slice(i + 1, end.idx))
                        i = end.idx

                        const transformedSubRoot = this.matchTagNodes(subRoot)
                        tagNode.push(transformedSubRoot)
                    }
                } else {
                    // If no end tag exists, then treat tag as string literal
                    transformedRoot.push(new TextNode(`[${child.tagName}]`))
                }
            } else if (nodeIsType(child, AstNodeType.EndTagNode)) {
                // Encountered end tag when we're not expecting an end tag so we treat it as a string literal
                transformedRoot.push(new TextNode(`[/${child.tagName}]`))
            } else if (nodeIsType(child, AstNodeType.TextNode) || nodeIsType(child, AstNodeType.LinebreakNode)) {
                // Normal text nodes get copied
                transformedRoot.push(child)
            } else {
                throw new Error(`Unexpected child of RootNode: ${child.toString()}`)
            }
        }

        return transformedRoot
    }

    findMatchingEndTag(siblings: Array<AstNode>, startIdx: number, tagName: string): { idx: number; node: EndTagNode | LinebreakNode } | null {
        if (this._standaloneTags.has(tagName)) {
            return null
        }

        for (let i = startIdx; i < siblings.length; i++) {
            const sibling = siblings[i]
            const isEndTag =
                (nodeIsType(sibling, AstNodeType.LinebreakNode) && this._linebreakTerminatedTags.has(tagName)) ||
                (nodeIsType(sibling, AstNodeType.EndTagNode) && sibling.tagName === tagName)

            if (isEndTag) {
                return {
                    idx: i,
                    node: sibling,
                }
            }
        }

        return null
    }
}
