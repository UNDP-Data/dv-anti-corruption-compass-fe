import { useState } from 'react';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';
import { cn } from '@undp/design-system-react/cn';

import ProcurementViz from './ProcurementViz';
import DefaultViz from './DefaultViz';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';
import { HeadingText } from '@/Components/Typography';

interface Props {
  pillarsMetaData: PillarsMetaDataType[];
  countryData?: CountryTaxonomyDataType;
}

function ExploreData({ pillarsMetaData, countryData }: Props) {
  const [view, setView] = useState<string>(pillarsMetaData[0].id);
  return (
    <div className='flex flex-col gap-6 container-lg mx-auto'>
      <HeadingText type='h2'>Explore data</HeadingText>
      <div className='flex gap-4 w-full items-center flex-col justify-between'>
        <SegmentedControl
          color='blue'
          value={view}
          onValueChange={d => {
            setView(d);
          }}
          options={pillarsMetaData.map(d => ({
            label: d.value,
            value: d.id,
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
              backgroundImage: `linear-gradient(to right, ${pillarsMetaData.find(d => d.id === view)?.indicatorGradientColors[0]}, ${pillarsMetaData.find(d => d.id === view)?.indicatorGradientColors[1]})`,
            },
            inactive: {},
          }}
        />
        {view === 'publicProcurement' ? (
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
                .find(d => d.id === view)
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
