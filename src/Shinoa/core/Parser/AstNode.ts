/**

Haven't formally verified this grammar but it should be LR(2)

The root's intermediate state has StartTag/EndTag because it's easier to first parse them as independant nodes
than to parse a StartTag and find the matching EndTag since we can only lookahead by 1 token

Trying to lookahead by 4 tokens after each advancement to determine the end of the sub-root will greatly affect performance
    1 "["
    2 "/"
    3 "LABEL"
    4 "]"

---

Root <- (Tag | StartTag | EndTag | Text | Linebreak)*

Text <-
| {XSS Characters}.
| STR.

Linebreak <-
| LINEBREAK.

Tag      <- StartTag Root EndTag
StartTag <- L_BRACKET           Text Attr* R_BRACKET
EndTag   <- L_BRACKET BACKSLASH Text       R_BRACKET

Attr <-
| STR EQUALS STR
| EQUALS STR
| STR

*/

import type { Token } from '../Lexer/Token'
import { tokensToString } from '@/Shinoa/utils/tokensToString'
import { nodeIsType } from '@/Shinoa/utils/nodeIsType'

// ----------------------------------------------------------------------------
// AstNode
// ----------------------------------------------------------------------------

export const enum AstNodeType {
    RootNode,
    TextNode,
    LinebreakNode,
    TagNode,
    StartTagNode,
    EndTagNode,
    AttrNode,
}

export function nodeTypeToString(nodeType: AstNodeType): string {
    switch (nodeType) {
        case AstNodeType.RootNode: return 'RootNode'
        case AstNodeType.TextNode: return 'TextNode'
        case AstNodeType.LinebreakNode: return 'LinebreakNode'
        case AstNodeType.TagNode: return 'TagNode'
        case AstNodeType.StartTagNode: return 'StartTagNode'
        case AstNodeType.EndTagNode: return 'EndTagNode'
        case AstNodeType.AttrNode: return 'AttrNode'
    }
}

export abstract class AstNode {
    readonly abstract nodeType: AstNodeType
    readonly children: Array<AstNode>

    constructor(children: Array<AstNode> = []) {
        this.children = children
    }

    push(node: AstNode): void {
        this.children.push(node)
    }

    isValid(): boolean {
        for (const child of this.children) {
            if (!child.isValid()) {
                return false
            }
        }

        return true
    }

    toShortString(): string {
        return nodeTypeToString(this.nodeType)
    }

    toString(depth = 0): string {
        let s = ' '.repeat(depth * 2) + this.toShortString()

        for (const child of this.children) {
            s += '\n' + child.toString(depth + 1)
        }

        return s
    }
}

// ----------------------------------------------------------------------------
// Root
// ----------------------------------------------------------------------------

export class RootNode extends AstNode {
    readonly nodeType = AstNodeType.RootNode

    override isValid(): boolean {
        for (const child of this.children) {
            if (child.nodeType !== AstNodeType.TagNode &&
                child.nodeType !== AstNodeType.TextNode &&
                child.nodeType !== AstNodeType.LinebreakNode) {
                return false
            }
        }

        return super.isValid()
    }
}

// ----------------------------------------------------------------------------
// Text
// ----------------------------------------------------------------------------

export class TextNode extends AstNode {
    readonly nodeType = AstNodeType.TextNode
    readonly str: string

    constructor(val: string | Array<Token>) {
        super()

        if (typeof val === 'string') {
            this.str = val
        } else {
            this.str = tokensToString(val)
        }
    }

    override isValid(): boolean {
        return super.isValid() && this.children.length === 0
    }

    override toShortString(): string {
        return `${super.toShortString()} "${this.str}"`
    }
}

export class LinebreakNode extends AstNode {
    readonly nodeType = AstNodeType.LinebreakNode

    override toShortString(): string {
        return `${super.toShortString()} "\\n"`
    }
}

// ----------------------------------------------------------------------------
// Tag
// ----------------------------------------------------------------------------

export class StartTagNode extends AstNode {
    readonly nodeType = AstNodeType.StartTagNode
    readonly tagName: string

    constructor(tagName: string) {
        super()
        this.tagName = tagName
    }

    override isValid(): boolean {
        for (const child of this.children) {
            if (child.nodeType !== AstNodeType.AttrNode) {
                return false
            }
        }

        return super.isValid()
    }

    override toShortString(): string {
        return `${super.toShortString()} [${this.tagName}]`
    }
}

export class EndTagNode extends AstNode {
    readonly nodeType = AstNodeType.EndTagNode
    readonly tagName: string

    constructor(tagName: string) {
        super()
        this.tagName = tagName
    }

    override isValid(): boolean {
        return super.isValid() && this.children.length === 0
    }

    override toShortString(): string {
        return `${super.toShortString()} [/${this.tagName}]`
    }
}

export class TagNode extends AstNode {
    readonly nodeType = AstNodeType.TagNode
    readonly startTag: StartTagNode
    readonly endTag?: EndTagNode | LinebreakNode

    constructor(startTag: StartTagNode, endTag?: EndTagNode | LinebreakNode) {
        super()
        this.startTag = startTag
        this.endTag = endTag
    }

    get tagName(): string {
        return this.startTag.tagName
    }

    get attrs(): Record<string, string> {
        const attrs: Record<string, string> = {}

        for (const attrNode of this.startTag.children) {
            if (!nodeIsType(attrNode, AstNodeType.AttrNode)) {
                throw new Error('Invalid AttrNode')
            }

            attrs[attrNode.key] = attrNode.val
        }

        return attrs
    }

    override isValid(): boolean {
        if (!super.isValid()) {
            return false
        }

        if (this.endTag && nodeIsType(this.endTag, AstNodeType.EndTagNode)) {
            return this.startTag.tagName === this.endTag.tagName
        }

        if (this.children.length > 0) {
            return this.children.length === 1 && this.children[0].nodeType === AstNodeType.RootNode
        }

        return true
    }

    override toShortString(): string {
        return `${super.toShortString()} [${this.tagName}]`
    }
}

// ----------------------------------------------------------------------------
// Attr
// ----------------------------------------------------------------------------

export class AttrNode extends AstNode {
    readonly nodeType = AstNodeType.AttrNode

    static readonly DEFAULT_KEY = 'default'

    get key(): string {
        switch (this.children.length) {
            case 1: {
                return AttrNode.DEFAULT_KEY
            }
            case 2: {
                if (!nodeIsType(this.children[0], AstNodeType.TextNode)) {
                    throw new Error('Invalid TextNode')
                }

                return this.children[0].str
            }
        }

        throw new Error('Invalid AttrNode')
    }

    get val(): string {
        switch (this.children.length) {
            case 1: {
                if (!nodeIsType(this.children[0], AstNodeType.TextNode)) {
                    throw new Error('Invalid TextNode')
                }

                return this.children[0].str
            }
            case 2: {
                if (!nodeIsType(this.children[1], AstNodeType.TextNode)) {
                    throw new Error('Invalid TextNode')
                }

                return this.children[1].str
            }
        }

        throw new Error('Invalid AttrNode')
    }

    override isValid(): boolean {
        return super.isValid() && (this.children.length >= 1 && this.children.length <= 2)
    }

    override toShortString(): string {
        let s = super.toShortString()

        switch (this.children.length) {
            case 1: {
                s += ` VAL=${this.val}`
                break
            }
            case 2: {
                s += ` KEY=${this.key} VAL=${this.val}`
                break
            }
        }

        return s
    }
}
