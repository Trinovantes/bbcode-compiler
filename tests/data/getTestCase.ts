import fs from 'fs/promises'
import path from 'path'

export async function getTestCase(fileName: string): Promise<string> {
    const fullPath = path.resolve('./tests/data/raw', fileName)
    const fileContents = await fs.readFile(fullPath)
    return fileContents.toString()
}
