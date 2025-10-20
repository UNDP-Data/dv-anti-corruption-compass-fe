import { Spacer } from '@undp/design-system-react/Spacer';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';
import { PolarBarChart } from '@/Components/PolarBarChart';
import { HeadingText, ParagraphText } from '@/Components/Typography';

interface Props {
  countryData?: CountryTaxonomyDataType;
  pillarsMetaData: PillarsMetaDataType[];
}

function CountryPageEl({ countryData, pillarsMetaData }: Props) {
  return (
    <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-26'>
      <img
        alt='Country flag'
        className='w-11 mb-2'
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryData?.['Alpha-2 code']}.svg`}
      />
      <HeadingText type='h1'>{countryData?.['Country or Area']}</HeadingText>
      <ParagraphText size='sm'>
        {countryData?.['Group 1']} | {countryData?.['Group 2']}
      </ParagraphText>
      <Spacer size='4xl' />
      <PolarBarChart
        innerRadiusRatio={0.6}
        pillarsMetaData={pillarsMetaData}
        data={pillarsMetaData
          .map(d => d.subPillars.map(el => ({ ...el, mainIndicator: d.value })))
          .flat()
          .map(d => ({
            subIndicator: d.value,
            mainIndicator: d.mainIndicator,
            level: 'Low',
            value: Math.floor(Math.random() * 100),
            year: 2024,
          }))}
      />
    </div>
  );
}

export default CountryPageEl;
