import type { ValidationTestCase } from './TestCase'

export const validationTests: Array<ValidationTestCase> = [
    {
        name: 'Bold',
        input: '[b]bolded text[/b]',
        expectedOutputs: [
            '<b>bolded text</b>',
            '<strong>bolded text</strong>',
            '<span style="font-weight:bold;">bolded text</span>',
        ],
    },
    {
        name: 'Italic',
        input: '[i]italicized text[/i]',
        expectedOutputs: [
            '<i>italicized text</i>',
            '<em>italicized text</em>',
            '<span style="font-style:italic;">italicized text</span>',
        ],
    },
    {
        name: 'Underline',
        input: '[u]underlined text[/u]',
        expectedOutputs: [
            '<ins>underlined text</ins>',
            '<span style="text-decoration:underline;">underlined text</span>',
        ],
    },
    {
        name: 'Strikethrough',
        input: '[s]strikethrough text[/s]',
        expectedOutputs: [
            '<del>strikethrough text</del>',
            '<span style="text-decoration:line-through;">strikethrough text</span>',
        ],
    },
    {
        name: 'Url',
        input: '[url]https://en.wikipedia.org[/url]',
        expectedOutputs: [
            '<a href="https://en.wikipedia.org">https://en.wikipedia.org</a>',
        ],
    },
    {
        name: 'Url (looks like XSS)',
        input: '[url]/javascript:link[/url]',
        expectedOutputs: [
            '<a href="/javascript:link">/javascript:link</a>',
        ],
    },
    {
        name: 'Url Text (no quotes)',
        input: '[url=https://en.wikipedia.org]English Wikipedia[/url]',
        expectedOutputs: [
            '<a href="https://en.wikipedia.org">English Wikipedia</a>',
        ],
    },
    {
        name: 'Url Text (quotes)',
        input: '[url="https://en.wikipedia.org"]English Wikipedia[/url]',
        expectedOutputs: [
            '<a href="https://en.wikipedia.org">English Wikipedia</a>',
        ],
    },
    {
        name: 'Image',
        input: '[img]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]',
        expectedOutputs: [
            '<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png">',
        ],
    },
    {
        name: 'Image (base64)',
        input: '[img]data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7[/img]',
        expectedOutputs: [
            '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">',
        ],
    },
    {
        name: 'Image (width=)',
        input: '[img width=200]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]',
        expectedOutputs: [
            '<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png" width="200">',
        ],
    },
    {
        name: 'Image (width= height=)',
        input: '[img width=200 height=100]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]',
        expectedOutputs: [
            '<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png" width="200" height="100">',
        ],
    },
    {
        name: 'Image (width x height)',
        input: '[img 200x100]https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png[/img]',
        expectedOutputs: [
            '<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png" width="200" height="100">',
        ],
    },
    {
        name: 'Quote',
        input: '[quote]quoted text[/quote]',
        expectedOutputs: [
            '<blockquote>quoted text</blockquote>',
            '<blockquote><p>quoted text</p></blockquote>',
        ],
    },
    {
        name: 'Color (hex)',
        input: '[color=#FF00FF]Text in fuchsia[/color]',
        expectedOutputs: [
            '<span style="color:#FF00FF;">Text in fuchsia</span>',
        ],
    },
    {
        name: 'Color (name)',
        input: '[style color="fuchsia"]Text in fuchsia[/style]',
        expectedOutputs: [
            '<span style="color:fuchsia;">Text in fuchsia</span>',
        ],
    },
    {
        name: 'Font Size (percent)',
        input: '[style size="85"]Smaller Text[/style]',
        expectedOutputs: [
            '<span style="font-size:85%;">Smaller Text</span>',
        ],
    },
    {
        name: 'Font Size (px)',
        input: '[style size="30px"]Large Text[/style]',
        expectedOutputs: [
            '<span style="font-size:30px;">Large Text</span>',
        ],
    },
    {
        name: 'List (unordered)',
        input: '[list][*]Entry A\n[*]Entry B\n[/list]',
        expectedOutputs: [
            '<ul><li>Entry A</li><li>Entry B</li></ul>',
        ],
    },
    {
        name: 'List (ordered)',
        input: '[list=1][*]Entry A\n[*]Entry B\n[/list]',
        expectedOutputs: [
            '<ol><li>Entry A</li><li>Entry B</li></ol>',
        ],
    },
    {
        name: 'Table',
        input: '[table][tr][td]table cell 1[/td][td]table cell 2[/td][/tr][tr][td]table cell 3[/td][td]table cell 4[/td][/tr][/table]',
        expectedOutputs: [
            '<table><tr><td>table cell 1</td><td>table cell 2</td></tr><tr><td>table cell 3</td><td>table cell 4</td></tr></table>',
        ],
    },
    {
        name: 'Single L_BRACKET',
        input: 'hello [ world',
        expectedOutputs: [
            'hello [ world',
        ],
    },
    {
        name: 'Single R_BRACKET',
        input: 'hello ] world',
        expectedOutputs: [
            'hello ] world',
        ],
    },
    {
        name: 'No Closing Tag',
        input: 'hello [b] world',
        expectedOutputs: [
            'hello [b] world',
        ],
    },
    {
        name: 'No Open Tag',
        input: 'hello [/b] world',
        expectedOutputs: [
            'hello [/b] world',
        ],
    },
]
