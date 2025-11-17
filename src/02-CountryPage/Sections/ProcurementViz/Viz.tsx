import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { DonutChart } from '@undp/data-viz/DonutChart';
import { SimpleLineChart } from '@undp/data-viz/SimpleLineChart';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { useState } from 'react';

import SubNationalVIz from './SubNationalVIz';

import { DROPDOWN_CLASSNAMES } from '@/Constants';
import { GraphCard } from '@/Components/GraphCard';
import { DataType, IndicatorsMetaDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ParagraphText } from '@/Components/Typography';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { PolarBarChart } from '@/Components/PolarBarChart';
import { BarChartList } from '@/Components/BarChartList';

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
  maxValue: number;
  countryCode: string;
}

const CONTRACT_VALUE = [
  'No contract type selected',
  'All',
  'High',
  'High + Medium',
];

function Viz({
  data,
  indicatorMetaData,
  marketList,
  maxValue,
  regionList,
  countryCode,
}: Props) {
  const yearList = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
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
  const [selectedMarket, setSelectedMarket] =
    useState<null | MarketListDataType>(null);
  const [selectedContractValue, setSelectedContractValue] = useState({
    value: 'null',
    label: 'No contract type selected',
  });
  return (
    <div className='w-full'>
      <Spacer size='4xl' />
      <PolarBarChart
        innerRadiusRatio={0.6}
        indicatorMetaData={indicatorMetaData}
        data={data.filter(
          d =>
            d.year === yearList[0] &&
            d.contractValue === (selectedContractValue.value || '') &&
            d.productMarketId === null,
        )}
        maxValue={maxValue}
      />
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
              setSelectedMarket({
                name: d.label,
                productMarketId: d.value,
              });
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
              value:
                d === 'No contract type selected' ? 'null' : d.toUpperCase(),
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
                d.contractValue === (selectedContractValue.value || ''),
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
                              d.contractValue ===
                                (selectedContractValue.value || ''),
                          )?.numericValue || 0,
                      },
                      {
                        label: 'Rest',
                        size:
                          maxValue -
                          (data.find(
                            d =>
                              d.id === selectedSubIndicator.value &&
                              d.year === selectedYear &&
                              d.productMarketId ===
                                (selectedMarket
                                  ? selectedMarket.productMarketId
                                  : null) &&
                              d.contractValue ===
                                (selectedContractValue.value || ''),
                          )?.numericValue || 0),
                      },
                    ]}
                    strokeWidth={14}
                    showColorScale={false}
                    colors={[indicatorMetaData.mainColor || '#fff', '#fff']}
                    mainText={
                      data
                        .find(
                          d =>
                            d.id === selectedSubIndicator.value &&
                            d.year === selectedYear &&
                            d.productMarketId ===
                              (selectedMarket
                                ? selectedMarket.productMarketId
                                : null) &&
                            d.contractValue ===
                              (selectedContractValue.value || ''),
                        )
                        ?.numericValue?.toFixed(2) ?? 'NA'
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
                  d.contractValue === (selectedContractValue.value || '') &&
                  d.id === selectedSubIndicator.value &&
                  d.productMarketId !== null,
              ).length > 0 ? (
                <BarChartList
                  data={data
                    .filter(
                      d =>
                        d.year === selectedYear &&
                        d.contractValue ===
                          (selectedContractValue.value || '') &&
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
            />
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Comparison to global average'
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
                        d.id === selectedSubIndicator.value &&
                        d.contractValue ===
                          (selectedContractValue.value || '') &&
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
                <div className='h-full flex items-center justify-center w-full'>
                  <NoData />
                </div>
              )}
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
}

export default Viz;
