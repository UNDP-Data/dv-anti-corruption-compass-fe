import { useState } from 'react';
import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import {
  DataType,
  PillarsMetaDataType,
  CountryTaxonomyDataType,
} from '@/Types';
import { ColorLegend } from '@/Components/ColorLegend';
import { ArcChart } from '@/Components/ArcChart';
import { ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

interface Props {
  data: DataType[];
  selectedSubPillar: string;
  selectedMainIndicator: string;
  countryTaxonomy: CountryTaxonomyDataType[];
  rotate: boolean;
  pillarsMetaData: PillarsMetaDataType[];
}

function GlobeComponent({
  data,
  selectedSubPillar,
  countryTaxonomy,
  rotate,
  pillarsMetaData,
  selectedMainIndicator,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const year = Math.max(
    ...(data.find(d => d.id === selectedMainIndicator)?.data.map(d => d.Year) ??
      []),
  );
  return (
    <>
      <div className='w-1/2 sticky top-[120px] h-[calc(100vh-120px)] flex flex-col py-24 pl-10 pr-30'>
        <div className='absolute left-1/2 top-0 z-10 transform -translate-x-1/2'>
          <ColorLegend
            colors={
              pillarsMetaData
                .map(d => d.subPillars)
                .flat()
                .find(d => d.id === selectedSubPillar)?.colors || []
            }
          />
        </div>
        <div className='w-full grow flex radialGradientMask'>
          {data.length !== 0 ? (
            <ThreeDGlobe
              showColorScale={false}
              polygonAltitude={0.005}
              highlightedAltitude={0.01}
              colors={
                pillarsMetaData
                  .map(d => d.subPillars)
                  .flat()
                  .find(d => d.id === selectedSubPillar)?.colors
              }
              selectedId={selectedId}
              onSeriesMouseClick={d => {
                setSelectedId(d.id);
              }}
              colorDomain={['LOW', 'MEDIUM', 'HIGH']}
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
                pillarsMetaData
                  .map(d => d.subPillars)
                  .flat()
                  .find(d => d.id === selectedSubPillar)?.color
              }
              globeMaterial={
                new THREE.MeshBasicMaterial({
                  color: 0xfafafa,
                })
              }
              fogSettings={{
                color:
                  pillarsMetaData
                    .map(d => d.subPillars)
                    .flat()
                    .find(d => d.id === selectedSubPillar)?.color || '#fff',
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
                data
                  .find(d => d.id === selectedMainIndicator)
                  ?.data.filter(
                    d => d.Indicator === selectedSubPillar && d.Year === year,
                  ),
                'threeDGlobe',
                [
                  { chartConfigId: 'id', columnId: 'ISO3_Code' },
                  { chartConfigId: 'x', columnId: 'Indicator_value' },
                ],
              )}
            />
          ) : null}
        </div>
      </div>
      {selectedId && data.length !== 0 && (
        <div className='fixed bottom-8 right-20 z-15 bg-[#fff] p-6 lg:w-[300px] sm:w-[360px] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] z-999'>
          <div
            style={{
              cursor: 'pointer',
              zIndex: 10,
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
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryTaxonomy.find(d => d['Alpha-3 code'] === selectedId)?.['Alpha-2 code']}.svg`}
            />
            <ParagraphText
              className='text-[var(--color-text-black)]'
              alignment='center'
              weight='semibold'
              size='xl'
            >
              {
                countryTaxonomy.find(
                  el =>
                    el['Alpha-3 code'] ===
                    data
                      .find(d => d.id === selectedMainIndicator)
                      ?.data.find(
                        d =>
                          d.Indicator === selectedSubPillar &&
                          d.Year === year &&
                          d.ISO3_Code === selectedId,
                      )?.ISO3_Code,
                )?.['Country or Area']
              }
            </ParagraphText>
            <Spacer size='2xl' />
            <div className='w-full mb-4 flex items-center text-primary-gray-500 justify-center'>
              <ArcChart
                data={
                  pillarsMetaData
                    .find(d => d.id === selectedMainIndicator)
                    ?.subPillars.map(
                      el =>
                        data
                          .find(d => d.id === selectedMainIndicator)
                          ?.data.find(
                            d =>
                              d.Year === year &&
                              d.ISO3_Code === selectedId &&
                              d.Indicator === el.id,
                          )?.Indicator_value_numeric || 0,
                    ) || []
                }
                colors={
                  pillarsMetaData
                    .find(d => d.id === selectedMainIndicator)
                    ?.subPillars.map(d => d.color) || []
                }
                subPillars={
                  pillarsMetaData
                    .map(d => d.subPillars)
                    .flat()
                    .map(d => d.value) || []
                }
              />
            </div>
            <Link to='/countries/$isoCode' params={{ isoCode: selectedId }}>
              <Button variant='primary'>View more →</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobeComponent;
