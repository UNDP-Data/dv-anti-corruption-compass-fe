export const getIndicatorsMetaData = async () => {
  const response = await fetch(
    'https://app.anti-corruption.org/api/Indicators',
  );
  return response.json();
};
