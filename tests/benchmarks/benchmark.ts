import Benchmark from 'benchmark'
import { getBenchmarkInput } from './input/getBenchmarkInput'
import { runners } from './runners'

const input = await getBenchmarkInput()
const suite = new Benchmark.Suite('BBCode Comparison')

for (const [packageName, runPackage] of Object.entries(runners)) {
    suite.add(packageName, () => {
        runPackage(input)
    })
}

suite.on('cycle', (event: Benchmark.Event) => {
    console.info(String(event.target))
})

suite.on('complete', () => {
    const fastest = (suite.filter('fastest').map('name') as Array<string>)[0]
    console.info(`Fastest: ${fastest}`)
})

suite.run()
