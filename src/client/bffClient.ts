const baseUrl = 'https://srbd7c60pb.execute-api.ap-northeast-1.amazonaws.com';

export const bffClient = {
  fetchPlayers: async (name: string) => {
    const res = await fetch(`${baseUrl}/players?name=${name}`)
    return await res.json();
  },
};
