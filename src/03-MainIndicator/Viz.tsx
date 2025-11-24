import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import * as THREE from 'three';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useEffect, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import { MethodologySection } from './Components/MethodologySection';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { DROPDOWN_CLASSNAMES } from '@/Constants';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';
import { GraphCard } from '@/Components/GraphCard';
import { NoData } from '@/Components/NoData';
import DataTableSimple from '@/Components/DataTable/SecondaryTable';
import { quantile } from '@/Utils/getQuantile';
import EnterpriseSurveyMethodology from '@/Components/MethodologyBlocks/EnterpriseSurveyMethodology';
import PublicProcurementMethodology from '@/Components/MethodologyBlocks/PublicProcurementMethodology';

interface Props {
  indicatorMetaData: IndicatorsMetaDataType;
  countriesList: CountriesDataType[];
  data: DataType[];
}

function Viz({ data, countriesList, indicatorMetaData }: Props) {
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
    <div className='container mx-auto'>
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
            className='poppins-regular border-0! rounded-[100px]! px-2!'
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
            defaultValue={{
              value: Math.max(...(data as DataType[]).map(d => d.year)),
              label: Math.max(...(data as DataType[]).map(d => d.year)),
            }}
            value={
              selectedYear
                ? { value: selectedYear, label: selectedYear }
                : undefined
            }
            options={yearList.map(d => ({
              value: d,
              label: d,
            }))}
            size='base'
            variant='normal'
            className='poppins-regular border-0! rounded-[100px]! px-2!'
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
                d.year === selectedYear &&
                d.id === selectedSubIndicator.value &&
                d.contractValue === null &&
                d.numericValue !== null,
            ).length > 0 ? (
              <>
                <ParagraphText size='sm'>
                  {
                    indicatorMetaData.subIndicators.find(
                      el => el.id === selectedSubIndicator.value,
                    )?.description
                  }
                </ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {
                    [
                      ...new Set(
                        data
                          .filter(
                            d =>
                              d.year === selectedYear &&
                              d.id === selectedSubIndicator.value &&
                              d.numericValue !== null,
                          )
                          .map(d => d.countryCode),
                      ),
                    ].length
                  }
                </ParagraphText>
                <Spacer size='xl' />
                <ParagraphText leading='none'>
                  countries with {selectedSubIndicator.label.toLowerCase()} data
                </ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {quantile(
                    data
                      .filter(
                        d =>
                          d.year === selectedYear &&
                          d.id === selectedSubIndicator.value &&
                          d.contractValue === null &&
                          d.numericValue !== null,
                      )
                      .map(d => d.numericValue),
                    0.25,
                  ).toFixed(2)}
                </ParagraphText>
                <Spacer size='xl' />
                <ParagraphText leading='none'>25 percentile</ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {quantile(
                    data
                      .filter(
                        d =>
                          d.year === selectedYear &&
                          d.id === selectedSubIndicator.value &&
                          d.contractValue === null &&
                          d.numericValue !== null,
                      )
                      .map(d => d.numericValue),
                    0.5,
                  ).toFixed(2)}
                </ParagraphText>
                <Spacer size='xl' />
                <ParagraphText leading='none'>Median</ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {quantile(
                    data
                      .filter(
                        d =>
                          d.year === selectedYear &&
                          d.id === selectedSubIndicator.value &&
                          d.contractValue === null &&
                          d.numericValue !== null,
                      )
                      .map(d => d.numericValue),
                    0.75,
                  ).toFixed(2)}
                </ParagraphText>
                <Spacer size='xl' />
                <ParagraphText leading='none'>75 percentile</ParagraphText>
                <Spacer size='6xl' />
              </>
            ) : (
              <NoData />
            )}
          </GraphCard>
          <GraphCard
            title='Global Overview'
            chips={[selectedSubIndicator.label, selectedYear]}
          >
            {data.filter(
              d =>
                d.year === selectedYear &&
                d.id === selectedSubIndicator.value &&
                d.contractValue === null &&
                d.numericValue !== null,
            ).length > 0 ? (
              <>
                <div className='flex flex-col gap-4 grow radialGradientMask'>
                  <ThreeDGlobe
                    showColorScale={false}
                    polygonAltitude={0.005}
                    highlightedAltitude={0.01}
                    colors={indicatorMetaData.subIndicators
                      .find(el => el.id === selectedSubIndicator.value)
                      ?.colors.split(',')}
                    colorDomain={['LOW', 'MEDIUM', 'HIGH']}
                    scale={1.65}
                    footNote=''
                    enableZoom={false}
                    atmosphereColor={
                      indicatorMetaData.subIndicators.find(
                        el => el.id === selectedSubIndicator.value,
                      )?.color
                    }
                    globeMaterial={
                      new THREE.MeshBasicMaterial({
                        color: 0xfafafa,
                      })
                    }
                    fogSettings={{
                      color:
                        indicatorMetaData.subIndicators.find(
                          el => el.id === selectedSubIndicator.value,
                        )?.color || '',
                      near: 300,
                      far: 450,
                    }}
                    atmosphereAltitude={0.1}
                    globeCurvatureResolution={2}
                    resetSelectionOnDoubleClick={false}
                    autoRotate={1}
                    data={transformDataForGraph(
                      data.filter(
                        d =>
                          d.year === selectedYear &&
                          d.id === selectedSubIndicator.value,
                      ),
                      'threeDGlobe',
                      [
                        { chartConfigId: 'id', columnId: 'countryCode' },
                        {
                          chartConfigId: 'x',
                          columnId: 'numericValue',
                        },
                      ],
                    )}
                  />
                </div>
                <ParagraphText size='xs' className='opacity-50 poppins-light '>
                  The designations employed and the presentation of material on
                  this map do not imply the expression of any opinion whatsoever
                  on the part of the Secretariat of the United Nations or UNDP
                  concerning the legal status of any country, territory, city or
                  area or its authorities, or concerning the delimitation of its
                  frontiers or boundaries.
                </ParagraphText>
              </>
            ) : (
              <NoData />
            )}
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Country-Level Overview'
            chips={[selectedSubIndicator.label, selectedYear]}
            className='basis-full'
          >
            <Spacer size='xl' />
            <div className='flex dark'>
              {data.filter(
                d =>
                  d.year === selectedYear &&
                  d.id === selectedSubIndicator.value &&
                  d.numericValue !== null,
              ).length > 0 ? (
                <DataTableSimple
                  data={data.filter(
                    d =>
                      d.year === selectedYear &&
                      d.id === selectedSubIndicator.value &&
                      d.contractValue === null &&
                      d.numericValue !== null,
                  )}
                  colors={
                    indicatorMetaData.subIndicators
                      .find(el => el.id === selectedSubIndicator.value)
                      ?.colors.split(',') || []
                  }
                  countriesList={countriesList}
                />
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
        </div>
        <Button variant='secondary' className='w-fit flex items-center gap-2'>
          Download Public Procurement Data{' '}
          <ArrowDownToLine size={16} strokeWidth={3} />
        </Button>
      </div>
      {indicatorMetaData.mainIndicatorId === 1 ||
      indicatorMetaData.mainIndicatorId === 2 ? (
        <>
          <Spacer size='6xl' />
          <MethodologySection
            description={
              indicatorMetaData.mainIndicatorId === 1 ? (
                <PublicProcurementMethodology />
              ) : (
                <EnterpriseSurveyMethodology />
              )
            }
          />
        </>
      ) : null}
    </div>
  );
}

export default Viz;
