import type { TagNode } from '../../parser/AstNode.js'

export interface Transform {
    name: string

    skipChildren?: boolean // Do not recursively render children nodes (e.g. [img]url[/url] should not render url)
    isStandalone?: boolean // Only has StartTag e.g. "[hr]"
    isLinebreakTerminated?: boolean // Ends by linebreak e.g. "[*] list entry\n"

    // Returns false when the StartTag failed validation and original bbcode will be displayed as plaintext
    start: (tagNode: TagNode) => string | false

    // Some tags do not need closing tag e.g. standalones like [hr] or wrappers like [img]
    end?: (tagNode: TagNode) => string
}
