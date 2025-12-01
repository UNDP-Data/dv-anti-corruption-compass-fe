import { Spinner } from '@undp/design-system-react';
import { useQuery } from '@tanstack/react-query';

import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { getCountryData } from '@/QueryFn/getCountryData';
import { ErrorState } from '@/Components/ErrorState';
import { getMarkets } from '@/QueryFn/getMarkets';
import { getRegionList } from '@/QueryFn/getRegionList';

function useDataForCountry(countryCode: string, mainIndicatorId: number) {
  const countryData = useQuery({
    queryKey: ['indicator-data', countryCode, mainIndicatorId],
    queryFn: () => getCountryData(countryCode, mainIndicatorId),
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
      })),
  });
  const marketList = useQuery({
    queryKey: ['marketList'],
    queryFn: getMarkets,
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
