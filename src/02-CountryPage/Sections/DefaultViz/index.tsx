import { Spinner } from '@undp/design-system-react';
import { useQuery } from '@tanstack/react-query';

import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { getCountryData } from '@/QueryFn/getCountryData';
import { ErrorState } from '@/Components/ErrorState';

function useDataForCountry(countryCode: string, mainIndicatorId: number) {
  return useQuery({
    queryKey: ['indicator-data', countryCode, mainIndicatorId],
    queryFn: () => getCountryData(countryCode, mainIndicatorId),
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
