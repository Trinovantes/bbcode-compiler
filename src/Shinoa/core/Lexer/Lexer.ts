import { symbolTable, Token, TokenType } from './Token'

export class Lexer {
    private _input: Readonly<string>
    private _tokens: Array<Token> = []
    private _idx = 0
    private _lineNum = 0
    private _linePos = 0

    constructor(input: string) {
        this._input = input
    }

    tokenize(): ReadonlyArray<Token> {
        this._tokens = []
        this._idx = 0
        this._lineNum = 0
        this._linePos = 0

        while (this._idx < this._input.length) {
            this.consume()
        }

        return this._tokens
    }

    isValidState(): boolean {
        return this._idx === 0 || this._idx === this._input.length
    }

    private get _currType(): TokenType {
        const currTokenType = symbolTable[this._currChar] ?? TokenType.STR
        const prevTokenType = this._tokens[this._tokens.length - 1]?.type

        // Only parsed as BACKSLASH if prev char was L_BRACKET
        if (currTokenType === TokenType.BACKSLASH) {
            if (prevTokenType === TokenType.L_BRACKET) {
                return TokenType.BACKSLASH
            } else {
                return TokenType.STR
            }
        }

        return currTokenType
    }

    private get _currChar(): string {
        return this._input.charAt(this._idx) // Assumes UTF-16
    }

    private moveBack(): void {
        this._idx -= 1
        this._linePos -= 1
    }

    private moveForward(): void {
        this._idx += 1
        this._linePos += 1
    }

    private consume(): void {
        const consumedLinebreak = this._currType === TokenType.LINEBREAK

        if (this._currType !== TokenType.STR) {
            // Special token type
            this._tokens.push({
                type: this._currType,
                str: this._currChar,
                lineNum: this._lineNum,
                linePos: this._linePos,
            })
        } else {
            // Regular string, need to consume until EOF or another symbol
            const startIdx = this._idx
            const startLinePos = this._linePos
            let len = 0

            while (this._idx < this._input.length) {
                if (this._currType !== TokenType.STR) {
                    this.moveBack()
                    break
                }

                this.moveForward()
                len += 1
            }

            this._tokens.push({
                type: TokenType.STR,
                str: this._input.substr(startIdx, len),
                lineNum: this._lineNum,
                linePos: startLinePos,
            })
        }

        this.moveForward()

        if (consumedLinebreak) {
            this._lineNum += 1
            this._linePos = 0
        }
    }
}
