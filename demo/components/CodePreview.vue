<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { codeToHtml } from 'shiki'
import { Generator, htmlTransforms, Lexer, Parser } from '@/index.js'

type Tab = 'HTML_RENDER' | 'RAW_HTML' | 'AST'
const currentTab = ref<Tab>('HTML_RENDER')
const tabsConfig: Array<{ name: Tab; label: string }> = [
    {
        name: 'HTML_RENDER',
        label: 'Rendered HTML',
    },
    {
        name: 'RAW_HTML',
        label: 'Raw HTML',
    },
    {
        name: 'AST',
        label: 'AST',
    },
]

const $q = useQuasar()
const dismissCallbacks = new Array<() => void>()
const notifyError = (msg: string) => {
    dismissCallbacks.push($q.notify({
        message: `<pre>${msg}</pre>`,
        type: 'negative',
        position: 'bottom',
        html: true,
        timeout: 0,
        actions: [
            {
                icon: 'close',
                color: 'white',
                round: true,
            },
        ],
    }))
}

const editorText = defineModel<string>({ required: true })
const renderedPreview = ref('')
const renderedHtmlPre = ref('')
const outputAst = ref('')

watch(editorText, async(editorText) => {
    renderedHtmlPre.value = ''
    renderedPreview.value = ''
    outputAst.value = ''

    dismissCallbacks.forEach((dismiss) => dismiss())
    dismissCallbacks.length = 0

    try {
        const lexer = new Lexer()
        const parser = new Parser(htmlTransforms)
        const generator = new Generator(htmlTransforms)

        const tokens = lexer.tokenize(editorText)
        const root = parser.parse(editorText, tokens)
        const outputHtml = generator.generate(root)

        outputAst.value = JSON.stringify(root, undefined, 4)

        renderedHtmlPre.value = await codeToHtml(outputHtml, {
            lang: 'html',
            theme: 'vitesse-light',
        })

        renderedPreview.value = `
            <html>
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"/>
                <style>
                *:last-child{
                    margin-bottom:0;
                }
                </style>
            </head>
            <body style="padding:20px;">
                <base target="_blank">
                ${outputHtml}
            </body>
            </html>
        `
    } catch (err) {
        console.warn(err)

        if (err instanceof Error) {
            notifyError(err.message)
        }
    }
}, {
    immediate: true,
})
</script>

<template>
    <div class="code-preview">
        <q-tabs
            v-model="currentTab"
            active-color="primary"
            indicator-color="primary"
            dense
            narrow-indicator
        >
            <q-tab
                v-for="{ name, label } in tabsConfig"
                :key="name"
                :name="name"
                :label="label"
                no-caps
            />
        </q-tabs>

        <q-tab-panels
            v-model="currentTab"
            animated
        >
            <q-tab-panel name="HTML_RENDER">
                <iframe
                    sandbox="allow-scripts allow-popups"
                    :srcdoc="renderedPreview"
                />
            </q-tab-panel>

            <q-tab-panel name="RAW_HTML">
                <div
                    v-html="renderedHtmlPre"
                />
            </q-tab-panel>

            <q-tab-panel name="AST">
                <pre>{{ outputAst }}</pre>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<style lang="scss" scoped>
.code-preview{
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100cqh;

    .q-tabs{
        border-bottom: 1px solid $border-color;
    }

    .q-tab-panels{
        .q-tab-panel{
            display: flex;
            padding: 0;

            :deep(pre){
                width: 100%;
                overflow-x: auto;
                padding: $padding;
            }

            iframe{
                flex: 1;
            }
        }
    }
}
</style>
