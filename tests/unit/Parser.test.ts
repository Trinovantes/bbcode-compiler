import { validationTests } from '../data/validationTests.js'
import { xssTests } from '../data/xssTests.js'
import { Lexer, Parser } from '@/index.js'
import { describe, test, expect } from 'vitest'

describe('Parser', () => {
    describe('Validation Tests', () => {
        test.each(validationTests)('$name', (testCase) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(testCase.input)

            const parser = new Parser()
            const root = parser.parse(testCase.input, tokens)

            expect(root.isValid()).toBe(true)
        })
    })

    describe('XSS Tests', () => {
        test.each(xssTests)('$name', (testCase) => {
            const lexer = new Lexer()
            const tokens = lexer.tokenize(testCase.input)

            const parser = new Parser()
            const root = parser.parse(testCase.input, tokens)

            expect(root.isValid()).toBe(true)
        })
    })
})
