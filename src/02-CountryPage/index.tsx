import { Spacer } from '@undp/design-system-react/Spacer';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';

import CountryProfile from './Sections/CountryProfile';
import ExploreData from './Sections/ExploreData';
import Overview from './Sections/Overview';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';
import { CountrySelect } from '@/Components/CountrySelect';
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
interface Props {
  isoCode: string;
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
}

function CountryPageEl({ isoCode, pillarsMetaData, countryTaxonomy }: Props) {
  const countryInfo = countryTaxonomy.find(d => d['Alpha-3 code'] === isoCode);
  const { data, isLoading, isError } = useAllPillarsData(
    pillarsMetaData.map(d => d.id),
  );

  if (!countryInfo) {
    return (
      <div className='px-4 container mx-auto'>
        <CountrySelect
          countryTaxonomy={countryTaxonomy}
          heading="We don't have the data for the selected country"
          description='Please select a country from the dropdown below'
        />
      </div>
    );
  }
  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  if (data)
    return (
      <div className='w-full'>
        <Overview
          pillarsMetaData={pillarsMetaData}
          data={data}
          countryInfo={countryInfo}
        />
        <ExploreData
          countryInfo={countryInfo}
          pillarsMetaData={pillarsMetaData}
          data={data.map(d => ({
            ...d,
            data: d.data.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (el: any) => el.ISO3_Code === countryInfo['Alpha-3 code'],
            ),
          }))}
        />
        <div className='container mx-auto'>
          <Spacer size='6xl' />
          <CountryProfile />
        </div>
        <Spacer size='7xl' />
        <Spacer size='7xl' />
      </div>
    );
  return;
}

export default CountryPageEl;
