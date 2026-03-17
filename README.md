# Bitcraft Idle Checker
- A web application that notifies you with a sound when your Bitcraft character becomes idle.
- A character is considered **idle** when all of the following conditions are met:
  - The character is not moving.
  - The character is not gaining experience.
  - The character is not recovering stamina from food buffs.
  - The character is not performing any actions that consume stamina.

## External Connections
- This application uses Bitjita's API and WebSocket communication to access the character's state.
- To retrieve a player ID from a player name, the application communicates with the Bitjita API via AWS Lambda.

## Install Dependencies
```
npm install
```

## Run Development Server
```
npm run dev
```

## Build for Production
```
npm run build
```
