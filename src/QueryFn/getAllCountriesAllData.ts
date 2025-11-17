export const getAllCountriesAllData = async () => {
  const response = await fetch(
    'https://app.anti-corruption.org/api/Facts?regionId=null&&productMarketId=null&pageSize=10000',
  );
  return response.json();
};
