export const getRegionalDataForCountry = async (
  countryCode: string,
  mainIndicatorId: number,
  subIndicatorId: number,
  year: number,
  productMarketId: number | null,
) => {
  const response = await fetch(
    `https://app.anti-corruption.org/api/Facts?countryCode=${countryCode}&subIndicatorId=${subIndicatorId}&productMarketId=${productMarketId}&year=${year}&mainIndicatorId=${mainIndicatorId}&pageSize=10000`,
  );
  return response.json();
};
