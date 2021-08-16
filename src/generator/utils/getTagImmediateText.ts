import { AstNodeType, TagNode } from '../../parser/AstNode'
import { nodeIsType } from '../../parser/nodeIsType'

/**
 * Gets the text of the immediate descendant of the current TagNode
 *
 *      [url]https://en.wikipedia.org[/url]
 *
 *      TagNode [url]
 *        RootNode
 *          TextNode "https://en.wikipedia.org" (returns this string)
 */
export function getTagImmediateText(tagNode: TagNode): string | undefined {
    if (tagNode.children.length !== 1) {
        return undefined
    }

    const child = tagNode.children[0]
    if (!nodeIsType(child, AstNodeType.RootNode)) {
        return undefined
    }

    if (child.children.length !== 1) {
        return undefined
    }

    const textNode = child.children[0]
    if (!nodeIsType(textNode, AstNodeType.TextNode)) {
        return undefined
    }

    return textNode.str
}
