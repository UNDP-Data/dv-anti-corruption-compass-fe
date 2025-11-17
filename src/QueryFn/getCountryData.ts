export const getCountryData = async (
  countryCode: string,
  mainIndicatorId: number,
) => {
  const response = await fetch(
    `https://app.anti-corruption.org/api/Facts?countryCode=${countryCode}&regionId=null&mainIndicatorId=${mainIndicatorId}&pageSize=10000`,
  );
  return response.json();
};
