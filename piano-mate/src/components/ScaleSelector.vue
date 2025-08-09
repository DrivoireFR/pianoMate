<script setup>
const props = defineProps({
  tonic: { type: String, required: true },
  mode: { type: String, required: true },
})
const emit = defineEmits(['update:tonic','update:mode'])

const tonics = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const modes = [
  { value: 'major', label: 'Majeure' },
  { value: 'minor', label: 'Mineure' },
]
</script>

<template>
  <div class="selector">
    <label>
      Tonique
      <select :value="tonic" @change="e => emit('update:tonic', e.target.value)">
        <option v-for="t in tonics" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>
    <label>
      Mode
      <select :value="mode" @change="e => emit('update:mode', e.target.value)">
        <option v-for="m in modes" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.selector {
  display: flex;
  gap: 12px;
  align-items: center;
}
label {
  display: inline-flex;
  flex-direction: column;
  font-size: 14px;
  gap: 4px;
}
select {
  padding: 6px 8px;
}
</style>