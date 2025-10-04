import { generateHtml } from '../../src/index.ts'
import { getBenchmarkInput } from './input/getBenchmarkInput.ts'

const input = await getBenchmarkInput()

for (let i = 0; i < 100000; i++) {
    generateHtml(input)
}
