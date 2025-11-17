export const getRegionList = async (countryCode: string) => {
  const response = await fetch(
    `https://app.anti-corruption.org/api/Countries/${countryCode}/regions`,
  );
  return response.json();
};
