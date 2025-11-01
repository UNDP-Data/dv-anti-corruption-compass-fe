export type STATUS_DATA_TYPE = 'LOW' | 'MEDIUM' | 'HIGH' | 'NOT AVAILABLE';

export interface CountryDataType {
  mainIndicator: string;
  subIndicator: string;
  level: STATUS_DATA_TYPE;
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

export interface IndicatorDataType {
  ISO3_Code: string;
  Year: number;
  Indicator: string;
  Indicator_value: STATUS_DATA_TYPE;
  Indicator_value_numeric: number;
  Data_Availability: number;
}

export interface DataType {
  id: string;
  data: IndicatorDataType[];
}

export interface SubPillarsMetaDataType {
  value: string;
  id: string;
  color: string;
  colors: string[];
  description: string;
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
  level: STATUS_DATA_TYPE;
}

export interface PillarDataType {
  id: string;
  country: string;
  subPillar: string;
  value: number;
  dataAvailability: string;
  level: STATUS_DATA_TYPE;
}
