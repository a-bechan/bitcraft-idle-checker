<template>
  <div class="sound-test">
    <p class="label">テスト: </p>
    <button @click="$emit('soundTest')">Play</button>
  </div>
</template>

<style scoped>
.sound-test {
  display: flex;
  align-items: center;
  gap: 4px;
  .label {
    width: 80px;
  }
}
</style>

<script setup lang="ts">
defineEmits<{
  soundTest: [];
}>();
</script>
