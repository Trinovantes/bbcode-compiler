import Benchmark from 'benchmark'
import { getBenchmarkInput } from './input/getBenchmarkInput.js'
import { benchmarkRunners } from './benchmarkRunners.js'

const input = await getBenchmarkInput()
const suite = new Benchmark.Suite('BBCode Comparison')

for (const { name, run } of benchmarkRunners) {
    suite.add(name, () => {
        run(input)
    })
}

suite.on('cycle', (event: Benchmark.Event) => {
    console.info(String(event.target as unknown as string))
})

suite.on('complete', () => {
    const fastest = (suite.filter('fastest').map('name') as Array<string>)[0]
    console.info(`Fastest: ${fastest}`)
})

suite.run()
