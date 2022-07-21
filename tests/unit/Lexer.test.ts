import { validationTests } from '../data/validationTests.js'
import { xssTests } from '../data/xssTests.js'
import { Lexer, Token, TokenType } from '@/index.js'

describe('Lexer', () => {
    describe('Validation Tests', () => {
        it.each(validationTests)('$name', (test) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(test.input)
            expectValidTokens(tokens)
        })
    })

    describe('XSS Tests', () => {
        it.each(xssTests)('$name', (test) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(test.input)
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

        if (currToken.type === TokenType.BACKSLASH) {
            expect(prevToken.type).toBe(TokenType.L_BRACKET)
        }
    }
}
