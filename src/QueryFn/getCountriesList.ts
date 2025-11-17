export const getCountriesList = async () => {
  const response = await fetch(
    'https://app.anti-corruption.org/api/Countries/',
  );
  return response.json();
};
