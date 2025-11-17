import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getCountryLevelSurveys = async () => {
  const response = await fetchAndParseCSV('/data/countryLevelSurvey.csv');
  return response;
};
