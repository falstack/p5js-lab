<script setup lang="ts">
import { onMounted } from 'vue'
import editor from './components/editor.vue'
const code = `let x = 100; 
let y = 100;

this.setup = function() {
  this.createCanvas(700, 410);
};

this.draw = function() {
  this.background(0);
  this.fill(255);
  this.rect(x,y,50,50);
};
`

const handleInput = (value: string) => {
  const values = `new p5((sketch) => {
  const render = function() {
${value}
  }
  render.bind(sketch)()
}, 'main');`


const before = document.getElementById('inject-p5-js')
if (before) {
  before.parentNode?.removeChild(before)
}

(document.getElementById('main') as HTMLElement).innerHTML = ''

const script = document.createElement('script')
script.id = 'inject-p5-js'
script.textContent = values
document.body.appendChild(script)
}

onMounted(() => {
  handleInput(code)
})
</script>

<template>
  <main id="main"></main>
  <aside id="aside">
    <editor
      ref="editor"
      :code="code"
      @change="handleInput"
    />
  </aside>
</template>

<style>
body {
  margin: 0;
}

#app {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#main,
#aside {
  flex: 1;
}

.editor {
  width: 100%;
  height: 100%;
}
</style>
