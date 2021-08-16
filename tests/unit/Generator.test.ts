import { validationTests } from '../data/validationTests'
import { xssTests } from '../data/xssTests'
import { generateHtml } from '@/index'

describe('Generator', () => {
    describe('Validation Tests', () => {
        it.each(validationTests)('$name', (test) => {
            const output = generateHtml(test.input)
            expect(test.expectedOutputs.includes(output)).toBe(true)
        })
    })

    describe('XSS Tests', () => {
        it.each(xssTests)('$name', (test) => {
            const output = generateHtml(test.input)
            for (const unexpectedSubstring of test.unexpectedSubstrings) {
                expect(output.includes(unexpectedSubstring)).toBe(false)
            }
        })
    })
})
