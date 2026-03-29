import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getUncacReviewStatus = async () => {
  const response = await fetchAndParseCSV('/data/UNCACReviewStatus.csv');
  return response;
};
