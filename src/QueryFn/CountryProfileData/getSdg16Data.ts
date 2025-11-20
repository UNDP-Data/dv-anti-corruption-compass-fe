import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getSdg16Data = async () => {
  const response = await fetchAndParseCSV('/data/sdg16.csv');
  return response;
};
