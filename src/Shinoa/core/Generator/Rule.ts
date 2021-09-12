export interface Rule {
    name: string
    isStandalone?: boolean
    isLinebreakTerminated?: boolean
}

export const DEFAULT_RULES: ReadonlyArray<Rule> = [
    {
        name: '*',
        isLinebreakTerminated: true,
    },
    {
        name: 'hr',
        isStandalone: true,
    },
    {
        name: 'b',
    },
    {
        name: 'img',
    },
    {
        name: 'url',
    },
]
