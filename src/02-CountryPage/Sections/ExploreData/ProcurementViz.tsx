import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useEffect, useState } from 'react';
import { DonutChart } from '@undp/data-viz/DonutChart';
import { Spinner } from '@undp/design-system-react';
import { MultiLineChart } from '@undp/data-viz/MultiLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { GroupedBarGraph } from '@undp/data-viz/BarGraph';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';

import {
  CONTRACT_VALUE,
  DROPDOWN_CLASSNAMES,
  MARKET,
  YEARS,
} from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import { PillarDataType, PillarsMetaDataType, RegionDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ColorLegend } from '@/Components/ColorLegend';
import { ParagraphText } from '@/Components/Typography';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { getCountryData, getMarketData, getRegionData } from '@/Utils/getData';
import { BarChartTable } from '@/Components/BarChartTable';

interface Props {
  country: string;
  isoCode: string;
  pillarsMetaData: PillarsMetaDataType[];
}

function ProcurementViz({ country, isoCode, pillarsMetaData }: Props) {
  const [selectedPillar, setSelectedPillar] = useState<string>(
    pillarsMetaData.find(d => d.value === 'Public Procurement')?.subPillars[0]
      .value || '',
  );
  const [pillarData, setPillarData] = useState<PillarDataType[]>([]);
  const [regionData, setRegionData] = useState<RegionDataType[]>([]);
  const [marketData, setMarketData] = useState<
    { market: string; value: number }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedMarket, setSelectedMarket] = useState<string | undefined>(
    undefined,
  );
  const [selectedContractValue, setSelectedContractValue] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    getCountryData().then(d => {
      setPillarData(d);
    });
    getRegionData(isoCode).then(d => {
      setRegionData(d);
    });
    getMarketData().then(d => {
      setMarketData(d);
    });
  }, [isoCode]);
  return (
    <div className='w-full'>
      <Spacer size='xl' />
      <div className='flex items-center gap-4 w-full'>
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Sub-pillar</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedPillar(d.value);
            }}
            value={{ value: selectedPillar, label: selectedPillar }}
            options={(
              pillarsMetaData.find(d => d.value === 'Public Procurement')
                ?.subPillars || []
            ).map(d => ({ value: d.value, label: d.value }))}
            size='base'
            variant='normal'
            className='poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('light', false)}
          />
        </div>
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
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
            className='poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('light', false)}
          />
        </div>
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Market</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedMarket(d.value);
            }}
            value={
              selectedMarket
                ? { value: selectedMarket, label: selectedMarket }
                : undefined
            }
            placeholder='Select market'
            options={MARKET.map(d => ({ value: d, label: d }))}
            size='base'
            variant='normal'
            className='poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
            components={customDropdownComponents('light', false)}
          />
        </div>
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Contract value</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              setSelectedContractValue(d.value);
            }}
            placeholder='Select contract value'
            value={
              selectedContractValue
                ? { value: selectedContractValue, label: selectedContractValue }
                : selectedContractValue
            }
            options={CONTRACT_VALUE.map(d => ({ value: d, label: d }))}
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
          <GraphCard title='Overview' chips={[selectedPillar, selectedYear]}>
            {pillarData ? (
              <>
                <ParagraphText size='sm'>
                  Contract Modification ipsum dolor sit amet consectetur. Nisi
                  potenti id tellus bibendum sed acc semper malesuada. Nulla
                  aenean.
                </ParagraphText>
                <Spacer size='3xl' />
                <div className='flex grow relative'>
                  <DonutChart
                    data={[
                      {
                        label: 'Value',
                        size: 86,
                      },
                      {
                        label: 'Rest',
                        size: 14,
                      },
                    ]}
                    strokeWidth={14}
                    showColorScale={false}
                    colors={[
                      pillarsMetaData.find(
                        d => d.value === 'Public Procurement',
                      )?.color || '#fff',
                      '#fff',
                    ]}
                    mainText='86%'
                  />
                </div>
              </>
            ) : (
              <NoData />
            )}
          </GraphCard>
          <GraphCard
            title='Market Breakdown'
            chips={[selectedPillar, selectedYear]}
          >
            {marketData.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {marketData.map((d, i) => (
                  <div key={i}>
                    <ParagraphText weight='medium' size='sm' marginBottom='2xs'>
                      {d.market}
                    </ParagraphText>
                    <div className='w-full rounded-full bg-primary-white h-2' />
                    <div
                      className='rounded-full h-2 mt-[-8px]'
                      style={{
                        width: `${d.value * 100}%`,
                        backgroundColor:
                          pillarsMetaData.find(
                            d => d.value === 'Public Procurement',
                          )?.color || '#fff',
                      }}
                    />
                  </div>
                ))}
                <div />
              </div>
            ) : (
              <Spinner />
            )}
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Regional Breakdown'
            chips={[selectedPillar, selectedYear]}
            className='basis-full'
          >
            <div className='flex dark'>
              {pillarData ? (
                regionData.length > 0 ? (
                  <div className='flex gap-4 flex-wrap items-stretch'>
                    <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px]'>
                      <ColorLegend
                        size='sm'
                        showTitle={false}
                        colors={
                          pillarsMetaData.find(
                            d => d.value === 'Public Procurement',
                          )?.colors
                        }
                      />

                      <ChoroplethMap
                        mapData={`https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1/${isoCode}.json`}
                        data={transformDataForGraph(
                          regionData,
                          'choroplethMap',
                          [
                            { chartConfigId: 'x', columnId: 'level' },
                            { chartConfigId: 'id', columnId: 'region' },
                          ],
                        )}
                        scaleType='categorical'
                        zoomInteraction='noZoom'
                        colorDomain={['Low', 'Medium', 'High']}
                        colors={
                          pillarsMetaData.find(
                            d => d.value === 'Public Procurement',
                          )?.colors
                        }
                        showColorScale={false}
                        footNote={
                          <div>
                            <ParagraphText
                              size='xs'
                              className='opacity-50 poppins-light'
                            >
                              The designations employed and the presentation of
                              material on this map do not imply the expression
                              of any opinion whatsoever on the part of the
                              Secretariat of the United Nations or UNDP
                              concerning the legal status of any country,
                              territory, city or area or its authorities, or
                              concerning the delimitation of its frontiers or
                              boundaries.
                            </ParagraphText>
                          </div>
                        }
                      />
                    </div>
                    <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px]'>
                      <BarChartTable
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data={regionData.map((d: any) => ({
                          region: d.region,
                          value: d.value,
                        }))}
                        color={
                          pillarsMetaData.find(
                            d => d.value === 'Public Procurement',
                          )?.color || '#fff'
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <Spinner />
                )
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Comparison to global average'
            chips={[selectedPillar]}
          >
            <div className='flex h-[360px] dark'>
              {pillarData ? (
                pillarData.length > 0 ? (
                  <MultiLineChart
                    data={transformDataForGraph(pillarData, 'multiLineChart', [
                      { chartConfigId: 'date', columnId: 'year' },
                      {
                        chartConfigId: 'y',
                        columnId: ['countryValue', 'worldValue'],
                      },
                    ])}
                    labels={[country, 'World']}
                    lineColors={[
                      pillarsMetaData.find(
                        d => d.value === 'Public Procurement',
                      )?.color || '#fff',
                      '#fff',
                    ]}
                    showColorLegendAtTop={false}
                    showDots={false}
                    animate
                    classNames={{
                      xAxis: {
                        labels: 'poppins-regular',
                      },
                      yAxis: {
                        labels: 'poppins-regular',
                      },
                    }}
                  />
                ) : (
                  <Spinner />
                )
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
          <GraphCard title='Data availability' chips={[selectedPillar]}>
            <div className='flex h-[360px] dark'>
              {pillarData ? (
                pillarData.length > 0 ? (
                  <GroupedBarGraph
                    data={transformDataForGraph(pillarData, 'groupedBarChart', [
                      { chartConfigId: 'label', columnId: 'year' },
                      {
                        chartConfigId: 'size',
                        columnId: [
                          'countryDataAvailability',
                          'worldDataAvailability',
                        ],
                      },
                    ])}
                    colorDomain={[country, 'World']}
                    colors={[
                      pillarsMetaData.find(
                        d => d.value === 'Public Procurement',
                      )?.color || '#fff',
                      '#fff',
                    ]}
                    classNames={{
                      xAxis: {
                        labels: 'poppins-regular',
                      },
                    }}
                    animate
                    showValues
                    leftMargin={0}
                    rightMargin={0}
                    orientation='vertical'
                    showTicks={false}
                  />
                ) : (
                  <Spinner />
                )
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

export default ProcurementViz;
