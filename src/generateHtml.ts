import { Generator } from './generator/Generator'
import { htmlTransforms } from './generator/transforms/htmlTransforms'
import { Lexer } from './lexer/Lexer'
import { Parser } from './parser/Parser'

export function generateHtml(input: string, transforms = htmlTransforms): string {
    const lexer = new Lexer()
    const tokens = lexer.tokenize(input)

    const parser = new Parser(transforms)
    const root = parser.parse(input, tokens)

    const generator = new Generator(transforms)
    return generator.generate(root)
}
