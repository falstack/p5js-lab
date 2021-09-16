<script setup lang="ts">
import { onMounted } from 'vue'
import editor from './components/editor.vue'
const code = `
let ball = {};
let soundFile;

this.preload = function() {
  this.soundFormats('mp3', 'ogg');
  soundFile = this.loadSound('CDN_PREFIX/beatbox.ogg');
}

this.setup = function() {
  this.createCanvas('SKETCH_WIDTH', 100);
}

this.draw = function() {
  this.background(0);
  ball.x = this.constrain(this.mouseX, 0, this.width);
  this.ellipse(ball.x, this.height / 2, 100, 100);
}

this.mousePressed = function() {
  let panning = this.map(ball.x, 0, this.width, -1.0, 1.0);
  soundFile.pan(panning);
  soundFile.play();
}
`
const convertMagicConst = (code: string) => {
  const parent = document.getElementById('sketch')
  if (!parent) {
    return code.trim()
  }

  const { clientWidth, clientHeight } = parent as HTMLElement

  return code
    .replace(/SKETCH_WIDTH/g, clientWidth)
    .replace(/SKETCH_HEIGHT/g, clientHeight)
    .replace(/CDN_PREFIX/g, 'https://activity.hdslb.com/blackboard/static/30d74f09baa91cb7f2ffeaa05399d344')
    .trim()
}

const handleInput = (value: string) => {
  const values = `window._p5_instance_ = new p5((sketch) => {
  const render = function() {
${convertMagicConst(value)}
  }
  render.bind(sketch)()
}, 'sketch');
`

const before = document.getElementById('inject-p5-js')
if (before) {
  before.parentNode?.removeChild(before)
  ;(window as any)._p5_instance_.remove()
}

(document.getElementById('sketch') as HTMLElement).innerHTML = ''

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
  <main id="main">
    <div id="sketch"></div>
  </main>
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

#main {
  /* padding: 20px; */
}

#sketch,
.editor {
  width: 100%;
  height: 100%;
}
</style>
