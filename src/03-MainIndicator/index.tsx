import { Spacer } from '@undp/design-system-react/Spacer';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { useMemo } from 'react';

import Overview from './Overview';
import { CountrySelectionSection } from './Components/CountrySelectionSection';
import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { ErrorState } from '@/Components/ErrorState';
import { getIndicatorData } from '@/QueryFn/getIndicatorData';
import { ParagraphText } from '@/Components/Typography';
import seededStageAFacts from '@/static/factsStageA.json';

interface Props {
  indicatorMetaData: IndicatorsMetaDataType;
  countriesList: CountriesDataType[];
  countriesListDataError: boolean;
  countriesListDataLoading: boolean;
}

const seededFactsStageAData = seededStageAFacts as unknown as DataType[];

function useIndicatorData(indicatorId: number) {
  const seeded = useMemo(() => {
    if (
      !Array.isArray(seededFactsStageAData) ||
      seededFactsStageAData.length === 0
    )
      return [] as DataType[];
    // Seed quickly from bundled facts (subset) so the page can render immediately,
    // then React Query will refetch full `/Facts?mainIndicatorId=...` in background.
    return seededFactsStageAData.filter(d => d.mainIndicatorId === indicatorId);
  }, [indicatorId]);

  return useQuery({
    queryKey: ['indicatorData', indicatorId],
    queryFn: () => getIndicatorData(indicatorId),
    initialData: seeded,
    // Treat bundled data as stale so it refetches and swaps in the latest API response.
    initialDataUpdatedAt: 0,
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
      })),
  });
}
function MainIndicatorPageEl({
  indicatorMetaData,
  countriesList,
  countriesListDataLoading,
  countriesListDataError,
}: Props) {
  const { data, isLoading, isError } = useIndicatorData(
    indicatorMetaData.mainIndicatorId,
  );
  if (indicatorMetaData.comingSoon) {
    return (
      <div className='w-full mb-0 flex flex-col gap-4 justify-center items-center'>
        <Overview
          title={indicatorMetaData.name}
          description={indicatorMetaData.description}
          hideDownArrow
        />
        <ParagraphText size='xl' alignment='center' className='w-full mt-6'>
          Data coming soon
        </ParagraphText>
      </div>
    );
  }
  return (
    <>
      <div className='w-full mb-0'>
        <Overview
          title={indicatorMetaData.name}
          description={indicatorMetaData.description}
        />
        {isLoading && <Spinner size='lg' className='my-20 m-auto' />}
        {isError && (
          <div className='px-4 container mx-auto'>
            <ErrorState />
          </div>
        )}
        {data && (
          <Viz
            indicatorMetaData={indicatorMetaData}
            countriesList={countriesList}
            data={data}
          />
        )}
        <Spacer size='6xl' />
        {!countriesListDataError && (
          <CountrySelectionSection
            indicator={indicatorMetaData.name.toLowerCase()}
            countriesList={countriesList || []}
            loading={countriesListDataLoading}
          />
        )}
      </div>
    </>
  );
}

export default MainIndicatorPageEl;
