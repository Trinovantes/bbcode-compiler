import { symbolTable } from './TokenType.js'
import type { Token } from './Token.js'

export class Lexer {
    tokenize(input: Readonly<string>): Array<Token> {
        const tokens = new Array<Token>()

        const re = /\n|\[\/|\[(\w+|\*)|\]|=|&|<|>|'|"/g
        let offset = 0

        while (true) {
            // Match until next symbol
            const match = re.exec(input)
            if (!match) {
                break
            }

            // Everything between previous symbol and current symbol is treated as plaintext
            //
            //  [...]plaintext[/...]
            //      |         |
            //      offset    match.index
            //                (new) offset
            //
            const length = match.index - offset
            if (length > 0) {
                tokens.push({
                    type: 'STR',
                    offset,
                    length,
                })
            }

            offset = match.index

            // Only add BACKSLASH token if it's preceded by L_BRACKET
            // In the regex '[/' takes precedence over '['
            if (match[0] === '[/') {
                tokens.push({
                    type: 'L_BRACKET',
                    offset,
                    length: 1,
                })
                offset += 1

                tokens.push({
                    type: 'BACKSLASH',
                    offset,
                    length: 1,
                })
                offset += 1
            } else if (match[0].startsWith('[')) {
                tokens.push({
                    type: 'L_BRACKET',
                    offset,
                    length: 1,
                })
                offset += 1

                const length = match[0].length - 1
                tokens.push({
                    type: 'STR',
                    offset,
                    length,
                })
                offset += length
            } else {
                tokens.push({
                    type: symbolTable[match[0]] ?? 'STR',
                    offset,
                    length: 1,
                })
                offset += 1
            }
        }

        // Add any leftover non-symbol text
        const length = input.length - offset
        if (length > 0) {
            tokens.push({
                type: 'STR',
                offset,
                length,
            })
        }

        return tokens
    }
}
