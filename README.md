# BBCode Compiler

This is a BBCode parser and HTML generator implemented in pure TypeScript.

## Usage

```ts
import { generateHtml } from 'bbcode-compiler'

// <strong>Hello World</strong>
const html = generateHtml('[b]Hello World[/b]')
```

## Extending With Custom Tags

```ts
import { generateHtml, getTagImmediateText, htmlTransforms, getWidthHeightAttr } from 'bbcode-compiler'

const customTransforms: typeof htmlTransforms = [
    // Default tags included with this package
    ...htmlTransforms,

    // You can override a default tag by including it after the original in the transforms array
    {
        name: 'b',
        start: () => '<b>',
        end: () => '</b>',
    },

    // Create new tag
    // You should read the TypeScript interface for TagNode in src/parser/AstNode.ts
    // You can also use the included helper functions like getTagImmediateText and getWidthHeightAttr
    {
        name: 'youtube',
        skipChildren: true, // Do not actually render the "https://www.youtube.com/watch?v=dQw4w9WgXcQ" text
        start: (tagNode) => {
            const src = getTagImmediateText(tagNode)
            if (!src) {
                return false
            }

            const matches = /youtube.com\/watch\?v=(\w+)/.exec(src)
            if (!matches) {
                return false
            }

            const videoId = matches[1]
            const { width, height } = getWidthHeightAttr(tagNode)

            return `
                <iframe
                    width="${width ?? 560}"
                    height="${height ?? 315}"
                    src="https://www.youtube.com/embed/${videoId}"
                    title="YouTube Video Player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `
        },
    },
]

// <iframe
//     width="560"
//     height="315"
//     src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//     title="YouTube Video Player"
//     frameborder="0"
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//     allowfullscreen
// ></iframe>
const html = generateHtml('[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]', customTransforms)
```
