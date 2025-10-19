import { P } from '@undp/design-system-react';
import { H2 } from '@undp/design-system-react/Typography';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import * as THREE from 'three';
import { ArrowDown } from 'lucide-react';
import { Button } from '@undp/design-system-react/Button';
import { useEffect, useRef, useState } from 'react';

import { DataType } from '@/Types';
import { ScrollToObj } from '@/Utils/ScrollToObj';

interface Props {
  data: DataType[];
  pillarVisualizationRef: React.RefObject<HTMLDivElement | null>;
}

const Introduction = (props: Props) => {
  const { data, pillarVisualizationRef } = props;
  const [globeYOffSet, setGlobeYOffSet] = useState(0);
  const globeDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (globeDiv.current) {
      setGlobeYOffSet(
        (100 * (globeDiv.current?.getBoundingClientRect()?.height || 0)) / 228,
      );
    }
  }, []);
  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-120px)]'>
        <div className='flex flex-col gap-8 justify-center items-center max-w-[1272px] m-auto px-4'>
          <H2
            className='poppins-bold text-center !text-[44px]'
            marginBottom='none'
          >
            Is your nation winning the fight against corruption?
          </H2>
          <P
            className='text-center poppins-regular !leading-[140%]'
            size='lg'
            marginBottom='none'
          >
            Explore comprehensive anti-corruption insights using the world's
            most complete database of global corruption measurement. From
            actionable primary indicators on public procurement integrity and
            business experiences with bribery, to curated datasets from trusted
            international sources, plus country-specific legal frameworks and
            institutional strategies - discover, compare, and drive
            evidence-based reforms across all dimensions of anti-corruption
            efforts.
          </P>
          <div className='flex gap-x-10 gap-y-4 flex-wrap'>
            <Button
              variant='primary-without-icon'
              className='normal-case rounded-full bg-[#fff] px-7 py-3 text-[#124E6F] hover:bg-[#DEF7FF] poppins-semibold !text-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
            >
              Take a Tour →
            </Button>

            <Button
              variant='primary-without-icon'
              className='normal-case rounded-full bg-[#4B6E91] px-7 py-3 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
            >
              View Country Level Insights →
            </Button>
          </div>
        </div>
        <div
          className='m-auto w-full grow flex radialGradientMask'
          ref={globeDiv}
        >
          {data.length !== 0 ? (
            <ThreeDGlobe
              showColorScale={false}
              highlightedAltitude={0.01}
              globeOffset={[0, globeYOffSet]}
              polygonAltitude={0.005}
              colors={['#A5B3C5', '#7B9EB4', '#4A7591']}
              colorDomain={['Low', 'Medium', 'High']}
              scale={0.72}
              footNote=''
              globeMaterial={
                new THREE.MeshBasicMaterial({
                  color: 0xfafafa,
                })
              }
              atmosphereColor='#117df8'
              atmosphereAltitude={0.15}
              globeCurvatureResolution={2}
              enableZoom={false}
              autoRotate={1}
              data={data}
            />
          ) : null}
        </div>
      </div>
      <button
        className='cursor-pointer border-0 fixed bottom-6 left-[50%] translate-x-[-50%] rounded-full bg-primary-white w-[40px] h-[40px] flex justify-center items-center'
        onClick={() => {
          ScrollToObj(pillarVisualizationRef.current);
        }}
      >
        <ArrowDown color='#437390' size={18} strokeWidth={3} />
      </button>
    </>
  );
};

export default Introduction;
