<template>
  <div class="input-player-name">
    <input
      v-model="playerName"
      placeholder="プレイヤー名を入力"
      :disabled="selected"
    />

    <template v-if="hasHistory && playerCandidates.length <= 0 && !selected && !isLoading">
      <p>直近の使用</p>
      <div class="players-list">
        <button @click="selectPlayer({id: storageService.latestPlayerId, name: storageService.latestPlayerName})">
          {{storageService.latestPlayerName}}
        </button>
      </div>
    </template>

    <template v-if="(playerCandidates.length > 0 && !selected) || isLoading">
      <p>検索結果</p>
      <LoadingSpinner v-show="isLoading" />
      <div class="players-list" v-show="!isLoading">
        <template v-for="player in playerCandidates" :key="player.id">
          <button
              class="item"
              @click="selectPlayer(player)"
          >{{player.name}}</button>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
input {
  font-size: 16px;
  padding: 8px 6px;
  letter-spacing: 0.02em;
  width: 250px;
}

.input-player-name {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.players-list {
  position: relative;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  > .item {
    background: var(--light-bg-color);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid var(--button-border-color);
  }
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { bffClient } from '../client/bffClient.ts'
import { StorageService } from '../service/StorageService.ts'
import LoadingSpinner from './LoadingSpinner.vue'

const emit = defineEmits<{
  'update:playerId': [value: string];
}>();

const playerName = ref<string>('');
const selected = ref<boolean>(false);
const cancelTimer = ref<number|null>(null);
const playerCandidates = ref<{ id: string, name: string }[]>([]);
const storageService = new StorageService();
const hasHistory = ref<boolean>(storageService.latestPlayerName !== '' && storageService.latestPlayerId !== '');
const isLoading = ref<boolean>(false);

const selectPlayer = (player: { id: string, name: string }) => {
  selected.value = true;
  playerName.value = player.name;
  storageService.latestPlayerId = player.id;
  storageService.latestPlayerName = player.name;
  emit('update:playerId', player.id);
};

watch(playerName, (value) => {
  if (selected.value || value.length < 2) {
    return;
  }
  clearTimeout(cancelTimer.value!);
  cancelTimer.value = setTimeout(async () => {
    isLoading.value = true;
    playerCandidates.value = await bffClient.fetchPlayers(value);
    isLoading.value = false;
  }, 500);
});
</script>
