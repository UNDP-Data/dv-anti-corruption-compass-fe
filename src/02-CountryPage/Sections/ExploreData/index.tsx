import { H2 } from '@undp/design-system-react/Typography';
import { useState } from 'react';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';
import { cn } from '@undp/design-system-react/cn';

import ProcurementViz from './ProcurementViz';
import DefaultViz from './DefaultViz';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';

interface Props {
  pillarsMetaData: PillarsMetaDataType[];
  countryData?: CountryTaxonomyDataType;
}

function ExploreData({ pillarsMetaData, countryData }: Props) {
  const [view, setView] = useState<string>(pillarsMetaData[0].value);
  return (
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
          options={[...new Set(pillarsMetaData.map(d => d.value))].map(d => ({
            label: d,
            value: d,
          }))}
          size='base'
          variant='normal'
          className='rounded-full p-0 border-0 w-full'
          activeButtonClassName={cn(
            'rounded-full py-4 px-16 poppins-bold text-white transition-all duration-200 bg-gradient-to-r',
          )}
          buttonClassName='px-16 poppins-regular py-4 rounded-full w-1/2'
          buttonStyle={{
            active: {
              backgroundImage: `linear-gradient(to right, ${pillarsMetaData.find(d => d.value === view)?.colors[0]}, ${pillarsMetaData.find(d => d.value === view)?.colors[1]})`,
            },
            inactive: {},
          }}
        />
        {view === 'Public Procurement' ? (
          <ProcurementViz
            country={countryData?.['Country or Area'] || ''}
            isoCode={countryData?.['Alpha-3 code'] || ''}
            pillarsMetaData={pillarsMetaData}
          />
        ) : (
          <DefaultViz
            country={countryData?.['Country or Area'] || ''}
            subPillars={
              pillarsMetaData
                .find(d => d.value === view)
                ?.subPillars.map(d => d.value) || []
            }
            mainIndicator={view}
            pillarsMetaData={pillarsMetaData}
          />
        )}
      </div>
    </div>
  );
}

export default ExploreData;
