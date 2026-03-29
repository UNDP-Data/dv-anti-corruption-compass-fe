import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { ParagraphText } from '@/Components/Typography';

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
  inViewSlide: number;
  selectedId?: string;
  setSelectedId: (id: string) => void;
  setSelectedYear: (year: number) => void;
}

function GlobeComponent({
  globeData,
  data,
  selectedSubIndicator,
  rotate,
  indicatorsMetaData,
  selectedId,
  setSelectedId,
  setSelectedYear,
  countriesList,
}: Props) {
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
              tooltip={d => {
                return (
                  <div>
                    <ParagraphText
                      size='xs'
                      weight='bold'
                      className='text-black'
                    >
                      {
                        countriesList.find(c => c['Alpha-3 code'] === d.id)?.[
                          'Country or Area (official name)'
                        ]
                      }
                    </ParagraphText>
                  </div>
                );
              }}
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
    </>
  );
}

export default GlobeComponent;
