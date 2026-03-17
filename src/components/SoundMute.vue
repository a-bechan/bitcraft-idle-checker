<template>
  <div class="sound-mute">
    <p class="label">ミュート:</p>
    <button @click="unMute" :disabled="!isMute">
      <img src="../assets/sound-on.svg" alt="">
    </button>
    <button @click="mute" :disabled="isMute">
      <img src="../assets/sound-off.svg" alt="">
    </button>
  </div>
</template>

<style scoped>
.sound-mute {
  display: flex;
  align-items: center;
  gap: 4px;
  button {
    width: 60px;
  }
  .label {
    width: 80px;
  }
}
</style>

<script setup lang="ts">
defineProps<{
  isMute: boolean;
}>();

const emit = defineEmits<{
  'update:isMute': [value: boolean];
}>();

const mute = () => {
  emit('update:isMute', true);
};

const unMute = () => {
  emit('update:isMute', false);
};
</script>

