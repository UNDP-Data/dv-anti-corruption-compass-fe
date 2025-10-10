export interface TaxonomyType {
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
}
