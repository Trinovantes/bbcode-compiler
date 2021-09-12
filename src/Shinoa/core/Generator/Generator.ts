
// private generate(node: AstNode, depth = 0): string {
//     if (node.type === AstNodeType.TEXT) {
//         const textNode = node as TextNode
//         if (textNode.tokenType === TokenType.LINEBREAK) {
//             return ''
//         }

//         if (depth === 1) {
//             return `<p>${textNode.str}</p>`
//         } else {
//             return textNode.str
//         }
//     }

//     let s = ''
//     let i = 0

//     while (i < node.children.length) {
//         const child = node.children[i]
//         if (child.type === AstNodeType.TAG) {
//             const [html, numChildrenProcessed] = this.generateTagNode(child as TagNode, i, node.children, depth + 1)
//             s += html
//             i += numChildrenProcessed
//         } else {
//             s += this.generate(child, depth + 1)
//             i += 1
//         }
//     }

//     return s
// }

// private generateTagNode(tagNode: TagNode, tagNodeIdx: number, siblings: Array<AstNode>, depth = 0): [string, number] {
//     const tagName = tagNode.tagName

//     // If no generator found, return raw string
//     const generator = this._allowedTags.get(tagName)
//     if (!generator) {
//         if (tagNode.isOpen) {
//             return [`[${tagName}]`, 1]
//         } else {
//             return [`[/${tagName}]`, 1]
//         }
//     }

//     // Assume this function is always called on an open TagNode
//     // If we encounted an unexpected close TagNode, then return its raw string
//     if (!tagNode.isOpen) {
//         return [`[/${tagName}]`, 1]
//     }

//     // If it's a standalone tag, then simply emit its opening tag
//     if (!generator.hasCloseTag && !generator.closeByNewLine) {
//         return [generator.generate(tagNode.attrs), 1]
//     }

//     let foundClosingTag = false
//     const innerContents = new StmtsNode()

//     if (generator.closeByNewLine) {
//         for (let i = tagNodeIdx + 1; i < siblings.length; i++) {
//             if (siblings[i].type === AstNodeType.TEXT && (siblings[i] as TextNode).tokenType === TokenType.LINEBREAK) {
//                 foundClosingTag = true
//                 break
//             }

//             innerContents.push(siblings[i])
//         }
//     } else {
//         for (let i = tagNodeIdx + 1; i < siblings.length; i++) {
//             if (siblings[i].type === AstNodeType.TAG && (siblings[i] as TagNode).tagName === tagName && !(siblings[i] as TagNode).isOpen) {
//                 foundClosingTag = true
//                 break
//             }

//             innerContents.push(siblings[i])
//         }
//     }

//     // Invalid open TagNode so emit its raw string
//     if (!foundClosingTag) {
//         return [`[${tagName}]`, 1]
//     }

//     const innerHtml = this.generate(innerContents, depth + 1)
//     const tagHtml = generator.generate(tagNode.attrs, innerHtml)
//     return [tagHtml, 1 + innerContents.children.length + 1] // +1 to include open tag, +1 to include close tag
// }
