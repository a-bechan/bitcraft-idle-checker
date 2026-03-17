export class StorageService {
  #soundVolume = 50;
  #latestPlayerId = '';
  #latestPlayerName = '';

  constructor() {
    const soundVolume = localStorage.getItem('soundVolume');
    if (soundVolume) {
      this.#soundVolume = parseInt(soundVolume);
    }

    const playerId = localStorage.getItem('playerId');
    if (playerId) {
      this.#latestPlayerId = playerId;
    }

    const playerName = localStorage.getItem('playerName');
    if (playerName) {
      this.#latestPlayerName = playerName;
    }
  }

  set soundVolume(value: number) {
    this.#soundVolume = value;
    localStorage.setItem('soundVolume', value.toString());
  }

  get soundVolume() {
    return this.#soundVolume;
  }

  set latestPlayerId(value: string) {
    this.#latestPlayerId = value;
    localStorage.setItem('playerId', value);
  }

  get latestPlayerId() {
    return this.#latestPlayerId;
  }

  set latestPlayerName(value: string) {
    this.#latestPlayerName = value;
    localStorage.setItem('playerName', value);
  }

  get latestPlayerName() {
    return this.#latestPlayerName;
  }
}
