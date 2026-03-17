<template>
  <div class="sound-volume">
    <p class="label">音量:</p>
    <input
      type="range"
      min="0"
      max="100"
      :value="volume"
      @input="emit('update:volume', parseInt(($event.target as HTMLInputElement).value))"
      :disabled="disabled"
    >
  </div>
</template>

<style scoped>
.sound-volume {
  display: flex;
  align-items: center;
  gap: 4px;
  .label {
    width: 80px;
  }
}
</style>

<script setup lang="ts">
defineProps<{
  volume: number;
  disabled: boolean;
}>();

const emit = defineEmits<{
  'update:volume': [value: number];
}>();
</script>
