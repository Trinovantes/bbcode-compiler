import type { XssTestCase } from './TestCase'

const urlXssTests: Array<XssTestCase> = [
    {
        name: 'Url XSS (base64 <script>)',
        input: '[url=data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5jb29raWUpOzwvc2NyaXB0Pg==]link[/url]', // <script>alert(document.cookie);</script>
        unexpectedSubstrings: [
            'href="data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5jb29raWUpOzwvc2NyaXB0Pg=="',
        ],
    },
    {
        name: 'Url XSS (base64 href)',
        input: '[url=data:text/plain;base64,YWxlcnQoZG9jdW1lbnQuY29va2llKTs=]link[/url]', // alert(document.cookie);
        unexpectedSubstrings: [
            'href="data:text/html;base64,YWxlcnQoZG9jdW1lbnQuY29va2llKTs="',
        ],
    },
    {
        name: 'Url XSS (javascript:)',
        input: '[url]javascript:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="javascript:alert(document.cookie)"',
        ],
    },
    {
        name: 'Url XSS (JAVASCRIPT:)',
        input: '[url]JAVASCRIPT:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="JAVASCRIPT:alert(document.cookie)"',
        ],
    },
    {
        name: 'Url XSS (vbscript:)',
        input: '[url]vbscript:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="vbscript:alert(document.cookie)"',
        ],
    },
    {
        name: 'Url XSS (VBSCRIPT:)',
        input: '[url]VBSCRIPT:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="VBSCRIPT:alert(document.cookie)"',
        ],
    },
    {
        name: 'Url XSS (file:)',
        input: '[url]file:///C:/Users[/url]',
        unexpectedSubstrings: [
            'href="file:///C:/Users"',
        ],
    },
    {
        name: 'Url XSS (javascript encoded "J")',
        input: '[url]&#74avascript:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="javascript:alert(document.cookie)"',
            'href="&#74avascript:alert(document.cookie)"', // encoded 'J'
            'href="j&#65vascript:alert(document.cookie)"', // encoded 'A'
            'href="&#x26;#74;avascript:alert(document.cookie)"', // encoded & for encoded J
            'href="javascript&#x3A;alert(document.cookie)"', // encoded ':'
        ],
    },
    {
        name: 'Url XSS (javascript encoded "A")',
        input: '[url]j&#65vascript:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="javascript:alert(document.cookie)"',
            'href="&#74avascript:alert(document.cookie)"', // encoded 'J'
            'href="j&#65vascript:alert(document.cookie)"', // encoded 'A'
            'href="&#x26;#74;avascript:alert(document.cookie)"', // encoded & for encoded J
            'href="javascript&#x3A;alert(document.cookie)"', // encoded ':'
        ],
    },
    {
        name: 'Url XSS (javascript encoded "&" for encoded "j")',
        input: '[url]&#x26;#74;avascript:alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="javascript:alert(document.cookie)"',
            'href="&#74avascript:alert(document.cookie)"', // encoded 'J'
            'href="j&#65vascript:alert(document.cookie)"', // encoded 'A'
            'href="&#x26;#74;avascript:alert(document.cookie)"', // encoded & for encoded J
            'href="javascript&#x3A;alert(document.cookie)"', // encoded ':'
        ],
    },
    {
        name: 'Url XSS (javascript encoded colon)',
        input: '[url]javascript&#x3A;alert(document.cookie)[/url]',
        unexpectedSubstrings: [
            'href="javascript:alert(document.cookie)"',
            'href="&#74avascript:alert(document.cookie)"', // encoded 'J'
            'href="j&#65vascript:alert(document.cookie)"', // encoded 'A'
            'href="&#x26;#74;avascript:alert(document.cookie)"', // encoded & for encoded J
            'href="javascript&#x3A;alert(document.cookie)"', // encoded ':'
        ],
    },
]

const imgXssTests: Array<XssTestCase> = [
    {
        name: 'Image XSS (onError extension)',
        input: '[img]fake.jpg" onError="alert(document.cookie)[/img]',
        unexpectedSubstrings: [
            'onError="alert(document.cookie)"',
        ],
    },
]

export const xssTests: Array<XssTestCase> = [
    ...urlXssTests,
    ...imgXssTests,
]
