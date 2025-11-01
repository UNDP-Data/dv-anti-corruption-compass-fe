import { Spacer } from '@undp/design-system-react/Spacer';

import {
  CountryTaxonomyDataType,
  DataType,
  PillarsMetaDataType,
} from '@/Types';
import { PolarBarChart } from '@/Components/PolarBarChart';
import { HeadingText, ParagraphText } from '@/Components/Typography';

interface Props {
  countryInfo?: CountryTaxonomyDataType;
  pillarsMetaData: PillarsMetaDataType[];
  data: DataType[];
}

function CountryPageEl({ countryInfo, pillarsMetaData, data }: Props) {
  const countryData = data
    .map(d => d.data)
    .flat()
    .filter(d => d.ISO3_Code === countryInfo?.['Alpha-3 code']);
  const latestYear = Math.max(...countryData.map(d => d.Year));

  return (
    <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-26'>
      <img
        alt='Country flag'
        className='w-11 mb-2'
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryInfo?.['Alpha-2 code']}.svg`}
      />
      <HeadingText type='h1'>{countryInfo?.['Country or Area']}</HeadingText>
      <ParagraphText size='sm'>
        {countryInfo?.['Group 1']} | {countryInfo?.['Group 2']}
      </ParagraphText>
      <Spacer size='4xl' />
      <PolarBarChart
        innerRadiusRatio={0.6}
        pillarsMetaData={pillarsMetaData}
        data={countryData.filter(d => d.Year === latestYear)}
      />
    </div>
  );
}

export default CountryPageEl;
