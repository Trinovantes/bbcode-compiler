export interface ValidationTestCase {
    name: string
    input: string
    expectedOutputs: Array<string>
}

export interface XssTestCase {
    name: string
    input: string
    unexpectedSubstrings: Array<string>
}
