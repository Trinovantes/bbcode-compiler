import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export async function getBenchmarkInput(): Promise<string> {
    const dirname = fileURLToPath(new URL('.', import.meta.url))
    const fullPath = path.resolve(dirname, './test.txt')
    const fileContents = await fs.readFile(fullPath)
    return fileContents.toString()
}
