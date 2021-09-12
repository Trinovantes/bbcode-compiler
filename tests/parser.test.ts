import { Lexer } from '@/Shinoa/core/Lexer/Lexer'
import { Parser } from '@/Shinoa/core/Parser/Parser'
import { validationTests, xssTests } from './data/data'
import { getTestCase } from './data/getTestCase'

describe('Parser', () => {
    test('smoke', () => {
        expect(true).toBe(true)
    })

    describe('Validation Tests', () => {
        for (const test of validationTests) {
            it(test.name, () => {
                const lexer = new Lexer(test.input)
                const tokens = lexer.tokenize()

                const parser = new Parser(tokens)
                const root = parser.parse()

                expect(root.isValid()).toBe(true)
            })
        }
    })

    describe('XSS Tests', () => {
        for (const test of xssTests) {
            it(test.name, () => {
                const lexer = new Lexer(test.input)
                const tokens = lexer.tokenize()

                const parser = new Parser(tokens)
                const root = parser.parse()

                expect(root.isValid()).toBe(true)
            })
        }
    })

    test('test1', async() => {
        const input = await getTestCase('test1.txt')

        const lexer = new Lexer(input)
        const tokens = lexer.tokenize()

        const parser = new Parser(tokens)
        const root = parser.parse()

        expect(root.isValid()).toBe(true)
    })
})
