export type STATUS_DATA_TYPE = 'LOW' | 'MEDIUM' | 'HIGH' | 'NOT AVAILABLE';

export interface DataAvailabilityDataType {
  Country_code_ISO_3: string;
  Year: number;
  Product_market?: string;
  Indicator: string;
  Contract_value?: string;
  Indicator_availability: number;
}

export interface DataType {
  factId: number;
  countryCode: string;
  regionId: number | null;
  year: number;
  mainIndicatorId: number;
  subIndicatorId: number;
  id: string;
  productMarketId: number | null;
  contractValue: string;
  indicatorValue: null | STATUS_DATA_TYPE;
  numericValue: number;
  totalNumberOfRiskyContracts: number;
  allContracts: number | null;
  totalContractValueMillionUsd: number;
  indicatorAvailabilityFilter: string;
}

export interface SubIndicatorsMetaDataType {
  subIndicatorId: number;
  mainIndicatorId: number;
  code: string;
  name: string;
  description: string;
  color: string;
  colors: string;
  id: string;
}

export interface IndicatorsMetaDataType {
  mainIndicatorId: number;
  name: string;
  description: string;
  mainColor: string;
  gradientColor: string;
  comingSoon?: boolean;
  maxValue?: number;
  subIndicators: SubIndicatorsMetaDataType[];
}

export interface CountriesFromApiDataType {
  countryCode: string;
  name: string;
}

export interface CountriesDataType {
  'Alpha-3 code': string;
  'Country or Area (official name)': string;
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
}
