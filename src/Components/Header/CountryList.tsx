import { useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';
import { Search } from '@undp/design-system-react/Search';
import { Link } from '@tanstack/react-router';

import { HeadingText } from '../Typography';
import { ErrorState } from '../ErrorState';

import { CountryTaxonomyDataType } from '@/Types';

export const CountryList = ({
  setShowCountrySelection,
  countryTaxonomyData,
  countryTaxonomyDataLoading,
  countryTaxonomyDataError,
  mode,
}: {
  setShowCountrySelection: (_d: boolean) => void;
  countryTaxonomyData: CountryTaxonomyDataType[];
  countryTaxonomyDataLoading: boolean;
  countryTaxonomyDataError: boolean;
  mode: 'dark' | 'light';
}) => {
  const [searchedCountries, setSearchedCountries] =
    useState(countryTaxonomyData);
  if (countryTaxonomyDataError) return <ErrorState />;
  return (
    <div className='flex flex-col gap-6'>
      <HeadingText
        type='h2'
        className={mode === 'light' ? 'text-[#545463]' : 'text-[#fff]'}
      >
        Available countries
      </HeadingText>
      {countryTaxonomyData.length > 0 && !countryTaxonomyDataLoading ? (
        <>
          <Search
            buttonVariant='icon'
            className='flex-row-reverse'
            inputSize='sm'
            inputVariant='light'
            inputClassName='bg-primary-white rounded-full py-3 px-3 border-1 border-[#D9D9D9] text-[#000] w-full poppins-regular !text-[12px]'
            showSearchButton={false}
            onSearch={d => {
              setSearchedCountries(
                d
                  ? countryTaxonomyData.filter(country =>
                      country['Country or Area']
                        .toLowerCase()
                        .includes(d.toLowerCase()),
                    )
                  : countryTaxonomyData,
              );
            }}
          />
          <div className='flex items-center gap-x-4 gap-y-8 flex-wrap'>
            {searchedCountries.map((country, i) => (
              <Link
                key={i}
                to='/countries/$isoCode'
                params={{ isoCode: country['Alpha-3 code'] }}
                className={`poppins-medium w-[calc(33.33%-0.67rem)] !text-[16px] ${mode === 'light' ? 'text-[#545463]' : 'text-[#fff]'}`}
                onClick={() => {
                  setShowCountrySelection(false);
                }}
              >
                {country['Country or Area']}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <Spinner size='sm' className='m-auto' />
      )}
    </div>
  );
};
