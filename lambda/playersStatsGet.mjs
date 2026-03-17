async function run(playerId) {
  const url = `https://bitjita.com/api/players/${playerId}/stats`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error();
      error.status = response.status;
      error.body = await response.json();
      throw error;
    }

    const data = await response.json();
    return {
      stamina: data.stats.values[1],
    }
  } catch (error) {
    return {
      status: error.status,
      message: error.body.error,
    };
  }
}

export const handler = async (event) => {
  const resBody = await run(event.pathParameters.id);
  return {
    statusCode: 200,
    body: JSON.stringify(resBody),
  };
};
