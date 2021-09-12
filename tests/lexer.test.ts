import { Lexer } from '@/Shinoa/core/Lexer/Lexer'
import { Token, TokenType } from '@/Shinoa/core/Lexer/Token'
import { validationTests, xssTests } from './data/data'
import { getTestCase } from './data/getTestCase'

describe('Lexer', () => {
    test('smoke', () => {
        expect(true).toBe(true)
    })

    describe('Validation Tests', () => {
        for (const test of validationTests) {
            it(test.name, () => {
                const lexer = new Lexer(test.input)
                const tokens = lexer.tokenize()

                expect(lexer.isValidState()).toBe(true)
                expectValidTokens(tokens)
            })
        }
    })

    describe('XSS Tests', () => {
        for (const test of xssTests) {
            it(test.name, () => {
                const lexer = new Lexer(test.input)
                const tokens = lexer.tokenize()

                expect(lexer.isValidState()).toBe(true)
                expectValidTokens(tokens)
            })
        }
    })

    test('test1', async() => {
        const input = await getTestCase('test1.txt')
        const lexer = new Lexer(input)
        const tokens = lexer.tokenize()

        expect(tokens.length).toBeGreaterThan(0)
        expect(tokens[tokens.length - 1].type).toBe(TokenType.LINEBREAK)
        expect(tokens[tokens.length - 1].str).toBe('\n')

        expect(lexer.isValidState()).toBe(true)
        expectValidTokens(tokens)
    })
})

function expectValidTokens(tokens: ReadonlyArray<Token>) {
    if (tokens.length < 2) {
        return
    }

    for (let i = 1; i < tokens.length; i++) {
        const prevToken = tokens[i - 1]
        const currToken = tokens[i]

        expect(prevToken.lineNum).toBeLessThanOrEqual(currToken.lineNum)

        if (prevToken.lineNum === currToken.lineNum) {
            expect(prevToken.linePos).toBeLessThanOrEqual(currToken.linePos)
        }

        if (currToken.type === TokenType.BACKSLASH) {
            expect(prevToken.type).toBe(TokenType.L_BRACKET)
        }
    }
}
