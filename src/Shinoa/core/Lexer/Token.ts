export const enum TokenType {
    LINEBREAK,
    STR,

    // XSS symbols
    XSS_AMP,
    XSS_LT,
    XSS_GT,
    XSS_D_QUOTE,
    XSS_S_QUOTE,

    // BBCode symbols
    L_BRACKET,
    R_BRACKET,
    BACKSLASH,
    EQUALS,
}

export function tokenTypeToString(tokenType: TokenType): string {
    switch (tokenType) {
        case TokenType.LINEBREAK: return 'LINEBREAK'
        case TokenType.STR: return 'STR'

        case TokenType.XSS_AMP: return 'XSS_AMP'
        case TokenType.XSS_LT: return 'XSS_LT'
        case TokenType.XSS_GT: return 'XSS_GT'
        case TokenType.XSS_D_QUOTE: return 'XSS_D_QUOTE'
        case TokenType.XSS_S_QUOTE: return 'XSS_S_QUOTE'

        case TokenType.L_BRACKET: return 'L_BRACKET'
        case TokenType.R_BRACKET: return 'R_BRACKET'
        case TokenType.BACKSLASH: return 'BACKSLASH'
        case TokenType.EQUALS: return 'EQUALS'
    }
}

export const symbolTable: Record<string, TokenType | undefined> = {
    '\n': TokenType.LINEBREAK,

    '[': TokenType.L_BRACKET,
    ']': TokenType.R_BRACKET,
    '/': TokenType.BACKSLASH,
    '=': TokenType.EQUALS,

    '&': TokenType.XSS_AMP,
    '<': TokenType.XSS_LT,
    '>': TokenType.XSS_GT,
    '"': TokenType.XSS_D_QUOTE,
    "'": TokenType.XSS_S_QUOTE,
}

export interface Token {
    type: TokenType
    str: string
    lineNum: number
    linePos: number
}

export function isStringToken(tokenType: TokenType): boolean {
    switch (tokenType) {
        case TokenType.STR:
        case TokenType.XSS_AMP:
        case TokenType.XSS_LT:
        case TokenType.XSS_GT:
        case TokenType.XSS_D_QUOTE:
        case TokenType.XSS_S_QUOTE: {
            return true
        }
    }

    return false
}
