import { fetchAndParseCSV } from '@undp/data-viz/fetchAndParseData';

export const getComplaintHandlingMechanism = async () => {
  const response = await fetchAndParseCSV(
    '/data/complaintHandlingMechanism.csv',
  );
  return response;
};
