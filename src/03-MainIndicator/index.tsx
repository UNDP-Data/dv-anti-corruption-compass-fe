import { Spacer } from '@undp/design-system-react/Spacer';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';

import Overview from './Overview';
import { CountrySelectionSection } from './Components/CountrySelectionSection';
import Viz from './Viz';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { ErrorState } from '@/Components/ErrorState';
import { getIndicatorData } from '@/QueryFn/getIndicatorData';
import { HeadingText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

interface Props {
  indicatorMetaData: IndicatorsMetaDataType;
  countriesList: CountriesDataType[];
  countriesListDataError: boolean;
  countriesListDataLoading: boolean;
}

function useIndicatorData(indicatorId: number) {
  return useQuery({
    queryKey: ['indicatorData', indicatorId],
    queryFn: () => getIndicatorData(indicatorId),
    select: data =>
      data.map((d: DataType) => ({
        ...d,
        id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
        contractValue: d.contractValue === '' ? 'null' : d.contractValue,
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
  return (
    <>
      <div className='w-full mb-16'>
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
      <div className='container'>
        <div
          style={{
            background:
              'linear-gradient(97.48deg, #17232B -5.56%, #4E7691 156.23%)',
          }}
          className='px-8 !py-[80px] flex items-center justify-center flex-col gap-8 w-full'
        >
          <HeadingText type='h2'>Have feedback for us?</HeadingText>
          <a href='mailto:anti-corruption@undp.org'>
            <Button variant='secondary'>
              Send us an email: anti-corruption@undp.org
            </Button>
          </a>
        </div>
      </div>
      <Spacer size='7xl' />
    </>
  );
}

export default MainIndicatorPageEl;
