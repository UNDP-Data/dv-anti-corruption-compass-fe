import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Spinner } from '@undp/design-system-react/Spinner';
import { H2, P } from '@undp/design-system-react/Typography';
import { useNavigate } from '@tanstack/react-router';

import { CountryTaxonomyDataType } from '@/Types';
import { DROPDOWN_CLASSNAMES_WHITE } from '@/Constants';

export const CountrySelect = ({
  countryTaxonomy,
  heading,
}: {
  countryTaxonomy: CountryTaxonomyDataType[];
  heading: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className='gap-8 flex flex-col w-full text-primary-gray-700 pt-7'>
      <div className='flex flex-col gap-3'>
        <H2
          className='!text-[24px] poppins-bold text-primary-white'
          marginBottom='none'
        >
          {heading}
        </H2>
        <P
          className='poppins-regular leading-[120%] text-primary-white'
          size='base'
          marginBottom='none'
        >
          Choose a country to reveal its complete anti-corruption profile — from
          key indicators to institutional strategies
        </P>
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
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
