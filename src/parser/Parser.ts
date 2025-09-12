import { htmlTransforms } from '../generator/transforms/htmlTransforms.js'
import { stringifyTokens, type Token } from '../lexer/Token.js'
import { isStringToken } from '../lexer/TokenType.js'
import { RootNode, AttrNode, TextNode, LinebreakNode, StartTagNode, EndTagNode, TagNode, AstNode } from './AstNode.js'
import { nodeIsType } from './nodeIsType.js'

export class Parser {
    readonly tags: Set<string>
    readonly linebreakTerminatedTags: Set<string>
    readonly standaloneTags: Set<string>

    constructor(transforms = htmlTransforms) {
        this.tags = new Set(transforms.map((transform) => transform.name))
        this.linebreakTerminatedTags = new Set(transforms.filter((transform) => transform.isLinebreakTerminated).map((transform) => transform.name.toLowerCase()))
        this.standaloneTags = new Set(transforms.filter((transform) => transform.isStandalone).map((transform) => transform.name.toLowerCase()))
    }

    parse(ogText: string, tokens: Array<Token>): RootNode {
        let idx = 0

        const parseLabel = (): string => {
            const slice = tokens.slice(idx, idx + 1)
            const label = stringifyTokens(ogText, slice)
            idx += 1 // Consume LABEL
            return label.toLowerCase()
        }

        const parseText = (endOnQuotes = false, endOnSpace = false): TextNode => {
            const startIdx = idx

            while (idx < tokens.length) {
                if (!isStringToken(tokens[idx].type)) {
                    break
                }

                if (endOnQuotes && (tokens[idx].type === 'XSS_S_QUOTE' || tokens[idx].type === 'XSS_D_QUOTE')) {
                    break
                }

                /**
                 * SPECIAL CASE:
                 * If we encounter a space, then we must split the current token into 2 tokens and only consume the first part
                 *
                 *      a b    ->      a b
                 *      |              | |
                 *      |              | idx (new)
                 *      |              |
                 *      idx            consumed
                 *
                 * Note: We only handle endOnSpace special case when we don't expect the current text to endOnQuotes
                 * If it endOnQuotes, then it implies that it opened with quotes (and thus we need an enclosing/matching quote)
                 */
                if (endOnSpace && !endOnQuotes) {
                    const origStr = stringifyTokens(ogText, [tokens[idx]])
                    const spaceIdx = origStr.indexOf(' ')

                    if (spaceIdx >= 0) {
                        const oldToken: Token = {
                            type: 'STR',
                            offset: tokens[idx].offset,
                            length: spaceIdx,
                        }

                        const newToken: Token = {
                            type: 'STR',
                            offset: tokens[idx].offset + spaceIdx,
                            length: tokens[idx].length - spaceIdx,
                        }

                        tokens.splice(idx + 0, 1, oldToken)
                        tokens.splice(idx + 1, 0, newToken)
                        idx += 1
                        break
                    }
                }

                idx += 1
            }

            const slice = tokens.slice(startIdx, idx)
            const str = stringifyTokens(ogText, slice)

            return new TextNode(str)
        }

        const parseAttr = (): AttrNode | null => {
            if (idx + 1 >= tokens.length) {
                return null
            }

            const attrNode = new AttrNode()

            if (tokens[idx].type === 'EQUALS' && isStringToken(tokens[idx + 1].type)) { // [Tag = VAL ...] or [Tag = "VAL"]
                idx += 1 // Consume EQUALS

                const openedWithQuotes = tokens[idx].type === 'XSS_S_QUOTE' || tokens[idx].type === 'XSS_D_QUOTE'
                if (openedWithQuotes) {
                    idx += 1
                }

                const valNode = parseText(openedWithQuotes, true)
                attrNode.addChild(valNode)

                if (openedWithQuotes) {
                    if (tokens[idx].type !== 'XSS_S_QUOTE' && tokens[idx].type !== 'XSS_D_QUOTE') {
                        return null
                    }

                    idx += 1
                }
            } else if (isStringToken(tokens[idx].type) && tokens[idx + 1].type === 'EQUALS' && (idx + 2 < tokens.length && isStringToken(tokens[idx + 2].type))) { // [Tag KEY = VAL ...] or [Tag KEY = "VAL" ...]
                const keyNode = parseText()
                attrNode.addChild(keyNode)

                idx += 1 // Consume EQUALS

                const openedWithQuotes = tokens[idx].type === 'XSS_S_QUOTE' || tokens[idx].type === 'XSS_D_QUOTE'
                if (openedWithQuotes) {
                    idx += 1
                }

                const valNode = parseText(openedWithQuotes, true)

                if (openedWithQuotes) {
                    if (tokens[idx].type !== 'XSS_S_QUOTE' && tokens[idx].type !== 'XSS_D_QUOTE') {
                        return null
                    }

                    idx += 1
                }

                attrNode.addChild(valNode)
            } else if (isStringToken(tokens[idx].type) && tokens[idx + 1].type !== 'EQUALS') { // [Tag VAL ...]
                const valNode = parseText()
                attrNode.addChild(valNode)
            } else {
                return null
            }

            return attrNode
        }

        const parseTag = (): StartTagNode | EndTagNode | null => {
            if (idx + 1 >= tokens.length) {
                return null
            }

            if (tokens[idx].type !== 'L_BRACKET') {
                return null
            }

            // If L_BRACKET is followed by text, then it must be StartTag or is invalid
            if (isStringToken(tokens[idx + 1].type)) {
                const startIdx = idx
                idx += 1 // Consume L_BRACKET

                const labelText = parseLabel()
                if (!this.tags.has(labelText)) {
                    return null
                }

                const attrNodes = new Array<AttrNode>()
                while (true) {
                    const attrNode = parseAttr()
                    if (attrNode === null) {
                        break
                    }

                    attrNodes.push(attrNode)
                }

                if (tokens[idx].type !== 'R_BRACKET') {
                    return null
                }

                idx += 1 // Consume R_BRACKET

                const slice = tokens.slice(startIdx, idx)
                const ogTag = stringifyTokens(ogText, slice)
                const startTagNode = new StartTagNode(labelText, ogTag, attrNodes)
                return startTagNode
            }

            // If L_BRACKET is followed by BACKSLASH, then it must be EndTag or is invalid
            if (tokens[idx + 1].type === 'BACKSLASH') {
                const startIdx = idx
                idx += 1 // Consume L_BRACKET
                idx += 1 // Consume BACKSLASH

                const labelText = parseLabel()
                if (!this.tags.has(labelText)) {
                    return null
                }

                if (tokens[idx].type !== 'R_BRACKET') {
                    return null
                }

                idx += 1 // Consume R_BRACKET

                const slice = tokens.slice(startIdx, idx)
                const ogTag = stringifyTokens(ogText, slice)
                const endTagNode = new EndTagNode(labelText, ogTag)
                return endTagNode
            }

            return null
        }

        const parseRoot = (): RootNode => {
            const root = new RootNode()

            while (idx < tokens.length) {
                if (tokens[idx].type === 'L_BRACKET') {
                    const startIdx = idx
                    const tagNode = parseTag()

                    if (tagNode !== null) {
                        root.addChild(tagNode)
                    } else {
                        const invalidTokens = tokens.slice(startIdx, idx)
                        const str = stringifyTokens(ogText, invalidTokens)
                        const textNode = new TextNode(str)
                        root.addChild(textNode)
                    }
                } else if (tokens[idx].type === 'LINEBREAK') {
                    idx += 1 // Consume LINEBREAK
                    root.addChild(new LinebreakNode())
                } else {
                    const startIdx = idx

                    // Advance until we see the start of another RootNode's child (TagNode or LinebreakNode)
                    while (idx < tokens.length && tokens[idx].type !== 'L_BRACKET' && tokens[idx].type !== 'LINEBREAK') {
                        idx += 1
                    }

                    const slice = tokens.slice(startIdx, idx)
                    const str = stringifyTokens(ogText, slice)
                    root.addChild(new TextNode(str))
                }
            }

            return root
        }

        let root = parseRoot()
        root = this.matchTagNodes(root)
        return root
    }

