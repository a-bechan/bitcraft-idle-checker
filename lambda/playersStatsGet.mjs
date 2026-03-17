// 現在未使用
// bitcraft-idle-checker 本体の改修後にスタミナ最大値を取得する為に使用予定
async function run(playerId) {
  const url = `https://bitjita.com/api/players/${playerId}/stats`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-app-identifier': 'bitcraft-idle-checker',
      },
    });

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
