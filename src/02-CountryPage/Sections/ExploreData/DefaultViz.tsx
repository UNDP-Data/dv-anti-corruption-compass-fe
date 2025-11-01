import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useEffect, useState } from 'react';
import { DonutChart } from '@undp/data-viz/DonutChart';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { Spinner } from '@undp/design-system-react';
import { MultiLineChart } from '@undp/data-viz/MultiLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import { DROPDOWN_CLASSNAMES, YEARS } from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import { IndicatorDataType, PillarsMetaDataType } from '@/Types';
import { ParagraphText } from '@/Components/Typography';
import { customDropdownComponents } from '@/Utils/DropdownComponents';

interface Props {
  country: string;
  mainIndicator: string;
  subPillars: string[];
  pillarsMetaData: PillarsMetaDataType;
  data: IndicatorDataType[];
}

function DefaultViz({ country, subPillars, pillarsMetaData, data }: Props) {
  const [selectedPillar, setSelectedPillar] = useState(subPillars[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pillarData, setPillarData] = useState<any>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2022);

  useEffect(() => {
    fetchAndParseJSON('/data/pillarDummyData.json').then(d => {
      setPillarData(d);
    });
  }, [country]);

  return (
    <div className='w-full'>
      <Spacer size='xl' />
      <div className='flex items-center gap-4 w-full'>
        <div className='flex flex-col gap-1 w-[calc(50%-0.5rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Sub-pillar</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedPillar(d.value);
            }}
            value={{ value: selectedPillar, label: selectedPillar }}
            options={subPillars.map(d => ({ value: d, label: d }))}
            size='base'
            variant='normal'
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('dark', false)}
          />
        </div>
        <div className='flex flex-col gap-1 w-[calc(50%-0.5rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Year</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedYear(d.value);
            }}
            value={{ value: selectedYear, label: selectedYear }}
            options={YEARS.map(d => ({ value: d, label: d }))}
            size='base'
            variant='normal'
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('dark', false)}
          />
        </div>
      </div>
      <Spacer size='2xl' />
      <div className='flex flex-col gap-6'>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard title='Overview' chips={[selectedPillar, selectedYear]}>
            <ParagraphText size='sm'>
              Contract Modification ipsum dolor sit amet consectetur. Nisi
              potenti id tellus bibendum sed acc semper malesuada. Nulla aenean.
            </ParagraphText>
            <Spacer size='3xl' />
            <div className='flex grow relative'>
              <DonutChart
                data={[
                  {
                    label: 'Value',
                    size:
                      data.find(
                        d =>
                          d.Indicator === selectedPillar &&
                          d.Year === selectedYear,
                      )?.Indicator_value_numeric || 0,
                  },
                  {
                    label: 'Rest',
                    size:
                      1 -
                      (data.find(
                        d =>
                          d.Indicator === selectedPillar &&
                          d.Year === selectedYear,
                      )?.Indicator_value_numeric || 0),
                  },
                ]}
                strokeWidth={14}
                showColorScale={false}
                colors={[pillarsMetaData.color || '#fff', '#fff']}
                mainText={
                  data
                    .find(
                      d =>
                        d.Indicator === selectedPillar &&
                        d.Year === selectedYear,
                    )
                    ?.Indicator_value_numeric?.toFixed(2) ?? 'NA'
                }
              />
            </div>
          </GraphCard>
          <GraphCard
            title='Comparison to global average'
            chips={[selectedPillar]}
          >
            <div className='flex h-[360px] dark'>
              {pillarData.length > 0 ? (
                <MultiLineChart
                  data={transformDataForGraph(pillarData, 'multiLineChart', [
                    { chartConfigId: 'date', columnId: 'year' },
                    {
                      chartConfigId: 'y',
                      columnId: ['countryValue', 'worldValue'],
                    },
                  ])}
                  labels={[country, 'World']}
                  lineColors={[pillarsMetaData.color || '#fff', '#fff']}
                  showColorLegendAtTop={false}
                  showDots={false}
                  animate
                />
              ) : (
                <Spinner />
              )}
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
}

export default DefaultViz;
