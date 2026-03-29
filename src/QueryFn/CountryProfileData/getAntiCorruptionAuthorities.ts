import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getAntiCorruptionAuthorities = async () => {
  const response = await fetchAndParseCSV(
    '/data/antiCorruptionAuthorities.csv',
  );
  return response;
};
