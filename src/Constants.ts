import { cn } from '@undp/design-system-react/cn';

export const COLOR_SCALES = [
  {
    id: 'contractModifications',
    colors: ['#8BE49D', '#4CA462', '#03682B'],
  },
  {
    id: 'singleBinding',
    colors: ['#CCD2F5', '#8E98D1', '#6466F1'],
  },
  {
    id: 'noCallForTenders',
    colors: ['#FFF3BD', '#EEDB88', '#DFB707'],
  },
  {
    id: 'taxHaven',
    colors: ['#F297B2', '#E9346A', '#A21942'],
  },
  {
    id: 'nonOpenProcedure',
    colors: ['#FFBFA2', '#FF9B6D', '#FD6925'],
  },
  {
    id: 'beneficiaryOwnership',
    colors: ['#E0DEDF', '#B2AFB0', '#666666'],
  },
  {
    id: 'incidence',
    colors: ['#E6CCC0', '#F0B292', '#F49764'],
  },
  {
    id: 'practices',
    colors: ['#FEF8D0', '#FFEF84', '#FFDD00'],
  },
  {
    id: 'counterMeasures',
    colors: ['#FFD5E6', '#F884E9', '#D001B4'],
  },
  {
    id: 'antiCorruptionAuthorities',
    colors: ['#DABFE9', '#B772DC', '#9B13E4'],
  },
];

export const MAIN_INDICATORS_COLORS = [
  {
    id: 'Public Procurement',
    colors: '#00904A',
  },
  {
    id: 'Anti Corruption Authorities',
    colors: '#E3512C',
  },
];

export const SUB_PILLARS = [
  {
    label: 'Contract Modifications',
    value: 'Contract Modifications',
    mainIndicator: 'Public Procurement',
    mainIndicatorColor: '#00904A',
    indicatorColor: '#4CA462',
    colors: ['#8BE49D', '#4CA462', '#03682B'],
  },
  {
    label: 'No Call for tenders Published',
    value: 'No Call for tenders Published',
    mainIndicator: 'Public Procurement',
    mainIndicatorColor: '#00904A',
    indicatorColor: '#DFB707',
    colors: ['#FFF3BD', '#EEDB88', '#DFB707'],
  },
  {
    label: 'Tax Haven',
    value: 'Tax Haven',
    mainIndicator: 'Public Procurement',
    mainIndicatorColor: '#00904A',
    indicatorColor: '#A21942',
    colors: ['#F297B2', '#E9346A', '#A21942'],
  },
  {
    label: 'Non-open procedure',
    value: 'Non-open procedure',
    mainIndicator: 'Public Procurement',
    mainIndicatorColor: '#00904A',
    indicatorColor: '#FD6925',
    colors: ['#FFBFA2', '#FF9B6D', '#FD6925'],
  },
  {
    label: 'Beneficiary ownership',
    value: 'Beneficiary ownership',
    mainIndicator: 'Public Procurement',
    mainIndicatorColor: '#00904A',
    indicatorColor: '#666666',
    colors: ['#E0DEDF', '#B2AFB0', '#666666'],
  },
  {
    label: 'Incidence',
    value: 'Incidence',
    mainIndicator: 'Business Experiences',
    mainIndicatorColor: '#E3512C',
    indicatorColor: '#F49764',
    colors: ['#E6CCC0', '#F0B292', '#F49764'],
  },
  {
    label: 'Practices',
    value: 'Practices',
    mainIndicator: 'Business Experiences',
    mainIndicatorColor: '#E3512C',
    indicatorColor: '#FFDD00',
    colors: ['#FEF8D0', '#FFEF84', '#FFDD00'],
  },
  {
    label: 'Counter Measures',
    value: 'Counter Measures',
    mainIndicator: 'Business Experiences',
    mainIndicatorColor: '#E3512C',
    indicatorColor: '#D001B4',
    colors: ['#FFD5E6', '#F884E9', '#D001B4'],
  },
];

