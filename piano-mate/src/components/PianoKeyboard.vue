<script setup>
import { computed } from 'vue'

const props = defineProps({
  scalePitchClasses: { type: Object, required: true }, // Set<number>
  chordPitchClasses: { type: Object, required: false, default: null }, // Set<number> | null
})

// Visual constants
const WHITE_WIDTH = 44
const WHITE_HEIGHT = 170
const BLACK_WIDTH = 28
const BLACK_HEIGHT = 110

// Build two octaves starting at C
const whiteOrder = ['C','D','E','F','G','A','B']
const blackAfterWhite = {
  C: { name: 'C#' },
  D: { name: 'D#' },
  E: null,
  F: { name: 'F#' },
  G: { name: 'G#' },
  A: { name: 'A#' },
  B: null,
}

const pitchClassIndex = name => ({
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
}[name])

function buildKeys() {
  const whites = []
  const blacks = []
  let whiteCount = 0
  const octaves = 2
  for (let octave = 0; octave < octaves; octave++) {
    for (const w of whiteOrder) {
      const name = w
      const x = whiteCount * WHITE_WIDTH
      const pc = pitchClassIndex(name)
      whites.push({ id: `w-${octave}-${name}-${whiteCount}` , name, isBlack: false, pc, x })
      const blackInfo = blackAfterWhite[w]
      if (blackInfo) {
        const bName = blackInfo.name
        const bPc = pitchClassIndex(bName)
        // place black between this white and next white
        const bx = x + WHITE_WIDTH - BLACK_WIDTH / 2
        blacks.push({ id: `b-${octave}-${bName}-${whiteCount}`, name: bName, isBlack: true, pc: bPc, x: bx })
      }
      whiteCount++
    }
  }
  return { whites, blacks, totalWidth: whiteCount * WHITE_WIDTH }
}

const keysData = buildKeys()

const keyClass = (key) => {
  const inScale = props.scalePitchClasses.has(key.pc)
  const inChord = props.chordPitchClasses ? props.chordPitchClasses.has(key.pc) : false
  return {
    'key': true,
    'white': !key.isBlack,
    'black': key.isBlack,
    'in-scale': inScale,
    'in-chord': inChord,
  }
}
</script>

<template>
  <div class="keyboard" :style="{ width: keysData.totalWidth + 'px', height: WHITE_HEIGHT + 'px' }">
    <div class="whites">
      <div v-for="k in keysData.whites" :key="k.id" :class="keyClass(k)" :style="{ left: k.x + 'px', width: WHITE_WIDTH + 'px', height: WHITE_HEIGHT + 'px' }">
        <span class="label">{{ k.name }}</span>
      </div>
    </div>
    <div class="blacks">
      <div v-for="k in keysData.blacks" :key="k.id" :class="keyClass(k)" :style="{ left: k.x + 'px', width: BLACK_WIDTH + 'px', height: BLACK_HEIGHT + 'px' }">
        <span class="label label-black">{{ k.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  position: relative;
  user-select: none;
}
.whites, .blacks {
  position: absolute;
  top: 0;
  left: 0;
}
.whites {
  z-index: 1;
}
.blacks {
  z-index: 2;
}
.key.white {
  position: absolute;
  background: linear-gradient(#fff, #eee);
  border: 1px solid #bbb;
  box-sizing: border-box;
}
.key.black {
  position: absolute;
  background: #111;
  border: 1px solid #000;
  border-bottom: 4px solid #333;
  box-sizing: border-box;
}
.label {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #333;
}
.label-black {
  color: #eee;
}

/* Highlights */
.key.in-scale.white {
  background: linear-gradient(#e6f4ff, #d6ecff);
}
.key.in-scale.black {
  background: #0b3a66;
  border-color: #06223a;
}

.key.in-chord.white {
  background: linear-gradient(#ffe9e6, #ffd9d6);
  box-shadow: inset 0 0 0 2px #ff6b5e;
}
.key.in-chord.black {
  background: #66220b;
  border-color: #3a1206;
  box-shadow: inset 0 0 0 2px #ff6b5e;
}
</style>