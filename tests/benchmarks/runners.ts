/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */

import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import bbcode from 'bbcode'
import BBCodeParser from 'bbcode-parser'
import bbcodejs from 'bbcodejs'
import MarkdownIt from 'markdown-it'
import TsBbcodeParser from 'ts-bbcode-parser'
import Yabbcode from 'ya-bbcode'
import { generateHtml } from '../../src/index.js'

export const runners: Record<string, (input: string) => string> = {
    'bbcode-compiler': (input) => {
        return generateHtml(input)
    },
    'markdown-it': (input) => {
        const md = new MarkdownIt()
        return md.render(input)
    },
    'bbcode': (input) => {
        return bbcode.parse(input)
    },
    'bbcodejs': (input) => {
        const parser = new bbcodejs.Parser()
        return parser.toHTML(input)
    },
    'bbcode-parser': (input) => {
        const parser = new BBCodeParser(BBCodeParser.defaultTags())
        return parser.parseString(input)
    },
    'ts-bbcode-parser': (input) => {
        const parser = new TsBbcodeParser()
        return parser.parse(input)
    },
    'bbob': (input) => {
        return bbobHTML.default(input, presetHTML5.default())
    },
    'yabbcode': (input) => {
        const parser = new Yabbcode()
        return parser.parse(input)
    },
}
