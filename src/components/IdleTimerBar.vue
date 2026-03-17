<template>
  <div class="idle-timer-bar">
    <div
        :style="{'animationDuration': `${props.idleThreshold / 1000}s`}"
        :class="{'animation': props.isInTimerAnimation}"
    ></div>
  </div>
</template>

<style scoped>
.idle-timer-bar {
  .animation {
    position: fixed;
    top: 0;
    height: 4px;
    background-color: #00b894;
    width: 0%;
    animation: timer linear forwards;
  }
}

@keyframes timer {
  from { width: 0%; }
  to { width: 100%; }
}
</style>

<script setup lang="ts">
export interface Props {
  idleThreshold: number
  isInTimerAnimation: boolean
}
const props = defineProps<Props>()
</script>
