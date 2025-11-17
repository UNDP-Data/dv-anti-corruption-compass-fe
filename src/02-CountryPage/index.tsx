import { Spacer } from '@undp/design-system-react/Spacer';
import { SegmentedControl } from '@undp/design-system-react';
import { useState } from 'react';

import CountryProfile from './Sections/CountryProfile';
import ProcurementViz from './Sections/ProcurementViz';
import DefaultViz from './Sections/DefaultViz';

import { CountrySelect } from '@/Components/CountrySelect';
import { CountriesDataType, IndicatorsMetaDataType } from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

interface Props {
  isoCode: string;
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
}

function CountryPageEl({ isoCode, indicatorsMetaData, countriesList }: Props) {
  const countryInfo = countriesList.find(d => d['Alpha-3 code'] === isoCode);
  const [view, setView] = useState(indicatorsMetaData[0].mainIndicatorId);
  if (!countryInfo) {
    return (
      <div className='px-4 container mx-auto'>
        <CountrySelect
          countriesList={countriesList}
          heading="We don't have the data for the selected country"
          description='Please select a country from the dropdown below'
        />
      </div>
    );
  }
  return (
    <div className='flex flex-col container mx-auto'>
      <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-16'>
        <img
          alt='Country flag'
          className='w-11 mb-2'
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryInfo?.['Alpha-2 code']}.svg`}
        />
        <HeadingText type='h1'>
          {countryInfo['Country or Area (official name)']}
        </HeadingText>
        <ParagraphText size='sm'>
          {countryInfo?.['Group 1']} | {countryInfo?.['Group 2']}
        </ParagraphText>
        <Spacer size='2xl' />
        <div className='w-full sm:w-[600px]'>
          <SegmentedControl
            color='blue'
            value={`${view}`}
            onValueChange={d => {
              setView(parseInt(d, 10));
            }}
            options={indicatorsMetaData.map(d => ({
              label: d.name,
              value: `${d.mainIndicatorId}`,
            }))}
            size='base'
            variant='normal'
            className='rounded-full p-0 border-0 w-full'
            classNames={{
              items: 'px-8 poppins-regular py-4 rounded-full w-1/2',
              active: 'text-primary-white',
            }}
            buttonStyle={{
              active: {
                backgroundImage: `linear-gradient(to right, ${indicatorsMetaData.find(d => d.mainIndicatorId === view)?.gradientColor.split(',')[0]}, ${indicatorsMetaData.find(d => d.mainIndicatorId === view)?.gradientColor.split(',')[1]})`,
              },
            }}
          />
        </div>
        {view === 1 ? (
          <ProcurementViz
            countryInfo={countryInfo}
            indicatorMetaData={
              indicatorsMetaData.find(
                d => d.mainIndicatorId === view,
              ) as IndicatorsMetaDataType
            }
            maxValue={1}
          />
        ) : (
          <DefaultViz
            countryInfo={countryInfo}
            indicatorMetaData={
              indicatorsMetaData.find(
                d => d.mainIndicatorId === view,
              ) as IndicatorsMetaDataType
            }
            maxValue={100}
          />
        )}
        <div className='container mx-auto'>
          <Spacer size='6xl' />
          <CountryProfile isoCode={isoCode} />
        </div>
        <Spacer size='3xl' />
      </div>
      <div
        style={{
          background:
            'linear-gradient(97.48deg, #17232B -5.56%, #4E7691 156.23%)',
        }}
        className='px-8 !py-[80px] flex items-center justify-center flex-col gap-8 w-full'
      >
        <HeadingText type='h2'>Have feedback for us?</HeadingText>
        <a href='mailto:anti-corruption@undp.org'>
          <Button variant='secondary'>
            Send us an email: anti-corruption@undp.org
          </Button>
        </a>
      </div>
      <Spacer size='7xl' />
    </div>
  );
}

export default CountryPageEl;
