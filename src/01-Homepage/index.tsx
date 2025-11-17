import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';

import HomepageEl from './HomepageEl';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { ErrorState } from '@/Components/ErrorState';
import { getAllCountriesAllData } from '@/QueryFn/getAllCountriesAllData';

function useAllPillarsData() {
  return useQuery({
    queryKey: ['all-countries-all-data'],
    queryFn: getAllCountriesAllData,
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
        contractValue: d.contractValue === '' ? 'null' : d.contractValue,
      })),
  });
}
function Homepage({
  indicatorsMetaData,
  countriesList,
  countriesListLoading,
  countriesListError,
}: {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
  countriesListLoading: boolean;
  countriesListError: boolean;
}) {
  const { data, isLoading, isError } = useAllPillarsData();

  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  if (data)
    return (
      <HomepageEl
        data={data}
        indicatorsMetaData={indicatorsMetaData}
        countriesList={countriesList}
        countriesListLoading={countriesListLoading}
        countriesListError={countriesListError}
      />
    );
  return;
}

export default Homepage;
