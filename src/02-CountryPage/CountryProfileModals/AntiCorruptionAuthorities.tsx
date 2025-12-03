/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { ExternalLink } from 'lucide-react';

import { ErrorState } from '@/Components/ErrorState';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { getAntiCorruptionAuthorities } from '@/QueryFn/CountryProfileData/getAntiCorruptionAuthorities';
import { NoData } from '@/Components/NoData';
interface Props {
  isoCode: string;
}

function useDataForCountry() {
  return useQuery({
    queryKey: ['anti-corruption-authorities-data'],
    queryFn: getAntiCorruptionAuthorities,
  });
}

function AntiCorruptionAuthorities({ isoCode }: Props) {
  const { data, isError, isLoading } = useDataForCountry();
  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );

  const countryData = (data as any).filter((d: any) => d.ISO3_Code === isoCode);
  return (
    <div className='flex w-full flex-col gap-4'>
      <HeadingText
        type='h2'
        marginBottom='lg'
        className='text-[var(--color-text-black)]'
      >
        Anti-corruption authorities
      </HeadingText>
      {countryData.length > 0 ? (
        countryData.map((d: any, i: number) => (
          <div className='flex gap-2 items-center' key={i}>
            <a href={d.Link} target='_blank' className='flex gap-1 items-start'>
              <ParagraphText
                marginBottom='none'
                className='text-[var(--color-text-black)] border-b border-[#4B6E9180] border-b-[2px]'
              >
                {d['Name of anti-corruption/bribery authority/institution']}
              </ParagraphText>
              <ExternalLink
                width={20}
                height={20}
                strokeWidth={1.5}
                stroke='#000'
              />
            </a>
          </div>
        ))
      ) : (
        <div className='my-8'>
          <NoData isBgWhite />
        </div>
      )}
    </div>
  );
}

export default AntiCorruptionAuthorities;
