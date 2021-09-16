<script setup lang="ts">
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import { ref, Ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
// @ts-ignore
window.MonacoEnvironment = {
  getWorker (_: string, label: string) {
    if (label === 'typescript' || label === 'javascript') return new TsWorker()
    if (label === 'json') return new JsonWorker()
    if (label === 'css') return new CssWorker()
    if (label === 'html') return new HtmlWorker()
    return new EditorWorker()
  }
}

const props = defineProps<{ code: string }>()

const emit = defineEmits(['change'])

const monacoWrapper: Ref<HTMLElement | undefined> = ref();

onMounted(() => {
    const editor = monaco.editor.create(monacoWrapper.value as HTMLElement, {
        value: props.code,
        theme: 'vs-dark',
        automaticLayout: true,
        language: "javascript",
        minimap: {
            enabled: false,
        },
    });

    editor.onDidChangeModelContent(event => {
        emit('change', editor.getValue(), event)
    })
});
</script>

<template>
    <div ref="monacoWrapper" class="editor"></div>
</template>
