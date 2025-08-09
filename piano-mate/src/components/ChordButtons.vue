<script setup>
import { computed } from 'vue'
import { getDiatonicChords, nameToPitchClass, formatChordName } from '../music'

const props = defineProps({
  tonic: { type: String, required: true },
  mode: { type: String, required: true },
  activeIndex: { type: Number, default: -1 },
})
const emit = defineEmits(['update:activeIndex'])

const chords = computed(() => {
  const tonicPc = nameToPitchClass(props.tonic)
  const list = getDiatonicChords(tonicPc, props.mode)
  return list.map((c, idx) => ({
    ...c,
    name: formatChordName(tonicPc, props.mode, idx),
  }))
})

function toggle(idx) {
  emit('update:activeIndex', props.activeIndex === idx ? -1 : idx)
}
</script>

<template>
  <div class="chords">
    <button v-for="(c, idx) in chords" :key="idx" :class="{ active: idx === activeIndex }" @click="toggle(idx)">
      <div class="roman">{{ c.roman }}</div>
      <div class="name">{{ c.name }}</div>
    </button>
  </div>
</template>

<style scoped>
.chords {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}
button {
  padding: 8px 10px;
  border: 1px solid #cfd8dc;
  background: #f7fafc;
  border-radius: 6px;
  cursor: pointer;
}
button.active {
  background: #ffe5e0;
  border-color: #ff6b5e;
}
.roman {
  font-weight: 700;
}
.name {
  font-size: 12px;
  color: #444;
}
</style>