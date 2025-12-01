import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { DonutChart } from '@undp/data-viz/DonutChart';
import { SimpleLineChart } from '@undp/data-viz/SimpleLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react';
import { Badge } from '@undp/design-system-react/Badge';
import { getTextColorBasedOnBgColor } from '@undp/data-viz/utils';

import SubNationalVIz from './SubNationalVIz';

import { DROPDOWN_CLASSNAMES } from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import {
  DataAvailabilityDataType,
  DataType,
  IndicatorsMetaDataType,
} from '@/Types';
import { NoData } from '@/Components/NoData';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { BarChartList } from '@/Components/BarChartList';
import { getDataAvailability } from '@/QueryFn/getDataAvailability';
import { ErrorState } from '@/Components/ErrorState';

interface MarketListDataType {
  productMarketId: number;
  name: string;
}

interface RegionListDataType {
  regionId: number;
  name: string;
}

interface Props {
  data: DataType[];
  indicatorMetaData: IndicatorsMetaDataType;
  marketList: MarketListDataType[];
  regionList: RegionListDataType[];
  countryCode: string;
  suffix: string;
}

const CONTRACT_VALUE = ['All', 'High', 'High + Medium'];

function useDataDataAvailability() {
  return useQuery({
    queryKey: ['data-availability-data'],
    queryFn: getDataAvailability,
    select: data =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).map((d: any) => ({
        ...d,
        Indicator_availability: d.Indicator_availability * 100,
      })),
  });
}

