import { Generator, getTagImmediateText, htmlTransforms, Lexer, getWidthHeightAttr, Parser, stringifyTokens } from '../../src/index.js'

const customTransforms: typeof htmlTransforms = [
    ...htmlTransforms,
    {
        name: 'b',
        start: () => '<b>',
        end: () => '</b>',
    },
    {
        name: 'youtube',
        skipChildren: true,
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

const input = '[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]'

const lexer = new Lexer()
const tokens = lexer.tokenize(input)
for (let i = 0; i < tokens.length; i++) {
    const str = stringifyTokens(input, [tokens[i]])
    console.log(tokens[i], str === '\n' ? '\\n' : `"${str}"`)
}
console.log()

const parser = new Parser(customTransforms)
const root = parser.parse(input, tokens)
console.log(root.toString())
console.log()

const generator = new Generator(customTransforms)
console.log(generator.generate(root))
console.log()
