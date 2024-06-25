import { getTagImmediateAttrVal } from '../utils/getTagImmediateAttrVal.js'
import { getTagImmediateText } from '../utils/getTagImmediateText.js'
import { getWidthHeightAttr } from '../utils/getWidthHeightAttr.js'
import { isDangerousUrl } from '../utils/isDangerousUrl.js'
import { isOrderedList } from '../utils/isOrderedList.js'
import type { Transform } from './Transform.js'

export const htmlTransforms: ReadonlyArray<Transform> = [
    {
        name: 'b',
        start: () => {
            return '<strong>'
        },
        end: () => {
            return '</strong>'
        },
    },
    {
        name: 'i',
        start: () => {
            return '<em>'
        },
        end: () => {
            return '</em>'
        },
    },
    {
        name: 'u',
        start: () => {
            return '<ins>'
        },
        end: () => {
            return '</ins>'
        },
    },
    {
        name: 's',
        start: () => {
            return '<del>'
        },
        end: () => {
            return '</del>'
        },
    },
    {
        name: 'style',
        start: (tagNode) => {
            let style = ''

            for (const child of tagNode.attributes) {
                switch (child.key) {
                    case 'color': {
                        style += `color:${child.val};`
                        continue
                    }
                    case 'size': {
                        if (/^\d+$/.test(child.val)) {
                            style += `font-size:${child.val}%;` // When no units provided (i.e. just a number), then assume %
                        } else {
                            style += `font-size:${child.val};`
                        }
                        continue
                    }
                }
            }

            return `<span style="${style}">`
        },
        end: () => {
            return '</span>'
        },
    },
    {
        name: 'color',
        start: (tagNode) => {
            const color = getTagImmediateAttrVal(tagNode)
            return `<span style="color:${color};">`
        },
        end: () => {
            return '</span>'
        },
    },
    {
        name: 'hr',
        isStandalone: true,
        start: () => {
            return '<hr />'
        },
    },
    {
        name: 'br',
        isStandalone: true,
        start: () => {
            return '<br />'
        },
    },
    {
        name: 'list',
        start: (tagNode) => {
            return isOrderedList(tagNode)
                ? '<ol>'
                : '<ul>'
        },
        end: (tagNode) => {
            return isOrderedList(tagNode)
                ? '</ol>'
                : '</ul>'
        },
    },
    {
        name: '*',
        isLinebreakTerminated: true,
        start: () => {
            return '<li>'
        },
        end: () => {
            return '</li>'
        },
    },
    {
        name: 'img',
        skipChildren: true,
        start: (tagNode) => {
            const src = getTagImmediateText(tagNode)
            if (!src) {
                return false
            }

            if (isDangerousUrl(src)) {
                return false
            }

            const { width, height } = getWidthHeightAttr(tagNode)

            let str = `<img src="${src}"`
            if (width) {
                str += ` width="${width}"`
            }
            if (height) {
                str += ` height="${height}"`
            }
            str += '>'
            return str
        },
    },
    {
        name: 'url',
        start: (tagNode) => {
            const href = getTagImmediateAttrVal(tagNode) ?? getTagImmediateText(tagNode)
            if (!href) {
                return false
            }

            if (isDangerousUrl(href)) {
                return false
            }

            return `<a href="${href}">`
        },
        end: () => {
            return '</a>'
        },
    },
    {
        name: 'quote',
        start: (tagNode) => {
            const author = getTagImmediateAttrVal(tagNode)
            return author
                ? `<blockquote><strong>${author}</strong>`
                : '<blockquote>'
        },
        end: () => {
            return '</blockquote>'
        },
    },
    {
        name: 'table',
        start: () => {
            return '<table>'
        },
        end: () => {
            return '</table>'
        },
    },
    {
        name: 'tr',
        start: () => {
            return '<tr>'
        },
        end: () => {
            return '</tr>'
        },
    },
    {
        name: 'td',
        start: () => {
            return '<td>'
        },
        end: () => {
            return '</td>'
        },
    },
    {
        name: 'code',
        start: () => {
            return '<code>'
        },
        end: () => {
            return '</code>'
        },
    },
]
