import { useEffect, useRef } from 'react';

import HomepageEl from './HomepageEl';

import { CountriesDataType, IndicatorsMetaDataType } from '@/Types';
import { useIncrementalHomepageFacts } from './useIncrementalHomepageFacts';

const isDev =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

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

  const loggedFirstBatchRef = useRef(false);
  useEffect(() => {
    if (!isDev || loggedFirstBatchRef.current) return;
    if (factsLoading || factsError) return;
    if (facts.length === 0) return;
    loggedFirstBatchRef.current = true;
    const snapshot = {
      note: 'Homepage: first batch of facts finished loading (Stage A). More rows may load in the background.',
      indicatorsMetaDataCount: indicatorsMetaData.length,
      countriesListCount: countriesList.length,
      factsCount: facts.length,
      factsSample: facts.slice(0, 3),
      globeAvailabilityCount: globeAvailability.length,
      globeAvailabilitySample: globeAvailability.slice(0, 5),
    };
    // eslint-disable-next-line no-console -- intentional dev-only API snapshot
    console.info(
      '[ACC dev] Homepage first-load snapshot (JSON)\n',
      JSON.stringify(snapshot, null, 2),
    );
  }, [
    facts,
    factsLoading,
    factsError,
    indicatorsMetaData.length,
    countriesList.length,
    globeAvailability,
  ]);

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
