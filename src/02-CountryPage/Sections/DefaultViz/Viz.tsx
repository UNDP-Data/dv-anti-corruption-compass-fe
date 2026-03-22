import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { DonutChart } from '@undp/data-viz/DonutChart';
import { SimpleLineChart } from '@undp/data-viz/SimpleLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { useEffect, useState } from 'react';

import { DROPDOWN_CLASSNAMES } from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import { DataType, IndicatorsMetaDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ParagraphText } from '@/Components/Typography';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { PolarBarChart } from '@/Components/PolarBarChart';

interface Props {
  data: DataType[];
  indicatorMetaData: IndicatorsMetaDataType;
  suffix: string;
}

function Viz({ data, indicatorMetaData, suffix }: Props) {
  const yearList = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
  const latestYear = yearList[0];
  const firstSubIndicator = indicatorMetaData.subIndicators[0];
  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [selectedSubIndicator, setSelectedSubIndicator] = useState({
    value: indicatorMetaData.subIndicators[0].id,
    label: indicatorMetaData.subIndicators[0].name,
  });
  useEffect(() => {
    setSelectedYear(latestYear);
  }, [latestYear]);
  useEffect(() => {
    setSelectedSubIndicator({
      value: firstSubIndicator.id,
      label: firstSubIndicator.name,
    });
  }, [firstSubIndicator]);
  return (
    <div className='w-full'>
      <PolarBarChart
        innerRadiusRatio={0.6}
        indicatorMetaData={indicatorMetaData}
        data={data.filter(d => d.year === latestYear)}
        maxValue={indicatorMetaData.maxValue ?? 100}
        year={latestYear}
      />
      <Spacer size='8xl' />
      <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full'>
        <div className='flex flex-col gap-1 w-full lg:w-[calc(25%-0.75rem)] grow-1 lg:min-w-[240px]'>
          <Label className='text-primary-white'>Sub-pillar</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedSubIndicator(d);
            }}
            value={selectedSubIndicator}
            options={indicatorMetaData.subIndicators.map(d => ({
              value: d.id,
              label: d.name,
            }))}
            size='base'
            variant='normal'
            className='poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('light', false)}
          />
        </div>
        <div className='flex flex-col gap-1 w-full lg:w-[calc(25%-0.75rem)] grow-1 lg:min-w-[240px]'>
          <Label className='text-primary-white'>Year</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedYear(d.value);
            }}
            value={{ value: selectedYear, label: selectedYear }}
            options={yearList.map(d => ({
              value: d,
              label: d,
            }))}
            size='base'
            variant='normal'
            className='poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('light', false)}
          />
        </div>
      </div>
      <Spacer size='2xl' />
      <div className='flex flex-col gap-6'>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Overview'
            chips={[selectedSubIndicator.label, selectedYear]}
          >
            {data.filter(
              d =>
                d.id === selectedSubIndicator.value && d.year === selectedYear,
            ).length !== 0 ? (
              <>
                <ParagraphText size='sm'>
                  {
                    indicatorMetaData.subIndicators.find(
                      d => d.id === selectedSubIndicator.value,
                    )?.description
                  }
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
                              d.id === selectedSubIndicator.value &&
                              d.year === selectedYear,
                          )?.numericValue || 0,
                      },
                      {
                        label: 'Rest',
                        size:
                          (indicatorMetaData.maxValue ?? 100) -
                          (data.find(
                            d =>
                              d.id === selectedSubIndicator.value &&
                              d.year === selectedYear,
                          )?.numericValue || 0),
                      },
                    ]}
                    strokeWidth={14}
                    showColorScale={false}
                    colors={[indicatorMetaData.mainColor || '#fff', '#fff']}
                    mainText={
                      data.find(
                        d =>
                          d.id === selectedSubIndicator.value &&
                          d.year === selectedYear,
                      )?.numericValue !== null &&
                      data.find(
                        d =>
                          d.id === selectedSubIndicator.value &&
                          d.year === selectedYear,
                      )?.numericValue !== undefined
                        ? `${data
                            .find(
                              d =>
                                d.id === selectedSubIndicator.value &&
                                d.year === selectedYear,
                            )
                            ?.numericValue?.toFixed(2)}${suffix}`
                        : 'NA'
                    }
                  />
                </div>
              </>
            ) : (
              <NoData />
            )}
          </GraphCard>
          <GraphCard
            title='Trend over time'
            chips={[selectedSubIndicator.label]}
          >
            <div className='flex h-[360px] dark'>
              {data.filter(d => d.regionId === null).length > 0 ? (
                <SimpleLineChart
                  data={transformDataForGraph(
                    data.filter(
                      d =>
                        d.regionId === null &&
                        d.id === selectedSubIndicator.value,
                    ),
                    'lineChart',
                    [
                      { chartConfigId: 'date', columnId: 'year' },
                      {
                        chartConfigId: 'y',
                        columnId: 'numericValue',
                      },
                    ],
                  )}
                  lineColor={indicatorMetaData.mainColor || '#fff'}
                  showDots
                  animate
                  suffix={suffix}
                  classNames={{
                    xAxis: {
                      labels: 'poppins-regular',
                    },
                    yAxis: {
                      labels: 'poppins-regular',
                    },
                    tooltip:
                      'poppins-regular bg-[var(--color-text-black)] p-4 border-0',
                  }}
                  tooltip={d => {
                    return (
                      <div className='flex flex-col bg-[var(--color-text-black)]'>
                        <ParagraphText size='sm' weight='bold'>
                          {d.data.year}
                        </ParagraphText>
                        <div className='flex gap-8 justify-between pt-4'>
                          <ParagraphText size='sm'>
                            {selectedSubIndicator.label}
                          </ParagraphText>
                          <ParagraphText size='sm'>
                            {d.data.numericValue ?? 'NA'}
                            {d.data.numericValue ? suffix : ''}
                          </ParagraphText>
                        </div>
                      </div>
                    );
                  }}
                />
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
}

export default Viz;
