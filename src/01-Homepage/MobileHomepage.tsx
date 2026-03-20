import HomepageEl from './HomepageEl';
import { CountriesDataType, IndicatorsMetaDataType } from '@/Types';

type Props = {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
  countriesListLoading: boolean;
  countriesListError: boolean;
};

export function MobileHomepage(props: Props) {
  // For now, reuse the existing homepage composition so behavior and data are shared.
  // Layout differences will be driven by the mobile container and scoped styles.
  return <HomepageEl {...props} />;
}

