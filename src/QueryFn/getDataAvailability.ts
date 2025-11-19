import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getDataAvailability = async () => {
  const response = await fetchAndParseCSV('/data/dataAvailability.csv');
  return response;
};
