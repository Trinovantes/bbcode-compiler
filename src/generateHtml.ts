import { Generator } from './generator/Generator.ts'
import { htmlTransforms } from './generator/transforms/htmlTransforms.ts'
import { Lexer } from './lexer/Lexer.ts'
import { Parser } from './parser/Parser.ts'

export function generateHtml(input: string, transforms = htmlTransforms): string {
    const lexer = new Lexer()
    const tokens = lexer.tokenize(input)

    const parser = new Parser(transforms)
    const root = parser.parse(input, tokens)

    const generator = new Generator(transforms)
    return generator.generate(root)
}
