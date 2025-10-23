import {
  fetchAndParseCSV,
  fetchAndParseJSON,
} from '@undp/data-viz/fetchAndParseData';

import { PillarsMetaDataType, SubPillarsMetaDataType } from '@/Types';
import { MARKET } from '@/Constants';

export const getFullData = async (pillarsMetaData: PillarsMetaDataType[]) => {
  const data = await fetchAndParseJSON('/data/data.json');
  const dataFormatted = data
    .map((el: { id: string; country: string }) =>
      pillarsMetaData
        .map(metaData =>
          metaData.subPillars.map(sp => ({
            ...sp,
            mainIndicator: metaData.id,
          })),
        )
        .flat()
        .map(subPillar => ({
          ...el,
          subPillar: subPillar.value,
          mainIndicator: subPillar.mainIndicator,
          value: Math.random(),
          dataAvailability: Math.ceil(Math.random() * 100),
          x: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        })),
    )
    .flat();
  return dataFormatted;
};

export const getPillarData = async (pillarMetaData: SubPillarsMetaDataType) => {
  const data = await fetchAndParseJSON('/data/data.json');
  const dataFormatted = data.map((el: { id: string; country: string }) => ({
    ...el,
    subPillar: pillarMetaData.value,
    value: Math.random(),
    dataAvailability: Math.ceil(Math.random() * 100),
    x: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  }));
  return dataFormatted;
};

export const getCountryData = async () => {
  const data = await fetchAndParseJSON('/data/pillarDummyData.json');
  return data;
};

export const getRegionData = async (countryCode: string) => {
  const data = await fetchAndParseCSV(
    `https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1_RegionList/${countryCode}.csv`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataFormatted = (data as any).map((el: any) => ({
    region: el['Region name'],
    value: Math.random(),
    dataAvailability: Math.ceil(Math.random() * 100),
    level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  }));
  return dataFormatted;
};

export const getMarketData = async () => {
  return MARKET.map(d => ({ market: d, value: Math.random() }));
};
