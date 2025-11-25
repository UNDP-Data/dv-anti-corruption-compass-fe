import { useState } from 'react';
import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { ArcChart } from '@/Components/ArcChart';
import { ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';
import { BarChartList } from '@/Components/BarChartList';

interface Props {
  globeData: {
    countryCode: string;
    indicatorId: string;
    year: number;
  }[];
  data: DataType[];
  selectedSubIndicator: string;
  countriesList: CountriesDataType[];
  rotate: boolean;
  selectedIndicator: IndicatorsMetaDataType;
  indicatorsMetaData: IndicatorsMetaDataType[];
}

function GlobeComponent({
  globeData,
  data,
  selectedSubIndicator,
  countriesList,
  rotate,
  selectedIndicator,
  indicatorsMetaData,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  return (
    <>
      <div className='w-1/2 sticky top-[120px] h-[calc(100vh-120px)] flex flex-col py-24 pl-10 pr-30'>
        <div className='w-full grow flex radialGradientMask'>
          {data.length !== 0 ? (
            <ThreeDGlobe
              showColorScale={false}
              polygonAltitude={0.005}
              highlightedAltitude={0.01}
              colors={[
                indicatorsMetaData
                  .map(d => d.subIndicators)
                  .flat()
                  .find(d => d.id === selectedSubIndicator)
                  ?.colors.split(',')[0] as string,
              ]}
              selectedId={selectedId}
              onSeriesMouseClick={d => {
                setSelectedId(d.id);
                setSelectedYear(d.data.year);
              }}
              colorDomain={['Yes']}
              scale={
                (window.innerWidth / 2 - 160) / (window.innerHeight - 200) >
                0.95
                  ? 1.5
                  : (window.innerWidth / 2 - 160) / (window.innerHeight - 200) >
                      0.9
                    ? 1.75
                    : (window.innerWidth / 2 - 160) /
                          (window.innerHeight - 200) >
                        0.8
                      ? 2
                      : (window.innerWidth / 2 - 160) /
                            (window.innerHeight - 200) >
                          0.7
                        ? 2.5
                        : 3
              }
              footNote=''
              enableZoom={false}
              atmosphereColor={
                indicatorsMetaData
                  .map(d => d.subIndicators)
                  .flat()
                  .find(d => d.id === selectedSubIndicator)?.color
              }
              globeMaterial={
                new THREE.MeshBasicMaterial({
                  color: 0xfafafa,
                })
              }
              fogSettings={{
                color:
                  indicatorsMetaData
                    .map(d => d.subIndicators)
                    .flat()
                    .find(d => d.id === selectedSubIndicator)?.color || '#fff',
                near:
                  (window.innerWidth / 2 - 160) / (window.innerHeight - 200) >
                  0.9
                    ? 150
                    : (window.innerWidth / 2 - 160) /
                          (window.innerHeight - 200) >
                        0.8
                      ? 200
                      : (window.innerWidth / 2 - 160) /
                            (window.innerHeight - 200) >
                          0.7
                        ? 250
                        : 300,
                far:
                  (window.innerWidth / 2 - 160) / (window.innerHeight - 200) >
                  0.9
                    ? 300
                    : (window.innerWidth / 2 - 160) /
                          (window.innerHeight - 200) >
                        0.8
                      ? 350
                      : (window.innerWidth / 2 - 160) /
                            (window.innerHeight - 200) >
                          0.7
                        ? 400
                        : 450,
              }}
              atmosphereAltitude={0.1}
              globeCurvatureResolution={2}
              resetSelectionOnDoubleClick={false}
              autoRotate={rotate ? 1 : false}
              data={transformDataForGraph(
                globeData
                  .filter(d => d.indicatorId === selectedSubIndicator)
                  .map(d => ({
                    countryCode: d.countryCode,
                    x: 'Yes',
                    year: d.year,
                  })),
                'threeDGlobe',
                [
                  { chartConfigId: 'id', columnId: 'countryCode' },
                  { chartConfigId: 'x', columnId: 'x' },
                ],
              )}
            />
          ) : null}
        </div>
      </div>
      {selectedId && data.length !== 0 && (
        <div className='fixed bottom-8 right-20 bg-[#fff] p-6 lg:w-[300px] sm:w-[360px] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] z-[999]'>
          <div
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
            }}
            onClick={() => {
              setSelectedId(undefined);
            }}
          >
            <X color='#2D4858' size={32} strokeWidth={1} />
          </div>
          <div className='w-full flex flex-col items-center'>
            <img
              alt='Country flag'
              className='w-9 mb-3'
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countriesList.find(d => d['Alpha-3 code'] === selectedId)?.['Alpha-2 code']}.svg`}
            />
            <ParagraphText
              className='text-[var(--color-text-black)]'
              alignment='center'
              weight='semibold'
              size='xl'
            >
              {
                countriesList.find(el => el['Alpha-3 code'] === selectedId)?.[
                  'Country or Area (official name)'
                ]
              }
            </ParagraphText>
            <Spacer size='base' />
            <ParagraphText
              className='text-[var(--color-text-black)]'
              alignment='center'
              weight='regular'
              size='sm'
            >
              {selectedYear}
            </ParagraphText>
            <Spacer size='2xl' />
            {(indicatorsMetaData.find(
              d =>
                d.mainIndicatorId ===
                parseInt(selectedSubIndicator.split('_')[0]),
            )?.subIndicators.length || 0) < 6 ? (
              <div className='w-full flex items-center text-primary-gray-500 justify-center'>
                <ArcChart
                  data={data
                    .filter(
                      d =>
                        d.year === selectedYear &&
                        d.countryCode === selectedId &&
                        `${d.mainIndicatorId}` ===
                          selectedSubIndicator.split('_')[0] &&
                        d.contractValue === null,
                    )
                    .map(d => d.numericValue)}
                  colors={
                    indicatorsMetaData
                      .find(
                        d =>
                          `${d.mainIndicatorId}` ===
                          selectedSubIndicator.split('_')[0],
                      )
                      ?.subIndicators.map(d => d.color) || []
                  }
                  subPillars={
                    indicatorsMetaData
                      .map(d => d.subIndicators)
                      .flat()
                      .map(d => d.name) || []
                  }
                />
              </div>
            ) : (
              <BarChartList
                data={data
                  .filter(
                    d =>
                      d.year === selectedYear &&
                      d.countryCode === selectedId &&
                      `${d.mainIndicatorId}` ===
                        selectedSubIndicator.split('_')[0] &&
                      d.contractValue === null,
                  )
                  .map(d => ({
                    id:
                      indicatorsMetaData
                        .find(el => el.mainIndicatorId === d.mainIndicatorId)
                        ?.subIndicators.find(el => el.id === d.id)?.name || '',
                    value: d.numericValue || 0,
                  }))}
                suffix={selectedSubIndicator.split('_')[0] === '1' ? '' : '%'}
                maxValue={selectedSubIndicator.split('_')[0] === '1' ? 1 : 100}
                color={
                  indicatorsMetaData.find(
                    d =>
                      `${d.mainIndicatorId}` ===
                      selectedSubIndicator.split('_')[0],
                  )?.mainColor || '#fff'
                }
                textClassName='text-[var(--color-text-black)]'
                barBgColor='#d6d6d6'
                isCardBgWhite
              />
            )}
            <Spacer size='2xl' />
            <Link
              to='/countries/$isoCode/{-$indicator}'
              params={{
                isoCode: selectedId,
                indicator: selectedIndicator.name
                  .replaceAll(' ', '-')
                  .toLowerCase(),
              }}
            >
              <Button variant='primary'>View more →</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobeComponent;
