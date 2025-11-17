export const getIndicatorData = async (mainIndicatorId: number) => {
  const response = await fetch(
    `https://app.anti-corruption.org/api/Facts?mainIndicatorId=${mainIndicatorId}&regionId=null&&productMarketId=null&pageSize=10000`,
  );
  return response.json();
};
