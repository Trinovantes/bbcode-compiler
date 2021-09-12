import { Token, TokenType } from '../core/Lexer/Token'

export function tokensToString(tokens: ReadonlyArray<Token>): string {
    let s = ''

    for (const token of tokens) {
        switch (token.type) {
            case TokenType.XSS_AMP: {
                s += '&amp;'
                break
            }
            case TokenType.XSS_LT: {
                s += '&lt;'
                break
            }
            case TokenType.XSS_GT: {
                s += '&gt;'
                break
            }
            case TokenType.XSS_D_QUOTE: {
                s += '&quot;'
                break
            }
            case TokenType.XSS_S_QUOTE: {
                s += '&#x27;'
                break
            }
            case TokenType.STR: {
                s += token.str
                break
            }
            case TokenType.L_BRACKET: {
                s += '['
                break
            }
            case TokenType.R_BRACKET: {
                s += ']'
                break
            }
            case TokenType.BACKSLASH: {
                s += '/'
                break
            }
            case TokenType.EQUALS: {
                s += '='
                break
            }
        }
    }

    return s
}
