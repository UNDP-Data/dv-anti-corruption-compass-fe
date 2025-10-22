import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Spinner } from '@undp/design-system-react/Spinner';
import { useNavigate } from '@tanstack/react-router';

import { HeadingText, ParagraphText } from './Typography';

import { CountryTaxonomyDataType } from '@/Types';
import { DROPDOWN_CLASSNAMES_WHITE } from '@/Constants';
import { customDropdownComponents } from '@/Utils/DropdownComponents';

export const CountrySelect = ({
  countryTaxonomy,
  heading,
  description,
}: {
  countryTaxonomy: CountryTaxonomyDataType[];
  heading: string;
  description: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className='gap-8 flex flex-col w-full text-primary-gray-700 pt-7'>
      <div className='flex flex-col gap-3'>
        <HeadingText type='h2'>{heading}</HeadingText>
        <ParagraphText leading='snug'>{description}</ParagraphText>
      </div>
      {countryTaxonomy.length > 0 ? (
        <DropdownSelect
          placeholder='Select country'
          options={countryTaxonomy.map(d => ({
            label: d['Country or Area'],
            value: d['Alpha-3 code'],
          }))}
          onChange={d => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigate({ to: `/countries/${(d as any).value}` });
          }}
          size='base'
          variant='normal'
          className='bg-primary-white! border-0! rounded-full! px-4!'
          classNames={DROPDOWN_CLASSNAMES_WHITE}
          components={customDropdownComponents('light', false)}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
