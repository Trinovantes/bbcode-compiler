import { AstNode, RootNode } from '../parser/AstNode.ts'
import { nodeIsType } from '../parser/nodeIsType.ts'
import { htmlTransforms } from './transforms/htmlTransforms.ts'
import type { Transform } from './transforms/Transform.ts'

export class Generator {
    transforms: ReadonlyMap<string, Transform>

    constructor(transforms = htmlTransforms) {
        this.transforms = new Map(transforms.map((transform) => [transform.name, transform]))
    }

    generate(root: RootNode): string {
        const stringify = (node: AstNode): string => {
            let output = ''

            if (nodeIsType(node, 'TagNode')) {
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
            } else if (nodeIsType(node, 'TextNode')) {
                output += node.str
            } else if (nodeIsType(node, 'LinebreakNode')) {
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
