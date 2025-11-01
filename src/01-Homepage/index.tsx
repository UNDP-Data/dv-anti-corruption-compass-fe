import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';

import HomepageEl from './HomepageEl';

import { PillarsMetaDataType, CountryTaxonomyDataType } from '@/Types';
import { ErrorState } from '@/Components/ErrorState';

async function fetchData(pillarId: string) {
  return fetchAndParseJSON(`/data/${pillarId}.json`);
}
function useAllPillarsData(pillarsId: string[]) {
  return useQuery({
    queryKey: ['all-pillars'],
    queryFn: async () => {
      const results = await Promise.all(
        pillarsId.map(async (d: string) => ({
          id: d,
          data: await fetchData(d),
        })),
      );
      return results;
    },
  });
}
function Homepage({
  pillarsMetaData,
  countryTaxonomy,
}: {
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
}) {
  const { data, isLoading, isError } = useAllPillarsData(
    pillarsMetaData.map(d => d.id),
  );

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
        pillarsMetaData={pillarsMetaData}
        countryTaxonomy={countryTaxonomy}
      />
    );
  return;
}

export default Homepage;
