import { useEffect, useState } from 'react';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { Spacer } from '@undp/design-system-react/Spacer';

import CountryProfile from './Sections/CountryProfile';
import ExploreData from './Sections/ExploreData';
import Overview from './Sections/Overview';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';
import { CountrySelect } from '@/Components/CountrySelect';

interface Props {
  isoCode: string;
  pillarsMetaData: PillarsMetaDataType[];
}

function CountryPageEl({ isoCode, pillarsMetaData }: Props) {
  const [countryData, setCountryData] = useState<
    CountryTaxonomyDataType | undefined
  >(undefined);
  const [countryTaxonomy, setCountryTaxonomy] = useState<
    CountryTaxonomyDataType[]
  >([]);
  const [invalidCountry, setInvalidCountry] = useState(false);
  useEffect(() => {
    const fetchData = fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/refs/heads/main/country_territory_groups.json',
    );
    fetchData.then(d => {
      setCountryTaxonomy(d as CountryTaxonomyDataType[]);
      const country = d.find(
        (c: CountryTaxonomyDataType) => c['Alpha-3 code'] === isoCode,
      );
      setCountryData(country);
      setInvalidCountry(country ? false : true);
    });
  }, [isoCode]);
  if (invalidCountry) {
    return (
      <div className='px-4 max-w-[1272px] mx-auto'>
        <CountrySelect
          countryTaxonomy={countryTaxonomy}
          heading="We don't have the data for the selected country"
        />
      </div>
    );
  }
  return (
    <div className='w-full'>
      <Overview pillarsMetaData={pillarsMetaData} countryData={countryData} />
      <ExploreData
        countryData={countryData}
        pillarsMetaData={pillarsMetaData}
      />
      <div className='max-w-[1660px] mx-auto px-16'>
        <Spacer size='6xl' />
        <CountryProfile />
      </div>
      <Spacer size='7xl' />
      <Spacer size='7xl' />
    </div>
  );
}

export default CountryPageEl;
