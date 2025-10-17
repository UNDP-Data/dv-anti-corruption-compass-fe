import { H2, P } from '@undp/design-system-react/Typography';
import { useEffect, useState } from 'react';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';
import { cn } from '@undp/design-system-react/cn';
import { Spacer } from '@undp/design-system-react/Spacer';

import ProcurementViz from './ProcurementViz';
import CountryProfile from './CountryProfile';

import { CountryTaxonomyDataType } from '@/Types';
import { PolarBarChart } from '@/Components/PolarBarChart';
import { SUB_PILLARS } from '@/Constants';

interface Props {
  isoCode: string;
}

function CountryPageEl({ isoCode }: Props) {
  const [countryData, setCountryData] = useState<
    CountryTaxonomyDataType | undefined
  >(undefined);
  const [view, setView] = useState<string>(SUB_PILLARS[0].mainIndicator);
  useEffect(() => {
    const fetchData = fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/refs/heads/main/country_territory_groups.json',
    );
    fetchData.then(d => {
      setCountryData(
        d.find((c: CountryTaxonomyDataType) => c['Alpha-3 code'] === isoCode),
      );
    });
  }, [isoCode]);
  return (
    <div className='w-full'>
      <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-26'>
        <img
          alt='Country flag'
          className='w-11 mb-2'
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryData?.['Alpha-2 code']}.svg`}
        />
        <H2
          className='poppins-bold !text-[48px] text-primary-white'
          marginBottom='none'
        >
          {countryData?.['Country or Area']}
        </H2>
        <P className='poppins-regular !text-[14px] !leading-[140%] text-primary-white mb-10'>
          {countryData?.['Group 1']} | {countryData?.['Group 2']}
        </P>
        <PolarBarChart
          innerRadiusRatio={0.6}
          data={[
            {
              subIndicator: 'Contract Modifications',
              mainIndicator: 'Public Procurement',
              level: 'Low',
              value: 90,
              year: 2024,
            },
            {
              subIndicator: 'No Call for tenders Published',
              mainIndicator: 'Public Procurement',
              level: 'Low',
              value: 20,
              year: 2024,
            },
            {
              subIndicator: 'Tax Haven',
              mainIndicator: 'Public Procurement',
              level: 'Low',
              value: 60,
              year: 2024,
            },
            {
              subIndicator: 'Non-open procedure',
              mainIndicator: 'Public Procurement',
              level: 'Low',
              value: 40,
              year: 2024,
            },
            {
              subIndicator: 'Beneficiary ownership',
              mainIndicator: 'Public Procurement',
              level: 'Low',
              value: 80,
              year: 2024,
            },
            {
              subIndicator: 'Incidence',
              mainIndicator: 'Business Experiences',
              level: 'Low',
              value: 10,
              year: 2024,
            },
            {
              subIndicator: 'Practices',
              mainIndicator: 'Business Experiences',
              level: 'Low',
              value: 20,
              year: 2024,
            },
            {
              subIndicator: 'Counter Measures',
              mainIndicator: 'Business Experiences',
              level: 'Low',
              value: 70,
              year: 2024,
            },
          ]}
        />
      </div>
      <div className='flex flex-col gap-6 max-w-[1660px] mx-auto px-16'>
        <H2
          className='poppins-bold !text-[24px] text-primary-white'
          marginBottom='none'
        >
          Explore data
        </H2>
        <div className='flex gap-4 w-full items-center flex-col justify-between'>
          <SegmentedControl
            color='blue'
            value={view}
            onValueChange={d => {
              setView(d);
            }}
            options={[...new Set(SUB_PILLARS.map(d => d.mainIndicator))].map(
              d => ({ label: d, value: d }),
            )}
            size='base'
            variant='normal'
            className='rounded-full p-0 border-0 w-full'
            activeButtonClassName={cn(
              'rounded-full py-4 px-16 poppins-bold text-white transition-all duration-200',
              view === 'Public Procurement'
                ? 'bg-gradient-to-r from-[#00904A] to-[#789D24]'
                : 'bg-gradient-to-r from-[#E3512C] to-[#F66428]',
            )}
            buttonClassName='px-16 poppins-regular py-4 rounded-full w-1/2'
          />
          {view === 'Public Procurement' ? (
            <ProcurementViz
              country={countryData?.['Country or Area'] || ''}
              isoCode={isoCode}
            />
          ) : null}
        </div>
      </div>
      <div className='max-w-[1660px] mx-auto px-16'>
        <Spacer size='6xl' />
        <CountryProfile
          country={countryData?.['Country or Area'] || ''}
          isoCode={isoCode}
        />
      </div>
      <Spacer size='7xl' />
      <Spacer size='7xl' />
    </div>
  );
}

export default CountryPageEl;
