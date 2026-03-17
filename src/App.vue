<template>
  <div class="app">
    <h1>Bitcraft アイドルチェッカー</h1>
    <InputPlayerName @update:player-id="main" />
    <LoadingSpinner v-show="isLoading" />
    <template v-if="initialized">
      <SoundMute v-model:is-mute="isMute" />
      <SoundVolume v-model:volume="volume" :disabled="isMute" @change="setSoundVolume(volume)" />
      <SoundTest @sound-test="notify.play()" />

      <IdleTimerBar
          :idle-threshold="idleThreshold"
          :is-in-timer-animation="isInTimerAnimation"
      ></IdleTimerBar>
    </template>
  </div>
</template>

<style scoped>
.app {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import * as bitjitaLiveApiService from './service/bitjitaLiveApiService.ts';
import IdleTimerBar from './components/IdleTimerBar.vue';
import TimerWorker from './workers/timer.worker.ts?worker';
import SoundMute from './components/SoundMute.vue'
import InputPlayerName from './components/InputPlayerName.vue'
import SoundVolume from './components/SoundVolume.vue';
import SoundTest from './components/SoundTest.vue'
import { StorageService } from './service/StorageService.ts'
import LoadingSpinner from './components/LoadingSpinner.vue'

const storageService = new StorageService();
const timerWorker = new TimerWorker();
const idleThreshold = 1000 * 8;
const notifyInterval = 1000 * 5;

const notify = ref<HTMLAudioElement>(new Audio('notify.mp3'));
const initialized = ref(false);
const isLoading = ref(false);
const isInIdle = ref(false);
const waitingForStaminaRecovered = ref<boolean>(false);
const isInTimerAnimation = ref<boolean>(false);
const isMute = ref<boolean>(false);
const volume = ref<number>(storageService.soundVolume);

timerWorker.onmessage = (e: MessageEvent) => {
  const { type } = e.data;

  switch (type) {
    case 'idleTimeout':
      isInIdle.value = true;
      break;

    case 'notifyTick':
      if (isMute.value) return;
      if (!isInIdle.value) return;
      if (waitingForStaminaRecovered.value) return;
      notify.value.play();
      break;

    case 'staminaChangedTimeout':
      waitingForStaminaRecovered.value = false;
      break;
  }
};

const resetIdleTimerAnimation = () => {
  isInTimerAnimation.value = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isInTimerAnimation.value = true;
    });
  });
};

const resetIdleTimer = () => {
  timerWorker.postMessage({ type: 'stopIdleTimer' });
  startIdleTimer();
  isInIdle.value = false;
  resetIdleTimerAnimation();
};

const startIdleTimer = () => {
  timerWorker.postMessage({
    type: 'startIdleTimer',
    payload: { idleThreshold }
  });
};

const startNotifyTimer = () => {
  timerWorker.postMessage({
    type: 'startNotifyTimer',
    payload: { notifyInterval }
  });
};

const setSoundVolume = (volume: number) => {
  notify.value.volume = volume / 100;
  storageService.soundVolume = volume;
}

const main = (playerId: string) => {
  const isStaminaChanged = ref<boolean>(false);
  isLoading.value = true;
  setSoundVolume(volume.value);

  bitjitaLiveApiService.start({
    playerId: playerId,
    subscribedCallback: () => {
      initialized.value = true;
      isLoading.value = false;
      startIdleTimer();
      startNotifyTimer();
      isInTimerAnimation.value = true;
    },
    // 移動時
    mobileEntityCallback: () => {
      resetIdleTimer();
    },
    // 経験値獲得時
    experienceCallback: () => {
      resetIdleTimer();
    },
    // スタミナ減少時
    staminaDecreasedCallback: () => {
      resetIdleTimer();
      staminaChanged();
      waitingForStaminaRecovered.value = false;
    },
    // スタミナ回復時
    staminaRecoveringCallback: () => {
      staminaChanged();
      waitingForStaminaRecovered.value = true;
    },
  });

  const staminaChanged = () => {
    isStaminaChanged.value = true;
    timerWorker.postMessage({ type: 'stopStaminaChangedTimer' });
    // 3秒間スタミナの回復と減少が無い場合はスタミナ変動無しとして扱う
    timerWorker.postMessage({
      type: 'startStaminaChangedTimer',
      payload: { staminaChangedDelay: 3000 }
    });
  }
}

onUnmounted(() => {
  timerWorker.terminate();
});
</script>
