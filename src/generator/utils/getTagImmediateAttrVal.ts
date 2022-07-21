import type { TagNode } from '../../parser/AstNode.js'

/**
 * Gets the text of the immediate attribute of the current TagNode
 *
 *      [url=https://en.wikipedia.org]English Wikipedia[/url]
 *
 *      TagNode [url]
 *        AttrNode VAL="https://en.wikipedia.org" (returns this string)
 *          TextNode "https://en.wikipedia.org"
 *        RootNode
 *          TextNode "English Wikipedia"
 */
export function getTagImmediateAttrVal(tagNode: TagNode): string | undefined {
    if (tagNode.attributes.length !== 1) {
        return undefined
    }

    const attrNode = tagNode.attributes[0]
    return attrNode.val
}
