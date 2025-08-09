<script setup>
import { ref, computed } from 'vue'
import ScaleSelector from './components/ScaleSelector.vue'
import PianoKeyboard from './components/PianoKeyboard.vue'
import ChordButtons from './components/ChordButtons.vue'
import { nameToPitchClass, getScalePitchClasses, getDiatonicChords } from './music'

const tonic = ref('C')
const mode = ref('major') // 'major' or 'minor'
const activeChordIndex = ref(-1)

const scalePitchClasses = computed(() => {
  return getScalePitchClasses(nameToPitchClass(tonic.value), mode.value)
})

const chordPitchClasses = computed(() => {
  if (activeChordIndex.value < 0) return null
  const tonicPc = nameToPitchClass(tonic.value)
  const chords = getDiatonicChords(tonicPc, mode.value)
  return chords[activeChordIndex.value]?.pitchClasses ?? null
})
</script>

<template>
  <main class="container">
    <h1>Piano Mate</h1>
    <p class="subtitle">Visualisez les gammes et accords sur 2 octaves</p>

    <section class="controls">
      <ScaleSelector v-model:tonic="tonic" v-model:mode="mode" />
    </section>

    <section class="keyboard-wrap">
      <PianoKeyboard :scalePitchClasses="scalePitchClasses" :chordPitchClasses="chordPitchClasses" />
    </section>

    <section class="chords-wrap">
      <h2>Accords diatoniques</h2>
      <ChordButtons :tonic="tonic" :mode="mode" v-model:activeIndex="activeChordIndex" />
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
}
.subtitle {
  margin-top: -8px;
  color: #546e7a;
}
.controls {
  margin: 16px 0 20px;
}
.keyboard-wrap {
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 16px;
}
.chords-wrap h2 {
  font-size: 16px;
  margin: 6px 0 10px 0;
}
</style>
