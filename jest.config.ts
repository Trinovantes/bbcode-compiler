import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    bail: true,

    setupFiles: [
        './tests/setup.ts',
    ],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}

export default config
