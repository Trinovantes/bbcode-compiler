import type { TagNode } from '../../parser/AstNode.js'

/**
 * Determines if the StartTag has an attribute of "1" to indicate that it's an ordered list
 *
 *      [list=1]
 *
 *      TagNode [list]
 *        AttrNode VAL="1"
 *          TextNode "1"
 *        RootNode
 *          TagNode [*]
 *            RootNode
 *              TextNode "Entry 1"
 *          TagNode [*]
 *            RootNode
 *              TextNode "Entry 2"
 */
export function isOrderedList(node: TagNode): boolean {
    for (const child of node.attributes) {
        const val = child.val
        if (val === '1') {
            return true
        }
    }

    return false
}
