export const getMarkets = async () => {
  const response = await fetch(
    'https://app.anti-corruption.org/api/ProductMarkets',
  );
  return response.json();
};
