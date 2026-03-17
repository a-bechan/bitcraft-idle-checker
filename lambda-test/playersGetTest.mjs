import { handler } from '../lambda/playersGet.mjs'

const event = {
  queryStringParameters: {
    name: 'abec'
  }
};

(async () => {
  console.log(await handler(event));
})();
