import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getAntiCorruptionStrategies = async () => {
  const response = await fetchAndParseCSV('/data/antiCorruptionStrategies.csv');
  return response;
};
