import { Shinoa } from '@/index'
import { validationTests, xssTests } from './data/data'

describe('Main', () => {
    test('smoke', () => {
        expect(true).toBe(true)
    })

    describe('Validation Tests', () => {
        for (const test of validationTests) {
            it(test.name, () => {
                const shinoa = new Shinoa(test.input)
                const output = shinoa.generateHtml()
                expect(output).toBe(test.expectedOutput)
            })
        }
    })

    describe('XSS Tests', () => {
        for (const test of xssTests) {
            it(test.name, () => {
                const shinoa = new Shinoa(test.input)
                const output = shinoa.generateHtml()
                expect(output).toBe(test.expectedOutput)
            })
        }
    })
})
