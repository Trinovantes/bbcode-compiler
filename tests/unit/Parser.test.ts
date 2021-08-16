import { validationTests } from '../data/validationTests'
import { xssTests } from '../data/xssTests'
import { Lexer, Parser } from '@/index'

describe('Parser', () => {
    describe('Validation Tests', () => {
        it.each(validationTests)('$name', (test) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(test.input)

            const parser = new Parser()
            const root = parser.parse(test.input, tokens)

            expect(root.isValid()).toBe(true)
        })
    })

    describe('XSS Tests', () => {
        it.each(xssTests)('$name', (test) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(test.input)

            const parser = new Parser()
            const root = parser.parse(test.input, tokens)

            expect(root.isValid()).toBe(true)
        })
    })
})
