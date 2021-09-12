import { AstNodeType, AstNode, AttrNode, RootNode, TagNode, TextNode, LinebreakNode, EndTagNode, StartTagNode } from '../core/Parser/AstNode'

export interface AstMap {
    [AstNodeType.RootNode]: RootNode
    [AstNodeType.LinebreakNode]: LinebreakNode
    [AstNodeType.TextNode]: TextNode
    [AstNodeType.TagNode]: TagNode
    [AstNodeType.StartTagNode]: StartTagNode
    [AstNodeType.EndTagNode]: EndTagNode
    [AstNodeType.AttrNode]: AttrNode
}

export function nodeIsType<T extends keyof AstMap>(node: AstNode, nodeType: T): node is AstMap[T] {
    return node.nodeType === nodeType
}
