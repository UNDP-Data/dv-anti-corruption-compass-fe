import { Spinner } from '@undp/design-system-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { getCountryData } from '@/QueryFn/getCountryData';
import { ErrorState } from '@/Components/ErrorState';
import { getMarkets } from '@/QueryFn/getMarkets';
import { getRegionList } from '@/QueryFn/getRegionList';
import seededStageAFacts from '@/static/factsStageA.json';
import seededProductMarkets from '@/static/productMarkets.json';

const seededFactsStageAData = seededStageAFacts as unknown as DataType[];

function useDataForCountry(countryCode: string, mainIndicatorId: number) {
  const seededCountryFacts = useMemo(() => {
    if (
      !Array.isArray(seededFactsStageAData) ||
      seededFactsStageAData.length === 0
    )
      return [] as DataType[];
    return seededFactsStageAData.filter(
      d =>
        d.countryCode === countryCode && d.mainIndicatorId === mainIndicatorId,
    );
  }, [countryCode, mainIndicatorId]);

  const countryData = useQuery({
    queryKey: ['indicator-data', countryCode, mainIndicatorId],
    queryFn: () => getCountryData(countryCode, mainIndicatorId),
    initialData: seededCountryFacts,
    initialDataUpdatedAt: 0,
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
      })),
  });
  const marketList = useQuery({
    queryKey: ['marketList'],
    queryFn: getMarkets,
    initialData: seededProductMarkets as unknown as {
      productMarketId: number;
      mainIndicatorId: number;
      name: string;
      description: string | null;
    }[],
    initialDataUpdatedAt: 0,
  });
  const regionList = useQuery({
    queryKey: ['regionList', countryCode],
    queryFn: () => getRegionList(countryCode),
  });
  return { countryData, marketList, regionList };
}

interface Props {
  countryInfo: CountriesDataType;
  indicatorMetaData: IndicatorsMetaDataType;
  suffix: string;
}

function ProcurementViz({ countryInfo, indicatorMetaData, suffix }: Props) {
  const { countryData, marketList, regionList } = useDataForCountry(
    countryInfo['Alpha-3 code'],
    indicatorMetaData.mainIndicatorId,
  );

  const isLoading =
    marketList.isLoading || countryData.isLoading || regionList.isLoading;
  const isError =
    marketList.isError || countryData.isError || regionList.isError;
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
  if (countryData.data && marketList.data && regionList.data)
    return (
      <Viz
        data={countryData.data}
        marketList={marketList.data}
        regionList={regionList.data}
        indicatorMetaData={indicatorMetaData}
        suffix={suffix}
        countryCode={countryInfo['Alpha-3 code']}
      />
    );
  return;
}

export default ProcurementViz;
