import { validationTests } from '../data/validationTests.js'
import { xssTests } from '../data/xssTests.js'
import { Lexer, type Token } from '../../src/index.js'
import { describe, test, expect } from 'vitest'

describe('Lexer', () => {
    describe('Validation Tests', () => {
        test.each(validationTests)('$name', (testCase) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(testCase.input)
            expectValidTokens(tokens)
        })
    })

    describe('XSS Tests', () => {
        test.each(xssTests)('$name', (testCase) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(testCase.input)
            expectValidTokens(tokens)
        })
    })
})

function expectValidTokens(tokens: Array<Token>) {
    if (tokens.length < 2) {
        return
    }

    for (let i = 1; i < tokens.length; i++) {
        const prevToken = tokens[i - 1]
        const currToken = tokens[i]

        expect(prevToken.offset).toBeLessThan(currToken.offset)
        expect(prevToken.offset + prevToken.length).toBe(currToken.offset)

        if (currToken.type === 'BACKSLASH') {
            expect(prevToken.type).toBe('L_BRACKET')
        }
    }
}
