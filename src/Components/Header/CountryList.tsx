import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { useEffect, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';
import { Search } from '@undp/design-system-react/Search';
import { Link } from '@tanstack/react-router';

import { HeadingText } from '../Typography';

import { TaxonomyType } from '@/Types';

export const CountryList = ({
  setShowCountrySelection,
}: {
  setShowCountrySelection: (_d: boolean) => void;
}) => {
  const [countryTaxonomy, setCountryTaxonomy] = useState<TaxonomyType[]>([]);
  const [searchedCountries, setSearchedCountries] = useState<TaxonomyType[]>(
    [],
  );
  useEffect(() => {
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/refs/heads/main/country_territory_groups.json',
    ).then(d => {
      setCountryTaxonomy(d);
      setSearchedCountries(d);
    });
  }, []);
  return (
    <div className='flex flex-col gap-6'>
      <HeadingText type='h2'>Available countries</HeadingText>
      {countryTaxonomy.length > 0 ? (
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
                  ? countryTaxonomy.filter(country =>
                      country['Country or Area']
                        .toLowerCase()
                        .includes(d.toLowerCase()),
                    )
                  : countryTaxonomy,
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
