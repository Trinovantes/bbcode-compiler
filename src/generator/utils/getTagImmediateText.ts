import { TagNode } from '../../parser/AstNode.js'
import { nodeIsType } from '../../parser/nodeIsType.js'

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
    if (!nodeIsType(child, 'RootNode')) {
        return undefined
    }

    if (child.children.length !== 1) {
        return undefined
    }

    const textNode = child.children[0]
    if (!nodeIsType(textNode, 'TextNode')) {
        return undefined
    }

    return textNode.str
}
