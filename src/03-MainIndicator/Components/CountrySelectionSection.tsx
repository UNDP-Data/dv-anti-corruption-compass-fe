import { Spinner } from '@undp/design-system-react/Spinner';

import { CountrySelect } from '@/Components/CountrySelect';
import { CountryTaxonomyDataType } from '@/Types';

export const CountrySelectionSection = ({
  countryTaxonomy,
  indicator,
  loading = false,
}: {
  countryTaxonomy: CountryTaxonomyDataType[];
  indicator: string;
  loading?: boolean;
}) => {
  return (
    <div
      className={`flex items-center pt-50 w-full px-4 bg-cover bg-center bg-no-repeat bg-[url('/imgs/sphere.webp')] px-34 min-h-[calc(100vh-120px)]`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <CountrySelect
          countryTaxonomy={countryTaxonomy}
          heading={`Uncover detailed ${indicator} data for your country`}
          description='Choose a country to reveal its complete anti-corruption profile — from key indicators to institutional strategies'
        />
      )}
    </div>
  );
};
