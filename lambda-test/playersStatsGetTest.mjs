import { handler } from '../lambda/playersStatsGet.mjs'

const event = {
  pathParameters: {
    id: '648518346354609956'
  }
};

(async () => {
  console.log(await handler(event));
})();
