import { generateHtml } from '../../src/index.js'
import { getBenchmarkInput } from './input/getBenchmarkInput.js'

const input = await getBenchmarkInput()

for (let i = 0; i < 100000; i++) {
    generateHtml(input)
}
