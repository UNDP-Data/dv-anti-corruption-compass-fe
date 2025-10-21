import { Checkbox } from '@undp/design-system-react/Checkbox';
import { components } from '@undp/design-system-react/DropdownSelect';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { ParagraphText } from '@/Components/Typography';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDropdownIndicator = (props: any, mode: string) => {
  const { selectProps } = props;
  return (
    <components.DropdownIndicator {...props}>
      {selectProps.menuIsOpen ? (
        <ChevronUp
          className={`h-6 w-6 ${mode === 'light' ? 'stroke-[#545463]' : 'stroke-primary-white'}`}
        />
      ) : (
        <ChevronDown
          className={`h-6 w-6 ${mode === 'light' ? 'stroke-[#545463]' : 'stroke-primary-white'}`}
        />
      )}
    </components.DropdownIndicator>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <div className='flex gap-1'>
          <Checkbox
            checkBoxClassName='rounded-lg border-[#A1A1AA] hover:bg-[#A1A1AA00]'
            checkIconClassName='stroke-[#000]'
            variant='light'
            checked={props.isSelected}
          />
          <ParagraphText size='sm' className='text-primary-black'>
            {props.label}
          </ParagraphText>
        </div>
      </components.Option>
    </div>
  );
};

export const customDropdownComponents = (
  mode = 'dark',
  multiSelect?: boolean,
) => ({
  ...{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DropdownIndicator: (props: any) => CustomDropdownIndicator(props, mode),
  },
  ...(multiSelect ? { Option } : {}),
});
