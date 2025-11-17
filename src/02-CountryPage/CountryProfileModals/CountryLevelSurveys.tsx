/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { ExternalLink } from 'lucide-react';
import { Spacer } from '@undp/design-system-react/Spacer';

import { ErrorState } from '@/Components/ErrorState';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { NoData } from '@/Components/NoData';
import { getCountryLevelSurveys } from '@/QueryFn/CountryProfileData/getCountryLevelSurveys';

interface Props {
  isoCode: string;
}

function useDataForCountry() {
  return useQuery({
    queryKey: ['country-level-surveys'],
    queryFn: getCountryLevelSurveys,
  });
}

function CountryLevelSurveys({ isoCode }: Props) {
  const { data, isError, isLoading } = useDataForCountry();
  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  const countryData = (data as any).filter((d: any) => d.ISO3_Code === isoCode);
  const surveys = [
    ...new Set(countryData.map((d: any) => d['Name of survey'])),
  ];
  return (
    <div className='flex w-full flex-col'>
      <HeadingText
        type='h2'
        marginBottom='lg'
        className='text-[var(--color-text-black)]'
      >
        Country level surveys
      </HeadingText>
      {countryData.length > 0 ? (
        surveys.map((d: any, i: number) => (
          <div className='flex flex-col' key={i}>
            <ParagraphText
              marginBottom='none'
              weight='bold'
              className=' text-[var(--color-text-black)]'
            >
              {d}
            </ParagraphText>
            <Spacer size='sm' />
            <div className='flex gap-4'>
              {countryData
                .filter((el: any) => el['Name of survey'] === d)
                .map((el: any, i: number) => (
                  <a
                    key={i}
                    href={el.Link}
                    target='_blank'
                    className='flex gap-1 items-center'
                  >
                    <ParagraphText
                      marginBottom='none'
                      className='underline text-[var(--color-text-black)]'
                    >
                      {el.Year}
                    </ParagraphText>
                    <ExternalLink
                      width={20}
                      height={20}
                      strokeWidth={2}
                      stroke='#000'
                    />
                  </a>
                ))}
            </div>
            <Spacer size='2xl' />
          </div>
        ))
      ) : (
        <NoData isBgWhite />
      )}
    </div>
  );
}

export default CountryLevelSurveys;
