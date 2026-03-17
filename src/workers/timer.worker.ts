interface TimerMessage {
  type: 'startIdleTimer' | 'stopIdleTimer' | 'startNotifyTimer' | 'startStaminaChangedTimer' | 'stopStaminaChangedTimer';
  payload?: {
    idleThreshold?: number;
    notifyInterval?: number;
    staminaChangedDelay?: number;
  };
}

let idleTimerId: number | null = null;
let notifyTimerId: number | null = null;
let staminaChangedTimerId: number | null = null;

self.onmessage = (e: MessageEvent<TimerMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'startIdleTimer':
      if (idleTimerId !== null) {
        clearInterval(idleTimerId);
      }
      idleTimerId = setInterval(() => {
        self.postMessage({ type: 'idleTimeout' });
      }, payload?.idleThreshold || 8000);
      break;

    case 'stopIdleTimer':
      if (idleTimerId !== null) {
        clearInterval(idleTimerId);
        idleTimerId = null;
      }
      break;

    case 'startNotifyTimer':
      if (notifyTimerId === null) {
        notifyTimerId = setInterval(() => {
          self.postMessage({ type: 'notifyTick' });
        }, payload?.notifyInterval || 5000);
      }
      break;

    case 'startStaminaChangedTimer':
      if (staminaChangedTimerId !== null) {
        clearTimeout(staminaChangedTimerId);
      }
      staminaChangedTimerId = setTimeout(() => {
        self.postMessage({ type: 'staminaChangedTimeout' });
      }, payload?.staminaChangedDelay || 3000);
      break;

    case 'stopStaminaChangedTimer':
      if (staminaChangedTimerId !== null) {
        clearTimeout(staminaChangedTimerId);
        staminaChangedTimerId = null;
      }
      break;
  }
};
