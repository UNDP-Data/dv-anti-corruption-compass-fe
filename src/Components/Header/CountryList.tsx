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
}: {
  setShowCountrySelection: (_d: boolean) => void;
  countryTaxonomyData: CountryTaxonomyDataType[];
  countryTaxonomyDataLoading: boolean;
  countryTaxonomyDataError: boolean;
}) => {
  const [searchedCountries, setSearchedCountries] =
    useState(countryTaxonomyData);
  if (countryTaxonomyDataError) return <ErrorState />;
  return (
    <div className='flex flex-col gap-6'>
      <HeadingText type='h2'>Available countries</HeadingText>
      {countryTaxonomyData.length > 0 && !countryTaxonomyDataLoading ? (
        <>
          <Search
            buttonVariant='icon'
            className='flex-row-reverse'
            inputSize='sm'
            inputVariant='light'
            inputClassName='bg-transparent rounded-full py-3 px-3 border-1 border-[#000] text-[#000] w-full poppins-regular !text-[12px]'
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
                className='poppins-regular w-[calc(33.33%-0.67rem)] !text-[16px]'
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
