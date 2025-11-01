import { useState } from 'react';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';

import ProcurementViz from './ProcurementViz';
import DefaultViz from './DefaultViz';

import {
  CountryTaxonomyDataType,
  DataType,
  PillarsMetaDataType,
} from '@/Types';
import { HeadingText } from '@/Components/Typography';

interface Props {
  pillarsMetaData: PillarsMetaDataType[];
  countryInfo?: CountryTaxonomyDataType;
  data: DataType[];
}

function ExploreData({ pillarsMetaData, countryInfo, data }: Props) {
  const [view, setView] = useState<string>(pillarsMetaData[0].id);
  return (
    <div className='flex flex-col gap-6 container mx-auto'>
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
          classNames={{
            items: 'px-16 poppins-regular py-4 rounded-full w-1/2',
            active: 'text-primary-white',
          }}
          buttonStyle={{
            active: {
              backgroundImage: `linear-gradient(to right, ${pillarsMetaData.find(d => d.id === view)?.indicatorGradientColors[0]}, ${pillarsMetaData.find(d => d.id === view)?.indicatorGradientColors[1]})`,
            },
          }}
        />
        {view === 'publicProcurement' ? (
          <ProcurementViz
            country={countryInfo?.['Country or Area'] || ''}
            isoCode={countryInfo?.['Alpha-3 code'] || ''}
            pillarsMetaData={
              pillarsMetaData.find(d => d.id === view) || pillarsMetaData[0]
            }
            data={data.find(d => d.id === view)?.data || []}
          />
        ) : (
          <DefaultViz
            country={countryInfo?.['Country or Area'] || ''}
            subPillars={
              pillarsMetaData
                .find(d => d.id === view)
                ?.subPillars.map(d => d.value) || []
            }
            mainIndicator={view}
            pillarsMetaData={
              pillarsMetaData.find(d => d.id === view) || pillarsMetaData[0]
            }
            data={data.find(d => d.id === view)?.data || []}
          />
        )}
      </div>
    </div>
  );
}

export default ExploreData;
