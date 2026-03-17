const wssUrl = 'wss://live.bitjita.com/';
let initialized = false;
let lastStamina: null|number = null;

export const start = ({
  playerId,
  subscribedCallback,
  mobileEntityCallback,
  experienceCallback,
  staminaDecreasedCallback,
  staminaRecoveringCallback,
}: {
  playerId: string,
  subscribedCallback: () => void,
  mobileEntityCallback: () => void,
  experienceCallback: () => void,
  staminaDecreasedCallback: () => void,
  staminaRecoveringCallback: () => void,
}) => {
  if (initialized) return;
  initialized = true;
  const connection = new WebSocket(wssUrl);

  connection.onopen = () => {
    const message = {
      type: 'subscribe',
      channels: [
        `stamina_state:${playerId}`,
        `mobile_entity_state:${playerId}`,
        `experience_state:${playerId}`
      ]
    };
    connection.send(JSON.stringify(message));
  }

  connection.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.type === 'subscribed') {
      console.log('subscribed');
      subscribedCallback();
      return;
    }
    const channel = message.channel.split(':')[0]
    if (channel === 'mobile_entity_state') {
      mobileEntityCallback();
    }
    if (channel === 'experience_state') {
      experienceCallback();
    }
    if (channel === 'stamina_state') {
      const currentStamina = message.data.stamina;
      if (lastStamina === null) {
        lastStamina = currentStamina;
        return;
      }
      const isStaminaDecreased = lastStamina - currentStamina > 0;
      const isStaminaRecovering = lastStamina - currentStamina < -2;
      if (isStaminaDecreased) {
        staminaDecreasedCallback();
      } else if (isStaminaRecovering) {
        staminaRecoveringCallback();
      }
      lastStamina = currentStamina;
    }
  }
}
