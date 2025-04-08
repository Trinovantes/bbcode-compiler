export type TokenType =
    | 'STR'
    | 'LINEBREAK'

    // BBCode symbols
    | 'L_BRACKET'
    | 'R_BRACKET'
    | 'BACKSLASH'
    | 'EQUALS'

    // XSS symbols
    | 'XSS_AMP'
    | 'XSS_LT'
    | 'XSS_GT'
    | 'XSS_D_QUOTE'
    | 'XSS_S_QUOTE'

export function tokenTypeToString(tokenType: TokenType): string {
    switch (tokenType) {
        case 'STR': return 'STR'
        case 'LINEBREAK': return 'LINEBREAK'

        case 'L_BRACKET': return 'L_BRACKET'
        case 'R_BRACKET': return 'R_BRACKET'
        case 'BACKSLASH': return 'BACKSLASH'
        case 'EQUALS': return 'EQUALS'

        case 'XSS_AMP': return 'XSS_AMP'
        case 'XSS_LT': return 'XSS_LT'
        case 'XSS_GT': return 'XSS_GT'
        case 'XSS_D_QUOTE': return 'XSS_D_QUOTE'
        case 'XSS_S_QUOTE': return 'XSS_S_QUOTE'
    }
}

export function isStringToken(tokenType: TokenType): boolean {
    switch (tokenType) {
        case 'XSS_AMP':
        case 'XSS_LT':
        case 'XSS_GT':
        case 'XSS_D_QUOTE':
        case 'XSS_S_QUOTE':
        case 'STR': {
            return true
        }
    }

    return false
}

export const symbolTable: Record<string, TokenType | undefined> = {
    '\n': 'LINEBREAK',

    '[': 'L_BRACKET',
    ']': 'R_BRACKET',
    '/': 'BACKSLASH',
    '=': 'EQUALS',

    '&': 'XSS_AMP',
    '<': 'XSS_LT',
    '>': 'XSS_GT',
    '"': 'XSS_D_QUOTE',
    "'": 'XSS_S_QUOTE',
}
