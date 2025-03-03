import type { AstNode, AttrNode, RootNode, TagNode, TextNode, LinebreakNode, EndTagNode, StartTagNode } from './AstNode.js'

type AstMap = {
    ['RootNode']: RootNode
    ['LinebreakNode']: LinebreakNode
    ['TextNode']: TextNode
    ['TagNode']: TagNode
    ['StartTagNode']: StartTagNode
    ['EndTagNode']: EndTagNode
    ['AttrNode']: AttrNode
}

export function nodeIsType<T extends keyof AstMap>(node: AstNode, nodeType: T): node is AstMap[T] {
    return node.nodeType === nodeType
}
