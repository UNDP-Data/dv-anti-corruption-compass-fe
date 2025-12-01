import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import * as THREE from 'three';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState, useEffectEvent, RefObject } from 'react';

import { IndicatorsMetaDataType } from '@/Types';
import { ScrollToObj } from '@/Utils/ScrollToObj';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

interface Props {
  data: { id: string; x: string }[];
  pillarVisualizationRef: RefObject<HTMLDivElement | null>;
  countryLevelInsightsRef: RefObject<HTMLDivElement | null>;
  indicatorsMetaData: IndicatorsMetaDataType[];
  globeControlsRef: RefObject<(HTMLDivElement | null)[]>;
}

const Introduction = (props: Props) => {
  const {
    data,
    pillarVisualizationRef,
    countryLevelInsightsRef,
    indicatorsMetaData,
    globeControlsRef,
  } = props;
  const [globeYOffSet, setGlobeYOffSet] = useState(0);
  const globeDiv = useRef<HTMLDivElement>(null);
  const setOffset = useEffectEvent(() => {
    setGlobeYOffSet(
      (100 * (globeDiv.current?.getBoundingClientRect()?.height || 0)) / 228,
    );
  });
  useEffect(() => {
    if (globeDiv.current) {
      setOffset();
    }
  }, []);
  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-120px)]'>
        <div className='flex flex-col gap-8 justify-center items-center container m-auto px-4'>
          <HeadingText type='h1'>
            Is your nation winning the fight against corruption?
          </HeadingText>
          <ParagraphText alignment='center' size='lg'>
            Explore comprehensive anti-corruption insights using the world's
            most complete database of global corruption measurement. From
            actionable primary indicators on public procurement integrity and
            business experiences with bribery, to curated datasets from trusted
            international sources, plus country-specific legal frameworks and
            institutional strategies - discover, compare, and drive
            evidence-based reforms across all dimensions of anti-corruption
            efforts.
          </ParagraphText>
          <div className='flex gap-x-10 gap-y-4 flex-wrap'>
            {indicatorsMetaData.map((d, i) => (
              <Button
                key={i}
                variant='primary'
                onClick={() => {
                  ScrollToObj(globeControlsRef.current[i]);
                }}
              >
                {d.name} →
              </Button>
            ))}
            <Button
              variant='primary'
              onClick={() => {
                ScrollToObj(countryLevelInsightsRef.current);
              }}
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
              highlightedAltitude={0.005}
              globeOffset={[0, globeYOffSet]}
              polygonAltitude={0.005}
              colors={['#A5B3C5', '#4A7591']}
              colorDomain={['No', 'Yes']}
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