function Viz({
  data,
  indicatorMetaData,
  marketList,
  regionList,
  countryCode,
  suffix,
}: Props) {
  const dataAvailabilityData = useDataDataAvailability();
  const yearList = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
  const latestYear = yearList[0];
  const marketListForCountry = [...new Set(data.map(d => d.productMarketId))]
    .filter(d => d !== null)
    .map(d => marketList.find(m => m.productMarketId === d))
    .filter(d => d !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
  const [selectedYear, setSelectedYear] = useState(yearList[0]);
  const [selectedSubIndicator, setSelectedSubIndicator] = useState({
    value: indicatorMetaData.subIndicators[0].id,
    label: indicatorMetaData.subIndicators[0].name,
  });
  const [selectedMarket, setSelectedMarket] = useState<
    undefined | MarketListDataType
  >(undefined);
  const [selectedContractValue, setSelectedContractValue] = useState({
    value: 'ALL',
    label: 'All',
  });
  useEffect(() => {
    setSelectedYear(latestYear);
  }, [latestYear]);
  const latestCountryData = data.filter(
    d =>
      d.year === latestYear &&
      d.regionId === null &&
      d.productMarketId === null,
  );
  return (
    <div className='w-full'>
      <HeadingText type='h3' alignment='center'>
        {latestYear}
      </HeadingText>
      <Spacer size='4xl' />
      <div className='dark'>
        <div className='flex w-full pb-2 border-b border-b-primary-white'>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[50%] pr-4!'>
            Indicator name
          </div>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[25%] pr-4!'>
            Indicator value
          </div>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[25%] pr-4!'>
            Status
          </div>
        </div>
        <div>
          {indicatorMetaData.subIndicators.map((el, i) => {
            const tagColors = el.colors.split(',');
            return (
              <div key={i}>
                <div className='flex w-full py-4 border-b border-b-[0.5px] border-b-primary-white items-center'>
                  <div className='poppins-light text-[16px]! text-primary-white! w-[50%] pr-4!'>
                    {el.name} ({el.description})
                  </div>
                  <div className='poppins-light text-[16px]! text-primary-white! w-[25%] pr-4!'>
                    {latestCountryData.find(d => d.id === el.id)
                      ?.numericValue ?? 'NA'}{' '}
                    {latestCountryData.find(d => d.id === el.id)
                      ?.numericValue !== null ||
                    latestCountryData.find(d => d.id === el.id)
                      ?.numericValue !== undefined
                      ? suffix
                      : ''}
                  </div>
                  <div className='poppins-light text-[16px]! text-primary-white! w-[25%] pr-4!'>
                    <Badge
                      rounded='full'
                      className='poppins-medium py-0 text-[12px]! px-3!'
                      style={{
                        backgroundColor: !latestCountryData.find(
                          d => d.id === el.id,
                        )?.indicatorValue
                          ? '#DADADA'
                          : ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                latestCountryData.find(d => d.id === el.id)
                                  ?.indicatorValue || 'NA',
                              ) !== -1
                            ? tagColors[
                                ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                  latestCountryData.find(d => d.id === el.id)
                                    ?.indicatorValue || 'NA',
                                )
                              ]
                            : '#DADADA',
                        color: !latestCountryData.find(d => d.id === el.id)
                          ?.indicatorValue
                          ? '#000'
                          : getTextColorBasedOnBgColor(
                              ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                latestCountryData.find(d => d.id === el.id)
                                  ?.indicatorValue || 'NA',
                              ) !== -1
                                ? tagColors[
                                    ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                      latestCountryData.find(
                                        d => d.id === el.id,
                                      )?.indicatorValue || 'NA',
                                    )
                                  ]
                                : '#DADADA',
                            ),
                      }}
                    >
                      {latestCountryData.find(d => d.id === el.id)
                        ?.indicatorValue || 'NA'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Spacer size='xl' />
        <ParagraphText size='sm' className='italic! opacity-50'>
          *Indicator values are categorized as High, Medium, Low, or Not
          Available based on each country's relative position in a given year.
          Countries in the top third of the distribution are classified as High,
          those in the middle third as Medium, and those in the bottom third as
          Low, while missing values are labeled Not Available. Consequently, the
          thresholds defining each category vary by year.
        </ParagraphText>
      </div>
      <Spacer size='8xl' />
      <div className='flex items-center gap-4 w-full'>
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
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
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
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
        <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
          <Label className='text-primary-white'>Market</Label>
          <DropdownSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(d: any) => {
              const opt = d
                ? {
                    name: d.label,
                    productMarketId: d.value,
                  }
                : undefined;
              setSelectedMarket(opt);
            }}
            value={
              selectedMarket
                ? {
                    value: selectedMarket.productMarketId,
                    label: selectedMarket.name,
                  }
                : undefined
            }
            placeholder='Select market'
            options={marketListForCountry.map(d => ({
              value: d.productMarketId,
              label: d.name,
            }))}
            isClearable
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
              setSelectedContractValue(d);
            }}
            placeholder='Select contract value'
            value={selectedContractValue}
            options={CONTRACT_VALUE.map(d => ({
              value: d.toUpperCase(),
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
                d.id === selectedSubIndicator.value &&
                d.year === selectedYear &&
                d.productMarketId ===
                  (selectedMarket ? selectedMarket.productMarketId : null) &&
                d.contractValue === selectedContractValue.value &&
                d.numericValue !== null,
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
                              d.year === selectedYear &&
                              d.productMarketId ===
                                (selectedMarket
                                  ? selectedMarket.productMarketId
                                  : null) &&
                              d.contractValue === selectedContractValue.value,
                          )?.numericValue || 0,
                      },
                      {
                        label: 'Rest',
                        size:
                          (indicatorMetaData.maxValue ?? 100) -
                          (data.find(
                            d =>
                              d.id === selectedSubIndicator.value &&
                              d.year === selectedYear &&
                              d.productMarketId ===
                                (selectedMarket
                                  ? selectedMarket.productMarketId
                                  : null) &&
                              d.contractValue === selectedContractValue.value,
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
                          d.year === selectedYear &&
                          d.productMarketId ===
                            (selectedMarket
                              ? selectedMarket.productMarketId
                              : null) &&
                          d.contractValue === selectedContractValue.value,
                      )?.numericValue !== null &&
                      data.find(
                        d =>
                          d.id === selectedSubIndicator.value &&
                          d.year === selectedYear &&
                          d.productMarketId ===
                            (selectedMarket
                              ? selectedMarket.productMarketId
                              : null) &&
                          d.contractValue === selectedContractValue.value,
                      )?.numericValue !== undefined
                        ? `${data
                            .find(
                              d =>
                                d.id === selectedSubIndicator.value &&
                                d.year === selectedYear &&
                                d.productMarketId ===
                                  (selectedMarket
                                    ? selectedMarket.productMarketId
                                    : null) &&
                                d.contractValue === selectedContractValue.value,
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
            title='Market Breakdown'
            chips={[selectedSubIndicator.label, selectedYear]}
          >
            <div className='flex flex-col h-full gap-4'>
              {data.filter(
                d =>
                  d.year === selectedYear &&
                  d.contractValue === selectedContractValue.value &&
                  d.id === selectedSubIndicator.value &&
                  d.productMarketId !== null,
              ).length > 0 ? (
                <BarChartList
                  data={data
                    .filter(
                      d =>
                        d.year === selectedYear &&
                        d.contractValue === selectedContractValue.value &&
                        d.id === selectedSubIndicator.value &&
                        d.productMarketId !== null,
                    )
                    .map(d => ({
                      id: marketList.find(
                        el => el.productMarketId === d.productMarketId,
                      )?.name as string,
                      value: d.numericValue,
                    }))}
                  color={indicatorMetaData.mainColor}
                  maxValue={indicatorMetaData.maxValue ?? 100}
                  suffix={indicatorMetaData.suffix || ''}
                />
              ) : (
                <div className='h-full flex items-center'>
                  <NoData />
                </div>
              )}
              <div />
            </div>
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Regional Breakdown'
            chips={[selectedSubIndicator.label, selectedYear]}
            className='basis-full'
          >
            <SubNationalVIz
              mainIndicatorId={indicatorMetaData.mainIndicatorId}
              regionList={regionList}
              countryCode={countryCode}
              productMarketId={selectedMarket?.productMarketId || null}
              year={selectedYear}
              subIndicatorId={selectedSubIndicator.value}
              mainColor={indicatorMetaData.mainColor}
              colors={
                indicatorMetaData.subIndicators.find(
                  d => d.id === selectedSubIndicator.value,
                )?.colors || ''
              }
              contractValue={selectedContractValue.value}
              suffix={suffix}
              maxValue={indicatorMetaData.maxValue ?? 100}
            />
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Trend over time'
            chips={[selectedSubIndicator.label]}
          >
            <div className='flex h-[360px] dark w-full'>
              {data.filter(
                d =>
                  d.regionId === null &&
                  d.contractValue === selectedContractValue.value &&
                  d.id === selectedSubIndicator.value &&
                  d.productMarketId ===
                    (selectedMarket ? selectedMarket.productMarketId : null) &&
                  d.numericValue !== null &&
                  d.numericValue !== undefined,
              ).length > 0 ? (
                <SimpleLineChart
                  data={transformDataForGraph(
                    data.filter(
                      d =>
                        d.regionId === null &&
                        d.numericValue !== null &&
                        d.id === selectedSubIndicator.value &&
                        d.contractValue === selectedContractValue.value &&
                        d.productMarketId ===
                          (selectedMarket
                            ? selectedMarket.productMarketId
                            : null),
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
                        <div className='flex gap-8 justify-between py-4 border-b border-b-[#ffffff40]'>
                          <ParagraphText size='sm'>
                            {selectedSubIndicator.label}
                          </ParagraphText>
                          <ParagraphText size='sm'>
                            {d.data.numericValue ?? 'NA'}
                            {d.data.numericValue != null && suffix}
                          </ParagraphText>
                        </div>
                        <div className='flex gap-8 justify-between py-4 border-b border-b-[#ffffff40]'>
                          <ParagraphText size='sm'>
                            No. of contracts
                          </ParagraphText>
                          <ParagraphText size='sm'>
                            {d.data.allContracts ?? 'NA'}
                          </ParagraphText>
                        </div>
                        <div className='flex gap-8 justify-between py-4 border-b border-b-[#ffffff40]'>
                          <ParagraphText size='sm'>
                            No. of risky contracts
                          </ParagraphText>
                          <ParagraphText size='sm'>
                            {d.data.totalNumberOfRiskyContracts ?? 'NA'}
                          </ParagraphText>
                        </div>
                        <div className='flex gap-8 justify-between pt-4'>
                          <ParagraphText size='sm'>
                            Total contract value (USD)
                          </ParagraphText>
                          <ParagraphText size='sm'>
                            {d.data.totalContractValueMillionUsd ?? 'NA'}
                          </ParagraphText>
                        </div>
                      </div>
                    );
                  }}
                />
              ) : (
                <div className='h-full flex items-center justify-center w-full'>
                  <NoData />
                </div>
              )}
            </div>
          </GraphCard>
          <GraphCard
            title='Data availability over time'
            chips={[selectedSubIndicator.label]}
          >
            <div className='flex h-[360px] dark w-full'>
              {dataAvailabilityData.isLoading ? (
                <Spinner size='lg' className='my-20 m-auto' />
              ) : dataAvailabilityData.isError ? (
                <div className='px-4 container mx-auto'>
                  <ErrorState />
                </div>
              ) : dataAvailabilityData.data ? (
                (
                  dataAvailabilityData.data as DataAvailabilityDataType[]
                ).filter(
                  d =>
                    d.Country_code_ISO_3 === countryCode &&
                    d.Contract_value === selectedContractValue.value &&
                    d.Indicator ===
                      indicatorMetaData.subIndicators.find(
                        el => el.id === selectedSubIndicator.value,
                      )?.code &&
                    d.Product_market ===
                      (selectedMarket ? selectedMarket.name : undefined),
                ).length > 0 ? (
                  <SimpleLineChart
                    data={transformDataForGraph(
                      (
                        dataAvailabilityData.data as DataAvailabilityDataType[]
                      ).filter(
                        d =>
                          d.Country_code_ISO_3 === countryCode &&
                          d.Contract_value === selectedContractValue.value &&
                          d.Indicator ===
                            indicatorMetaData.subIndicators.find(
                              el => el.id === selectedSubIndicator.value,
                            )?.code &&
                          d.Product_market ===
                            (selectedMarket ? selectedMarket.name : undefined),
                      ),
                      'lineChart',
                      [
                        { chartConfigId: 'date', columnId: 'Year' },
                        {
                          chartConfigId: 'y',
                          columnId: 'Indicator_availability',
                        },
                      ],
                    )}
                    lineColor={indicatorMetaData.mainColor || '#fff'}
                    showDots
                    maxValue={indicatorMetaData.maxValue ?? 100}
                    animate
                    suffix={indicatorMetaData.suffix || ''}
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
                            {d.data.Year}
                          </ParagraphText>
                          <div className='flex gap-8 justify-between pt-4'>
                            <ParagraphText size='sm'>
                              Data availability
                            </ParagraphText>
                            <ParagraphText size='sm'>
                              {d.data.Indicator_availability ?? 'NA'}
                            </ParagraphText>
                          </div>
                        </div>
                      );
                    }}
                  />
                ) : (
                  <div className='h-full flex items-center justify-center w-full'>
                    <NoData />
                  </div>
                )
              ) : null}
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
}

export default Viz;
