import { cn } from '@undp/design-system-react/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DROPDOWN_CLASSNAMES: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  singleValue: (state: any) =>
    cn(
      'text-base text-primary-gray-700!',
      state.isDisabled ? 'text-primary-gray-500!' : 'text-primary-gray-700!',
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (state: any) =>
    cn(
      'bg-[#fff]! poppins-regular text-[#2D4858]! py-4! text-base hover:bg-[#4B6E91]! hover:text-[var(--color-text-white)]!',
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
    'poppins-bold! text-base! normal-case! py-[12px]! m-0! text-primary-gray-700! bg-transparent! font-bold!',
  input: () => 'text-base',
  valueContainer: () => 'px-2 py-[2px]',
  menu: () => 'mt-1! border-0! shadow-lg! bg-primary-white! rounded-[8px]!',
  menuList: () => 'rounded-[8px]! !p-0 !m-0',
  indicatorSeparator: () => '!hidden',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DROPDOWN_CLASSNAMES_MULTI_SELECT: any = {
  ...DROPDOWN_CLASSNAMES,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (state: any) =>
    cn(
      'bg-transparent poppins-regular text-base hover:bg-primary-gray-300! text-primary-gray-700!',
      state.isSelected ? 'bg-primary-gray-100! font-bold' : '',
      state.isFocused
        ? 'bg-primary-gray-100! text-primary-gray-700'
        : 'bg-primary-white',
    ),
  input: () => 'text-base undp-select-input px-0!',
};
