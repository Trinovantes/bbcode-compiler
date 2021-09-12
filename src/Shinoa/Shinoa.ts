import type { Rule } from './core/Generator/Rule'
import type { RootNode } from './core/Parser/AstNode'
import { Lexer } from './core/Lexer/Lexer'
import { Parser } from './core/Parser/Parser'

export interface ShinoaOptions {
    printDebugInfo: boolean
    rules: Array<Rule>
}

export class Shinoa {
    private _root: RootNode

    constructor(input: string, opts?: ShinoaOptions) {
        const lexer = new Lexer(input)
        const tokens = lexer.tokenize()

        const parser = new Parser(tokens, opts?.printDebugInfo, opts?.rules)
        this._root = parser.parse()
    }

    generateHtml(): string {
        return this._root.toString()
    }

    generateMarkdown(): string {
        return this._root.toString()
    }
}
