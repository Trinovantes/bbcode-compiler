import { AstNode, AstNodeType, RootNode } from '../parser/AstNode.js'
import { nodeIsType } from '../parser/nodeIsType.js'
import { htmlTransforms } from './transforms/htmlTransforms.js'
import type { Transform } from './transforms/Transform.js'

export class Generator {
    transforms: ReadonlyMap<string, Transform>

    constructor(transforms = htmlTransforms) {
        this.transforms = new Map(transforms.map((transform) => [transform.name, transform]))
    }

    generate(root: RootNode): string {
        const stringify = (node: AstNode): string => {
            let output = ''

            if (nodeIsType(node, AstNodeType.TagNode)) {
                const tagName = node.tagName
                const transform = this.transforms.get(tagName)
                if (!transform) {
                    throw new Error(`Unrecognized bbcode ${node.tagName}`)
                }

                const renderedStartTag = transform.start(node)
                const renderedEndTag = transform.end?.(node) ?? ''
                const isInvalidTag = renderedStartTag === false

                if (isInvalidTag) {
                    output += node.ogStartTag
                } else {
                    output += renderedStartTag
                }

                if (!transform.skipChildren || isInvalidTag) {
                    for (const child of node.children) {
                        output += stringify(child)
                    }
                }

                if (isInvalidTag) {
                    output += node.ogEndTag
                } else {
                    output += renderedEndTag
                }
            } else if (nodeIsType(node, AstNodeType.TextNode)) {
                output += node.str
            } else if (nodeIsType(node, AstNodeType.LinebreakNode)) {
                output += '\n'
            } else {
                for (const child of node.children) {
                    output += stringify(child)
                }
            }

            return output
        }

        return stringify(root)
    }
}
