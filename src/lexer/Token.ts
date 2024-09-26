import type { TokenType } from './TokenType.js'

export type Token = {
    type: TokenType
    offset: number
    length: number
}

export function stringifyTokens(ogText: string, tokens: ReadonlyArray<Token>): string {
    let s = ''

    for (const token of tokens) {
        switch (token.type) {
            case 'STR': {
                s += ogText.substring(token.offset, token.offset + token.length)
                break
            }
            case 'LINEBREAK': {
                s += '\n'
                break
            }

            case 'L_BRACKET': {
                s += '['
                break
            }
            case 'R_BRACKET': {
                s += ']'
                break
            }
            case 'BACKSLASH': {
                s += '/'
                break
            }
            case 'EQUALS': {
                s += '='
                break
            }

            case 'XSS_AMP': {
                s += '&amp;'
                break
            }
            case 'XSS_LT': {
                s += '&lt;'
                break
            }
            case 'XSS_GT': {
                s += '&gt;'
                break
            }
            case 'XSS_D_QUOTE': {
                s += '&quot;'
                break
            }
            case 'XSS_S_QUOTE': {
                s += '&#x27;'
                break
            }
        }
    }

    return s
}
