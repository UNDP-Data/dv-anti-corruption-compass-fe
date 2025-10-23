import { Spacer } from '@undp/design-system-react/Spacer';
import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { useEffect, useState } from 'react';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';
import { transformDataForGraph } from '@undp/data-viz/transformData';
import { ArrowDownToLine } from 'lucide-react';

import { MethodologySection } from './Components/MethodologySection';

import { GraphCard } from '@/Components/GraphCard';
import { DataType, SubPillarsMetaDataType } from '@/Types';
import { NoData } from '@/Components/NoData';
import { ParagraphText } from '@/Components/Typography';
import DataTable from '@/Components/DataTable';
import { ProjectsSection } from '@/Components/ProjectsSection';
import { getPillarData } from '@/Utils/getData';
import { ColorLegend } from '@/Components/ColorLegend';
import { Button } from '@/Components/Button';
import { BarChartTable } from '@/Components/BarChartTable';

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
                <Spacer size='xl' />
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
                <Spacer size='xl' />
                <ParagraphText leading='none'>minimum value</ParagraphText>
                <Spacer size='6xl' />
                <ParagraphText
                  weight='light'
                  leading='none'
                  className='text-[56px]'
                >
                  {Math.max(...new Set(data.map(d => d.value))).toFixed(2)}
                </ParagraphText>
                <Spacer size='xl' />
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
              <>
                <div className='flex flex-col gap-4 grow radialGradientMask'>
                  <ThreeDGlobe
                    showColorScale={false}
                    polygonAltitude={0.005}
                    highlightedAltitude={0.01}
                    colors={pillarMetaData.colors}
                    colorDomain={['Low', 'Medium', 'High']}
                    scale={1.65}
                    footNote=''
                    enableZoom={false}
                    atmosphereColor={pillarMetaData.color}
                    globeMaterial={
                      new THREE.MeshBasicMaterial({
                        color: 0xfafafa,
                      })
                    }
                    fogSettings={{
                      color: pillarMetaData.color,
                      near: 300,
                      far: 450,
                    }}
                    atmosphereAltitude={0.1}
                    globeCurvatureResolution={2}
                    resetSelectionOnDoubleClick={false}
                    autoRotate={1}
                    data={data}
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
            chips={[pillarMetaData.value, year]}
            className='basis-full'
          >
            <Spacer size='xl' />
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
                  <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px] poppins-regular'>
                    <ColorLegend
                      size='sm'
                      showTitle={false}
                      colors={pillarMetaData.colors}
                      keyValues={['< 33', '33 - 66', '> 66']}
                    />
                    <ChoroplethMap
                      data={transformDataForGraph(data, 'choroplethMap', [
                        { chartConfigId: 'id', columnId: 'id' },
                        { chartConfigId: 'x', columnId: 'dataAvailability' },
                      ])}
                      colors={pillarMetaData.colors}
                      mapBorderColor='var(--color-text-black)'
                      zoomInteraction='noZoom'
                      centerPoint={[15, 15]}
                      scale={1.05}
                      colorDomain={[33, 66]}
                      showColorScale={false}
                      footNote={
                        <div>
                          <ParagraphText
                            size='xs'
                            className='opacity-50 poppins-light'
                          >
                            The designations employed and the presentation of
                            material on this map do not imply the expression of
                            any opinion whatsoever on the part of the
                            Secretariat of the United Nations or UNDP concerning
                            the legal status of any country, territory, city or
                            area or its authorities, or concerning the
                            delimitation of its frontiers or boundaries.
                          </ParagraphText>
                        </div>
                      }
                    />
                  </div>
                  <div className='basis-[calc(50%-0.5rem)] flex flex-col min-w-[320px]'>
                    <BarChartTable
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      data={data.map((d: any) => ({
                        region: d.country,
                        value: d.dataAvailability,
                      }))}
                      color={pillarMetaData.color}
                      maxValue={100}
                      suffix='%'
                    />
                  </div>
                </div>
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
            Lorem ipsum dolor sit amet consectetur. Sit luctus feugiat faucibus
            dui feugiat vitae sit enim venenatis. Ut posuere consectetur id nec.
            Scelerisque tellus mi ac id non donec tristique purus dictum. Vitae
            sit aenean nisi risus ut id massa. Neque egestas elementum fringilla
            fermentum in. Bibendum massa at hac lectus malesuada. Cras vulputate
            neque morbi nulla. Quis mauris urna dictum vulputate consectetur.
            Faucibus sit velit amet urna. Auctor pharetra fringilla pharetra est
            non egestas tempus vitae blandit. Egestas purus magna risus laoreet
            lobortis sagittis.
            <br />
            <br />
            Accumsan vitae blandit odio est Lorem ipsum dolor sit amet
            consectetur. Sit luctus feugiat faucibus dui feugiat vitae sit enim
            venenatis. Ut posuere consectetur id nec. Scelerisque tellus mi ac
            id non donec tristique purus dictum. Vitae sit aenean nisi risus ut
            id massa. Neque egestas elementum fringilla fermentum in. Bibendum
            massa at hac lectus malesuada. Cras vulputate neque morbi nulla.
            Quis mauris urna dictum vulputate consectetur. Faucibus sit velit
            amet urna. Auctor pharetra fringilla pharetra est non egestas tempus
            vitae blandit. Egestas purus magna risus laoreet lobortis sagittis.
            Accumsan vitae blandit odio est
          </ParagraphText>
        }
      />
    </>
  );
}

export default ProcurementViz;
