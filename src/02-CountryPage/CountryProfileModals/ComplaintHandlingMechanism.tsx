/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { ExternalLink } from 'lucide-react';
import { Spacer } from '@undp/design-system-react/Spacer';

import { ErrorState } from '@/Components/ErrorState';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { NoData } from '@/Components/NoData';
import { getComplaintHandlingMechanism } from '@/QueryFn/CountryProfileData/getComplaintHandlingMechanism';

interface Props {
  isoCode: string;
}

function useDataForCountry() {
  return useQuery({
    queryKey: ['complaint-handling-mechanism'],
    queryFn: getComplaintHandlingMechanism,
  });
}

function ComplaintHandlingMechanism({ isoCode }: Props) {
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
    <div className='flex w-full flex-col'>
      <HeadingText
        type='h2'
        marginBottom='lg'
        className='text-[var(--color-text-black)]'
      >
        Complaint handling mechanisms
      </HeadingText>
      {countryData.length > 0 ? (
        countryData.map((d: any, i: number) => (
          <div className='flex flex-col' key={i}>
            <ParagraphText
              marginBottom='none'
              className=' text-[var(--color-text-black)]'
            >
              {d['Brief Description']}
            </ParagraphText>
            {d.Link && d.Link !== '' && (
              <>
                <Spacer size='sm' />
                <a
                  href={d.Link}
                  target='_blank'
                  className='flex gap-1 items-start'
                >
                  <ParagraphText
                    weight='bold'
                    marginBottom='none'
                    className='text-[var(--color-text-black)] border-b border-[#4B6E9180] border-b-[2px]'
                  >
                    Explore
                  </ParagraphText>
                  <ExternalLink
                    width={20}
                    height={20}
                    strokeWidth={1.5}
                    stroke='#000'
                  />
                </a>
              </>
            )}
            <Spacer size='2xl' />
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

export default ComplaintHandlingMechanism;
