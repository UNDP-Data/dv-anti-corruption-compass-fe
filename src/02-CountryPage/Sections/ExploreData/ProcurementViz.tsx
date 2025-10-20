import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useEffect, useState } from 'react';
import { DonutChart } from '@undp/data-viz/DonutChart';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
} from '@undp/data-viz/fetchAndParseData';
import { Spinner } from '@undp/design-system-react';
import { MultiLineChart } from '@undp/data-viz/MultiLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { GroupedBarGraph } from '@undp/data-viz/BarGraph';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';
import { Badge } from '@undp/design-system-react/Badge';

import {
  CONTRACT_VALUE,
  DROPDOWN_CLASSNAMES,
  MARKET,
  YEARS,
} from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import { PillarsMetaDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ColorLegend } from '@/Components/ColorLegend';
import { ParagraphText } from '@/Components/Typography';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pillarData, setPillarData] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [regionData, setRegionData] = useState<any>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedMarket, setSelectedMarket] = useState<string | undefined>(
    undefined,
  );
  const [selectedContractValue, setSelectedContractValue] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    fetchAndParseJSON('/data/pillarDummyData.json').then(d => {
      setPillarData(d);
    });
  }, [country]);

  useEffect(() => {
    fetchAndParseCSV(
      `https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1_RegionList/${isoCode}.csv`,
    ).then(d => {
      const levels = ['Low', 'Medium', 'High'];
      setRegionData(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d as any).map((el: any) => ({
          region: el['Region name'],
          value: Math.random() * 100,
          level: levels[Math.floor(Math.random() * levels.length)],
        })),
      );
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
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
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
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
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
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
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
            className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
            classNames={DROPDOWN_CLASSNAMES}
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
            {pillarData ? (
              <div className='flex flex-col gap-4'>
                {MARKET.map((d, i) => (
                  <div key={i}>
                    <ParagraphText weight='medium' size='sm' marginBottom='2xs'>
                      {d}
                    </ParagraphText>
                    <div className='w-full rounded-full bg-primary-white h-2' />
                    <div
                      className='rounded-full h-2 mt-[-8px]'
                      style={{
                        width: `${Math.random() * 100}%`,
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
              <NoData />
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
                        className='mb-4'
                        colors={['#DCE7C1', '#ADD06A', '#89C124']}
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
                        colorDomain={['Low', 'Medium', 'High']}
                        colors={['#DCE7C1', '#ADD06A', '#89C124']}
                        showColorScale={false}
                      />
                    </div>
                    <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px]'>
                      <div className='h-[500px] undp-scrollbar'>
                        <div className='flex flex-col'>
                          <div className='flex gap-0 py-2 border-b border-b-[#9BA5AB]'>
                            <div className='w-[10%] px-2 poppins-medium text-[14px] text-[#9BA5AB]'>
                              No.
                            </div>
                            <div className='w-[calc(90%-75px)] px-2 poppins-medium text-[14px] text-[#9BA5AB]'>
                              Region
                            </div>
                            <div className='w-[75px] poppins-medium px-2 text-[14px] text-[#9BA5AB] text-right'>
                              Value
                            </div>
                          </div>
                          {[...regionData]
                            .sort((a, b) => b.value - a.value)
                            .map((d, i) => (
                              <div
                                className='flex gap-0 py-4 items-center'
                                key={i}
                              >
                                <div className='w-[10%] px-2 poppins-medium text-[14px] text-primary-white'>
                                  {i + 1}
                                </div>
                                <div className='w-[calc(90%-75px)] flex items-center'>
                                  <div className='w-[40%] px-2 poppins-medium text-[14px] text-primary-white'>
                                    {d.region}
                                  </div>
                                  <div className='w-[60%] px-2 poppins-medium text-[14px] text-primary-white'>
                                    <div className='w-full rounded-full bg-primary-white h-2' />
                                    <div
                                      className='rounded-full h-2 mt-[-8px]'
                                      style={{
                                        width: `${d.value}%`,
                                        backgroundColor:
                                          pillarsMetaData.find(
                                            d =>
                                              d.value === 'Public Procurement',
                                          )?.color || '#fff',
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className='w-[75px] poppins-medium px-2 text-[14px] text-primary-white text-right'>
                                  <Badge
                                    rounded='full'
                                    className='bg-primary-white! text-primary-gray-700! poppins-bold p-1! text-[14px]! w-full! flex justify-center'
                                  >
                                    {Math.round(d.value)}%
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
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
