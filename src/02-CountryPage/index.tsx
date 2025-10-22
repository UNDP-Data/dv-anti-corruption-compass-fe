import { Spacer } from '@undp/design-system-react/Spacer';
import { useEffect, useState } from 'react';

import CountryProfile from './Sections/CountryProfile';
import ExploreData from './Sections/ExploreData';
import Overview from './Sections/Overview';

import {
  CountryTaxonomyDataType,
  DataType,
  PillarsMetaDataType,
} from '@/Types';
import { CountrySelect } from '@/Components/CountrySelect';
import { getFullData } from '@/Utils/getData';

interface Props {
  isoCode: string;
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
}

function CountryPageEl({ isoCode, pillarsMetaData, countryTaxonomy }: Props) {
  const countryData = countryTaxonomy.find(d => d['Alpha-3 code'] === isoCode);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    getFullData(pillarsMetaData).then(d => {
      setData(d);
    });
  }, [pillarsMetaData]);
  if (!countryData) {
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
  return (
    <div className='w-full'>
      <Overview
        pillarsMetaData={pillarsMetaData}
        data={data.filter(d => d.id === isoCode)}
        countryTaxonomy={countryData}
      />
      <ExploreData
        countryData={countryData}
        pillarsMetaData={pillarsMetaData}
      />
      <div className='container mx-auto'>
        <Spacer size='6xl' />
        <CountryProfile />
      </div>
      <Spacer size='7xl' />
      <Spacer size='7xl' />
    </div>
  );
}

export default CountryPageEl;
