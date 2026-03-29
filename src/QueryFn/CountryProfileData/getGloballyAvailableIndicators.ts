import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getGloballyAvailableIndicators = async () => {
  const response = await fetchAndParseCSV(
    '/data/globallyAvailableIndicators.csv',
  );
  return response;
};
