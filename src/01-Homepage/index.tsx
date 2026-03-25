import HomepageEl from './HomepageEl';

import { CountriesDataType, IndicatorsMetaDataType } from '@/Types';
import { useIncrementalHomepageFacts } from './useIncrementalHomepageFacts';

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
  const {
    facts,
    factsLoading,
    factsError,
    globeAvailability,
    cachedCountriesYes,
  } = useIncrementalHomepageFacts({
    indicatorsMetaData,
    firstPillarsCount: 2,
  });

  return (
    <HomepageEl
      data={facts}
      factsLoading={factsLoading}
      factsError={factsError}
      cachedCountriesYes={cachedCountriesYes}
      cachedGlobeAvailability={globeAvailability}
      indicatorsMetaData={indicatorsMetaData}
      countriesList={countriesList}
      countriesListLoading={countriesListLoading}
      countriesListError={countriesListError}
    />
  );
}

export default Homepage;
