async function run(playerName) {
  const url = `https://bitjita.com/api/players?q=${playerName}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error();
      error.status = response.status;
      error.body = await response.json();
      throw error;
    }

    const players = [];
    (await response.json()).players.forEach(player => {
      players.push({
        id: player.entityId,
        name: player.username,
      })
    });
    return players;
  } catch (error) {
    console.error(error);
    return {
      status: error.status,
      message: error.body.error,
    };
  }
}

export const handler = async (event) => {
  console.log(event);
  const resBody = await run(event.queryStringParameters.name);
  return {
    statusCode: 200,
    body: JSON.stringify(resBody),
  };
};
