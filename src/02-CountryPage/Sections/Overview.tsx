import { Spacer } from '@undp/design-system-react/Spacer';

import {
  CountryTaxonomyDataType,
  DataType,
  PillarsMetaDataType,
} from '@/Types';
import { PolarBarChart } from '@/Components/PolarBarChart';
import { HeadingText, ParagraphText } from '@/Components/Typography';

interface Props {
  countryTaxonomy?: CountryTaxonomyDataType;
  pillarsMetaData: PillarsMetaDataType[];
  data: DataType[];
}

function CountryPageEl({ countryTaxonomy, pillarsMetaData, data }: Props) {
  return (
    <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-26'>
      <img
        alt='Country flag'
        className='w-11 mb-2'
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryTaxonomy?.['Alpha-2 code']}.svg`}
      />
      <HeadingText type='h1'>
        {countryTaxonomy?.['Country or Area']}
      </HeadingText>
      <ParagraphText size='sm'>
        {countryTaxonomy?.['Group 1']} | {countryTaxonomy?.['Group 2']}
      </ParagraphText>
      <Spacer size='4xl' />
      <PolarBarChart
        innerRadiusRatio={0.6}
        pillarsMetaData={pillarsMetaData}
        data={data}
      />
    </div>
  );
}

export default CountryPageEl;
