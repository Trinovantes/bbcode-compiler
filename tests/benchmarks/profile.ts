import { generateHtml } from '../../src'
import { getBenchmarkInput } from './input/getBenchmarkInput'

const input = await getBenchmarkInput()

for (let i = 0; i < 100000; i++) {
    generateHtml(input)
}
