import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getFATF = async () => {
  const response = await fetchAndParseCSV('/data/fatf.csv');
  return response;
};
