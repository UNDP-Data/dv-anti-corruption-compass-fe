import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getAntiCorruptionLaws = async () => {
  const response = await fetchAndParseCSV('/data/antiCorruptionLaws.csv');
  return response;
};
