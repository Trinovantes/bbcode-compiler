import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'tests': path.resolve(__dirname, 'tests'),
        },
    },

    test: {
        dir: './tests',
        silent: Boolean(process.env.CI),
    },

    build: {
        minify: false,
        sourcemap: true,

        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            name: 'BbcodeCompiler',
            fileName: 'index',
        },
    },

    plugins: [
        dts({
            insertTypesEntry: true,
            tsconfigPath: path.resolve(__dirname, './tsconfig.prod.json'),
        }),
    ],
})
