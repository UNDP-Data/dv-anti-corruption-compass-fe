import { Spacer } from '@undp/design-system-react/Spacer';
import { Link } from '@tanstack/react-router';

import { CountriesDataType } from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { useState } from 'react';

type Props = {
  countriesListData: CountriesDataType[];
  alphabets: string[];
};

export function MobileCountriesListing({ countriesListData, alphabets }: Props) {
  const [search, setSearch] = useState('');

  const filtered = countriesListData.filter(country => {
    const name = country['Country or Area (official name)'];
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className='container mx-auto px-4'>
      <Spacer size='4xl' />
      <HeadingText type='h2'>Country profile</HeadingText>
      <Spacer size='2xl' />
      <div className='mb-6'>
        <input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search countries'
          className='w-full rounded-[8px] px-4 py-3 text-black text-sm'
        />
      </div>
      <div className='flex flex-wrap gap-2 mb-4'>
        {alphabets.map(letter => (
          <button
            key={letter}
            type='button'
            className='px-3 py-1 rounded-full border border-white/40 text-xs'
            onClick={() => {
              const el = document.getElementById(`alpha-${letter}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className='flex flex-col gap-4'>
        {filtered.map(country => (
          <Link
            key={country['Alpha-3 code']}
            to='/countries/$isoCode/{-$indicator}'
            params={{ isoCode: country['Alpha-3 code'] }}
          >
            <div className='w-full rounded-[8px] bg-white/10 px-4 py-3 flex items-center justify-between'>
              <ParagraphText size='sm' weight='medium'>
                {country['Country or Area (official name)']}
              </ParagraphText>
              <ParagraphText size='xs'>
                {country['Group 1']} · {country['Group 2']}
              </ParagraphText>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

