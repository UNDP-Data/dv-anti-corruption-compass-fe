export interface CountryDataType {
  mainIndicator: string;
  subIndicator: string;
  level: 'Low' | 'Medium' | 'High';
  value: number;
  year: number;
}

export interface CountryTaxonomyDataType {
  'Alpha-3 code': string;
  'Country or Area': string;
  'Alpha-2 code': string;
  'Numeric code': string;
  'Latitude (average)': string;
  'Longitude (average)': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
  LDC: boolean;
  LLDC: boolean;
  SIDS: boolean;
  'Development classification': string;
  'Income group': string;
  UNDP_Region: string;
}

export interface DataType {
  id: string;
  country: string;
  subPillar: string;
  mainIndicator: string;
  value: number;
  dataAvailability: number;
  x: 'Low' | 'Medium' | 'High';
}

export interface SubPillarsMetaDataType {
  value: string;
  color: string;
  colors: string[];
}

export interface PillarsMetaDataType {
  value: string;
  id: string;
  description: string;
  color: string;
  indicatorGradientColors: string[];
  colors: string[];
  subPillars: SubPillarsMetaDataType[];
}

export interface RegionDataType {
  region: string;
  value: number;
  dataAvailability: string;
  level: 'Low' | 'Medium' | 'High';
}

export interface PillarDataType {
  id: string;
  country: string;
  subPillar: string;
  value: number;
  dataAvailability: string;
  level: 'Low' | 'Medium' | 'High';
}
