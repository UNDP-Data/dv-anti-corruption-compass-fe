import { Spinner } from '@undp/design-system-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { getCountryData } from '@/QueryFn/getCountryData';
import { ErrorState } from '@/Components/ErrorState';

import seededStageAFacts from '@/static/factsStageA.json';

const seededFactsStageAData = seededStageAFacts as unknown as DataType[];

function useDataForCountry(countryCode: string, mainIndicatorId: number) {
  const seeded = useMemo(() => {
    if (!Array.isArray(seededFactsStageAData) || seededFactsStageAData.length === 0)
      return [] as DataType[];
    // Seed quickly from bundled facts (subset) so the page can render immediately,
    // then React Query will refetch the full country payload in background.
    return seededFactsStageAData.filter(
      d => d.countryCode === countryCode && d.mainIndicatorId === mainIndicatorId,
    );
  }, [countryCode, mainIndicatorId]);

  return useQuery({
    queryKey: ['indicator-data', countryCode, mainIndicatorId],
    queryFn: () => getCountryData(countryCode, mainIndicatorId),
    initialData: seeded,
    initialDataUpdatedAt: 0,
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
      })),
  });
}

interface Props {
  countryInfo: CountriesDataType;
  indicatorMetaData: IndicatorsMetaDataType;
  suffix: string;
}

function DefaultViz({ countryInfo, indicatorMetaData, suffix }: Props) {
  const { data, isLoading, isError } = useDataForCountry(
    countryInfo['Alpha-3 code'],
    indicatorMetaData.mainIndicatorId,
  );

  if (isLoading)
    return (
      <div className='my-8'>
        <Spinner size='lg' className='my-20 m-auto' />
      </div>
    );
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  if (data)
    return (
      <Viz data={data} indicatorMetaData={indicatorMetaData} suffix={suffix} />
    );
  return;
}

export default DefaultViz;
