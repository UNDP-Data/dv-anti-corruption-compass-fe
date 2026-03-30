import HomepageEl from './HomepageEl';

import { CountriesDataType, IndicatorsMetaDataType } from '@/Types';

type Props = {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
  countriesListLoading: boolean;
  countriesListError: boolean;
};

export function MobileHomepage(props: Props) {
  // DIAGNOSTIC LOG — remove after confirming root cause
  console.warn(
    '[MobileHomepage] Rendering — NO facts data or cachedGlobeAvailability passed in props.',
    'indicatorsMetaData.length:',
    props.indicatorsMetaData.length,
    '→ HomepageEl will receive data=[] and cachedGlobeAvailability=[], globes will never render.',
  );

  return <HomepageEl {...props} />;
}