export const MARKET = [
  'Architecture & Engineering',
  'Business Services',
  'Construction Work',
  'Education',
  'Healthcare',
  'Hospitality',
  'IT Services',
  'Medical Equipment',
  'Repair & Maintenance',
];

export const CONTRACT_VALUE = ['All', 'High', 'High + Medium'];

export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DROPDOWN_CLASSNAMES: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleValue: (state: any) =>
    cn(
      'text-base',
      state.isDisabled ? 'text-primary-gray-500!' : 'text-primary-white!',
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (state: any) =>
    cn(
      'bg-transparent text-base hover:bg-primary-gray-700!',
      state.isSelected
        ? 'bg-primary-gray-700! text-primary-white font-bold'
        : 'bg-primary-gray-400',
      state.isFocused
        ? 'bg-primary-gray-700! text-primary-white'
        : 'bg-primary-gray-400',
    ),
  placeholder: () =>
    'text-primary-gray-550! dark:text-primary-gray-400! text-base',
  group: () => 'py-0!',
  groupHeading: () =>
    'font-bold! text-base! normal-case! py-[12px]! m-0! bg-primary-gray-600 text-primary-gray-700! text-primary-white!',
  input: () => 'text-base undp-select-input',
  valueContainer: () => 'px-2 py-[2px]',
  menu: () =>
    'rounded-none! mt-1! border-0! shadow-lg! p-0! bg-primary-gray-650!',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DROPDOWN_CLASSNAMES_WHITE: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleValue: (state: any) =>
    cn(
      'text-base text-primary-gray-700!',
      state.isDisabled ? 'text-primary-gray-500!' : 'text-primary-gray-700!',
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (state: any) =>
    cn(
      'bg-[#fff]! poppins-regular text-[#2D4858]! py-4! text-base hover:bg-[#4B6E91]! hover:text-[#fff]!',
      state.isSelected
        ? 'bg-primary-gray-100! text-primary-gray-700 font-bold'
        : 'bg-primary-white',
      state.isFocused
        ? 'bg-primary-gray-100! text-primary-gray-700'
        : 'bg-primary-white',
    ),
  placeholder: () =>
    'text-primary-gray-550! dark:text-primary-gray-400! text-base',
  group: () => 'py-0!',
  groupHeading: () =>
    'font-bold! text-base! normal-case! py-[12px]! m-0! bg-primary-gray-600 text-primary-gray-700! text-primary-white!',
  input: () => 'text-base',
  valueContainer: () => 'px-2 py-[2px]',
  menu: () => 'mt-1! border-0! shadow-lg! bg-primary-white! rounded-[8px]!',
  menuList: () => 'rounded-[8px]! !p-0 !m-0',
  indicatorSeparator: () => '!hidden',
  dropdownIndicator: () => '[&>svg]:stroke-[#545463]',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DROPDOWN_CLASSNAMES_MULTI_SELECT: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleValue: (state: any) =>
    cn(
      'text-base text-primary-gray-700!',
      state.isDisabled ? 'text-primary-gray-500!' : 'text-primary-gray-700!',
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (state: any) =>
    cn(
      'bg-transparent poppins-regular text-base hover:bg-primary-gray-300! text-primary-gray-700!',
      state.isSelected ? 'bg-primary-gray-100! font-bold' : '',
      state.isFocused
        ? 'bg-primary-gray-100! text-primary-gray-700'
        : 'bg-primary-white',
    ),
  placeholder: () =>
    'text-primary-gray-550! dark:text-primary-gray-400! text-base',
  group: () => 'py-0!',
  groupHeading: () =>
    'font-bold! text-base! normal-case! py-[12px]! m-0! bg-primary-gray-600 text-primary-gray-700! text-primary-white!',
  input: () => 'text-base undp-select-input px-0!',
  valueContainer: () => 'px-2 py-[2px]',
  menu: () =>
    'mt-1! border-0! shadow-lg! bg-primary-white! rounded-[8px]! overflow-hidden!',
  menuList: () => 'rounded-xl !p-0 !m-0',
  indicatorSeparator: () => 'hidden!',
  dropdownIndicator: () => '[&>svg]:stroke-[#545463]',
};
