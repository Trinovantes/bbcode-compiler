import { Generator } from './generator/Generator.js'
import { htmlTransforms } from './generator/transforms/htmlTransforms.js'
import { Lexer } from './lexer/Lexer.js'
import { Parser } from './parser/Parser.js'

export function generateHtml(input: string, transforms = htmlTransforms): string {
    const lexer = new Lexer()
    const tokens = lexer.tokenize(input)

    const parser = new Parser(transforms)
    const root = parser.parse(input, tokens)

    const generator = new Generator(transforms)
    return generator.generate(root)
}
