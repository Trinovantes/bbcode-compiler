import type { TagNode } from '../../parser/AstNode.js'

/**
 * Gets the width/height attributes of the TagNode if they exist
 *
 *      [img 500x300]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]
 *
 *      RootNode
 *        TagNode [img] (returns width:500, height:300)
 *          AttrNode VAL="500x300"
 *            TextNode " 500x300"
 *          RootNode
 *            TextNode "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png"
 *
 *      [img width=500 height=300]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]
 *
 *      RootNode
 *        TagNode [img] (returns width:500, height:300)
 *          AttrNode KEY="width" VAL="500"
 *            TextNode " width"
 *            TextNode "500"
 *          AttrNode KEY="height" VAL="300"
 *            TextNode " height"
 *            TextNode "300"
 *          RootNode
 *            TextNode "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png
 */
export function getWidthHeightAttr(tagNode: TagNode): { width?: string; height?: string } {
    let width: string | undefined
    let height: string | undefined

    for (const child of tagNode.attributes) {
        if (child.key === 'width') {
            width = child.val
        }
        if (child.key === 'height') {
            height = child.val
        }

        const matches = /(\d+)x(\d+)/.exec(child.val)
        if (matches) {
            width = matches[1]
            height = matches[2]
        }
    }

    return {
        width,
        height,
    }
}
