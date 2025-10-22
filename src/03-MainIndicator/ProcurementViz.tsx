import { Spacer } from '@undp/design-system-react/Spacer';
import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { useEffect, useState } from 'react';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { Colors } from '@undp/data-viz/Colors';
import { Badge } from '@undp/design-system-react/Badge';

import { MethodologySection } from './Components/MethodologySection';

import { GraphCard } from '@/Components/GraphCard';
import { DataType, SubPillarsMetaDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ParagraphText } from '@/Components/Typography';
import DataTable from '@/Components/DataTable';
import { ProjectsSection } from '@/Components/ProjectsSection';
import { getPillarData } from '@/Utils/getData';

interface Props {
  pillarMetaData: SubPillarsMetaDataType;
  year: number;
}

function ProcurementViz({ year, pillarMetaData }: Props) {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    getPillarData(pillarMetaData).then(d => {
      setData(d);
    });
  }, [pillarMetaData]);
  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard title='Overview' chips={[pillarMetaData.value, year]}>
            {data ? (
              <>
                <ParagraphText size='sm'>
                  Contact Modification dolor sit amet consectetur. Sit luctus
                  feugiat faucibus dui feugiat vitae sit enim venenatis. Ut
                  posuere consectetur id nec. Scelerisque tellus mi ac id non
                  donec tristique purus dictum. Vitae sit aenean nisi risus ut
                  id massa. Neque egestas elementum fringilla fermentum in.
                  <br />
                  <br />
                  Contact Modification dolor sit amet consectetur. Sit luctus
                  feugiat faucibus dui feugiat vitae sit enim venenatis. Ut
                  posuere consectetur id nec. Scelerisque tellus mi ac id non
                  donec tristique purus dictum. Vitae sit aenean nisi risus ut
                  id massa. Neque egestas elementum fringilla fermentum in.
                </ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {[...new Set(data.map(d => d.country))].length}
                </ParagraphText>
                <Spacer size='2xl' />
                <ParagraphText leading='none'>
                  countries with {pillarMetaData.value.toLowerCase()} data
                </ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {Math.min(...new Set(data.map(d => d.value))).toFixed(2)}
                </ParagraphText>
                <Spacer size='2xl' />
                <ParagraphText leading='none'>minimum value</ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {Math.max(...new Set(data.map(d => d.value))).toFixed(2)}
                </ParagraphText>
                <Spacer size='2xl' />
                <ParagraphText leading='none'>maximum value</ParagraphText>
                <Spacer size='6xl' />
              </>
            ) : (
              <NoData />
            )}
          </GraphCard>
          <GraphCard
            title='Global Overview'
            chips={[pillarMetaData.value, year]}
          >
            {data ? (
              <div className='flex flex-col gap-4 grow'>
                <ThreeDGlobe
                  showColorScale={false}
                  polygonAltitude={0.005}
                  highlightedAltitude={0.01}
                  colors={pillarMetaData.colors}
                  colorDomain={['Low', 'Medium', 'High']}
                  scale={1.5}
                  enableZoom={false}
                  atmosphereColor={pillarMetaData.color}
                  globeMaterial={
                    new THREE.MeshBasicMaterial({
                      color: 0xfafafa,
                    })
                  }
                  fogSettings={{
                    color: pillarMetaData.color,
                    near:
                      (window.innerWidth / 2 - 160) /
                        (window.innerHeight - 200) >
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
                      (window.innerWidth / 2 - 160) /
                        (window.innerHeight - 200) >
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
                  autoRotate={1}
                  data={data}
                />
              </div>
            ) : (
              <NoData />
            )}
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Country-Level Overview'
            chips={[pillarMetaData.value, year]}
            className='basis-full'
          >
            <div className='flex dark'>
              {data.length > 0 ? (
                <DataTable
                  data={data}
                  showFiltersAndPillars={false}
                  colors={pillarMetaData.colors}
                />
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <GraphCard
            title='Data Availability'
            chips={[pillarMetaData.value, year]}
            className='basis-full'
          >
            <div className='flex dark'>
              {data.length > 0 ? (
                <div className='flex gap-4'>
                  <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px]'>
                    <ChoroplethMap
                      data={transformDataForGraph(data, 'choroplethMap', [
                        { chartConfigId: 'id', columnId: 'id' },
                        { chartConfigId: 'x', columnId: 'dataAvailability' },
                      ])}
                      colors={Colors.light.sequentialColors.positiveColorsx05}
                      colorDomain={[20, 40, 60, 80]}
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
                        {data
                          .sort(
                            (a, b) => b.dataAvailability - a.dataAvailability,
                          )
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
                                  {d.country}
                                </div>
                                <div className='w-[60%] px-2 poppins-medium text-[14px] text-primary-white'>
                                  <div className='w-full rounded-full bg-primary-white h-2' />
                                  <div
                                    className='rounded-full h-2 mt-[-8px]'
                                    style={{
                                      width: `${d.dataAvailability}%`,
                                      backgroundColor: pillarMetaData.color,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className='w-[75px] poppins-medium px-2 text-[14px] text-primary-white text-right'>
                                <Badge
                                  rounded='full'
                                  className='bg-primary-white! text-primary-gray-700! poppins-bold p-1! text-[14px]! w-full! flex justify-center'
                                >
                                  {Math.round(d.dataAvailability)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NoData />
              )}
            </div>
          </GraphCard>
        </div>
        <Spacer size='6xl' />
        <ProjectsSection
          cards={[
            {
              img: 'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              title: 'Global Report on Public Procurement',
              date: 'July 2nd 2025',
            },
            {
              img: 'https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              title: 'Global Report',
              date: 'July 2nd 2025',
            },
          ]}
          heading='Case studies'
        />
        <Spacer size='6xl' />
        <MethodologySection
          description={
            <ParagraphText>
              Lorem ipsum dolor sit amet consectetur. Sit luctus feugiat
              faucibus dui feugiat vitae sit enim venenatis. Ut posuere
              consectetur id nec. Scelerisque tellus mi ac id non donec
              tristique purus dictum. Vitae sit aenean nisi risus ut id massa.
              Neque egestas elementum fringilla fermentum in. Bibendum massa at
              hac lectus malesuada. Cras vulputate neque morbi nulla. Quis
              mauris urna dictum vulputate consectetur. Faucibus sit velit amet
              urna. Auctor pharetra fringilla pharetra est non egestas tempus
              vitae blandit. Egestas purus magna risus laoreet lobortis
              sagittis.
              <br />
              <br />
              Accumsan vitae blandit odio est Lorem ipsum dolor sit amet
              consectetur. Sit luctus feugiat faucibus dui feugiat vitae sit
              enim venenatis. Ut posuere consectetur id nec. Scelerisque tellus
              mi ac id non donec tristique purus dictum. Vitae sit aenean nisi
              risus ut id massa. Neque egestas elementum fringilla fermentum in.
              Bibendum massa at hac lectus malesuada. Cras vulputate neque morbi
              nulla. Quis mauris urna dictum vulputate consectetur. Faucibus sit
              velit amet urna. Auctor pharetra fringilla pharetra est non
              egestas tempus vitae blandit. Egestas purus magna risus laoreet
              lobortis sagittis. Accumsan vitae blandit odio est
            </ParagraphText>
          }
        />
      </div>
    </>
  );
}

export default ProcurementViz;
