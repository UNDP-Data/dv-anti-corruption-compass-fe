/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { ExternalLink } from 'lucide-react';
import { Spacer } from '@undp/design-system-react/Spacer';

import { ErrorState } from '@/Components/ErrorState';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { getUncacReviewStatus } from '@/QueryFn/CountryProfileData/getUncacReviewStatus';
import { NoData } from '@/Components/NoData';
interface Props {
  isoCode: string;
}

function useDataForCountry() {
  return useQuery({
    queryKey: ['uncac-review-status-data'],
    queryFn: getUncacReviewStatus,
  });
}

function UncacReviewStatus({ isoCode }: Props) {
  const { data, isError, isLoading } = useDataForCountry();
  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  const countryData = (data as any).find((d: any) => d.ISO3_Code === isoCode);
  return (
    <div className='flex w-full flex-col'>
      <HeadingText
        type='h2'
        marginBottom='lg'
        className='text-[var(--color-text-black)]'
      >
        UNCAC review status
      </HeadingText>
      {countryData ? (
        <>
          <ParagraphText
            weight='medium'
            marginBottom='none'
            className='text-[var(--color-text-black)]'
          >
            Review Cycle 1
          </ParagraphText>
          <Spacer size='base' />
          <ParagraphText
            marginBottom='none'
            className='text-[var(--color-text-black)]'
          >
            {countryData['Review Cycle 1 - Summary']}
          </ParagraphText>
          <Spacer size='base' />
          <a
            href={countryData['Review Cycle 1 - PDF Link']}
            target='_blank'
            className='text-[var(--color-text-black)] flex gap-2 items-center'
          >
            <ParagraphText
              marginBottom='none'
              className='text-[var(--color-text-black)] underline'
            >
              View Source
            </ParagraphText>
            <ExternalLink
              width={20}
              height={20}
              strokeWidth={2}
              stroke='#000'
            />
          </a>
          <Spacer size='3xl' />
          <ParagraphText
            weight='medium'
            marginBottom='none'
            className='text-[var(--color-text-black)]'
          >
            Review Cycle 2
          </ParagraphText>
          <Spacer size='base' />
          <ParagraphText
            marginBottom='none'
            className='text-[var(--color-text-black)]'
          >
            {countryData['Review Cycle 2 - Summary']}
          </ParagraphText>
          <Spacer size='base' />
          <a
            href={countryData['Review Cycle 2 - PDF Link']}
            target='_blank'
            className='text-[var(--color-text-black)] flex gap-2 items-center'
          >
            <ParagraphText
              marginBottom='none'
              className='text-[var(--color-text-black)] underline'
            >
              View Source
            </ParagraphText>
            <ExternalLink
              width={20}
              height={20}
              strokeWidth={2}
              stroke='#000'
            />
          </a>
        </>
      ) : (
        <NoData isBgWhite />
      )}
    </div>
  );
}

export default UncacReviewStatus;