    // ------------------------------------------------------------------------
    // Post Parsing Transforms
    // ------------------------------------------------------------------------

    private matchTagNodes(rootNode: RootNode): RootNode {
        const transformedRoot = new RootNode()

        for (let i = 0; i < rootNode.children.length; i++) {
            const child = rootNode.children[i]

            if (nodeIsType(child, 'StartTagNode')) {
                const endTag = this.findMatchingEndTag(rootNode.children, i, child.tagName)
                const isStandalone = this.standaloneTags.has(child.tagName)

                if (endTag || isStandalone) {
                    const tagNode = new TagNode(child, endTag?.node)
                    transformedRoot.addChild(tagNode)

                    // If matching end tag exists, consume all nodes between start/end (exclusive) as a subtree
                    if (endTag) {
                        const subRoot = new RootNode(rootNode.children.slice(i + 1, endTag.idx))
                        i = endTag.idx

                        const transformedSubRoot = this.matchTagNodes(subRoot)
                        tagNode.addChild(transformedSubRoot)
                    }
                } else {
                    // If no end tag exists, then treat tag as string literal
                    transformedRoot.addChild(new TextNode(child.ogTag))
                }
            } else if (nodeIsType(child, 'EndTagNode')) {
                // Encountered end tag when we're not expecting an end tag so we treat it as a string literal
                transformedRoot.addChild(new TextNode(child.ogTag))
            } else if (nodeIsType(child, 'TextNode')) {
                // Normal text nodes get copied
                transformedRoot.addChild(child)
            } else if (nodeIsType(child, 'LinebreakNode')) {
                // Linebreak nodes get copied
                transformedRoot.addChild(child)
            } else {
                throw new Error('Unexpected child of RootNode')
            }
        }

        return transformedRoot
    }

    private findMatchingEndTag(siblings: Array<AstNode>, startIdx: number, tagName: string): { idx: number; node: EndTagNode | LinebreakNode } | null {
        if (this.standaloneTags.has(tagName)) {
            return null
        }

        for (let i = startIdx; i < siblings.length; i++) {
            const sibling = siblings[i]
            const isEndTag =
                (nodeIsType(sibling, 'LinebreakNode') && this.linebreakTerminatedTags.has(tagName)) ||
                (nodeIsType(sibling, 'EndTagNode') && sibling.tagName === tagName)

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
