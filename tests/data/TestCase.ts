export type ValidationTestCase = {
    name: string
    input: string
    expectedOutputs: Array<string>
}

export type XssTestCase = {
    name: string
    input: string
    unexpectedSubstrings: Array<string>
}
