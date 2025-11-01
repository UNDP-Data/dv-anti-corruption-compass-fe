import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Spacer } from '@undp/design-system-react/Spacer';

import GlobeControls from './Components/GlobeControls';
import Navigation from './Components/Navigation';
import GlobeComponent from './Components/GlobeComponent';
import CountryLevelInsight from './Sections/CountryLevelInsight';
import Introduction from './Sections/Introduction';

import {
  PillarsMetaDataType,
  CountryTaxonomyDataType,
  DataType,
} from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { ProjectsSection } from '@/Components/ProjectsSection';

function HomepageEl({
  pillarsMetaData,
  countryTaxonomy,
  data,
}: {
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
  data: DataType[];
}) {
  const [inViewSlide, setInViewSlide] = useState<number>(0);
  const [selectedSubPillar, setSelectedSubPillar] = useState<string[]>(
    [...new Set(pillarsMetaData.map(d => d.id))].map(
      d => pillarsMetaData.find(el => el.id === d)?.subPillars[0].id || '',
    ),
  );
  const [showNavigation, setShowNavigation] = useState(false);

  const globeControlsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pillarVisualizationRef = useRef<HTMLDivElement>(null);
  const countryLevelInsightsRef = useRef<HTMLDivElement>(null);

  const countryLevelInsightsInView = useInView(countryLevelInsightsRef, {
    once: false,
    amount: 0,
    margin: '0px 0px -25% 0px',
  });
  const scrollYProgressPillarVisualization = useScroll({
    target: pillarVisualizationRef,
    offset: ['start end', 'start center'],
  });
  const scrollYProgressCountryLevelInsights = useScroll({
    target: countryLevelInsightsRef,
    offset: ['start end', 'start center'],
  });

  const introductionOpacity = useTransform(
    scrollYProgressPillarVisualization.scrollYProgress,
    [0, 1],
    [1, 0],
  );
  const pillarVisualizationOpacity = useTransform(
    scrollYProgressCountryLevelInsights.scrollYProgress,
    [0, 1],
    [1, 0],
  );

  useEffect(() => {
    const unsubscribe = introductionOpacity.on('change', latest => {
      setShowNavigation(latest < 0.25);
    });

    return () => unsubscribe();
  }, [introductionOpacity]);

  return (
    <div className='relative'>
      {showNavigation && (
        <Navigation
          inViewSlide={
            countryLevelInsightsInView ? pillarsMetaData.length : inViewSlide
          }
          globeControlsRef={globeControlsRef}
          countryLevelInsightsRef={countryLevelInsightsRef}
          pillarsMetaData={pillarsMetaData}
        />
      )}
      <div
        className='w-screen h-screen fixed top-0'
        style={{
          background:
            'linear-gradient(141.12deg, #0F0F0F -2.91%, #2D4351 44.74%, #437390 95.34%, #93DBFF 119.46%)',
        }}
      />
      <motion.div
        style={{ opacity: introductionOpacity }}
        className='sticky top-[184px] h-[calc(100vh-120px)] flex flex-col'
      >
        <Introduction
          data={data}
          pillarVisualizationRef={pillarVisualizationRef}
          countryLevelInsightsRef={countryLevelInsightsRef}
        />
      </motion.div>
      <motion.div
        ref={pillarVisualizationRef}
        className='flex z-10 relative top-[120px] pb-60'
        style={{
          opacity: pillarVisualizationOpacity,
        }}
      >
        <div className='w-1/2 px-10'>
          {pillarsMetaData.map((d, i) => (
            <div
              ref={el => {
                globeControlsRef.current[i] = el;
              }}
              key={i}
            >
              <GlobeControls
                onViewChange={el => {
                  setInViewSlide(el);
                }}
                heading={d.value}
                description={d.description}
                buttons={d.subPillars.map(el => ({
                  label: el.value,
                  value: el.id,
                  color: el.color,
                }))}
                onClick={el => {
                  setSelectedSubPillar(prev =>
                    prev.map((v, idx) => (idx === i ? el : v)),
                  );
                }}
                index={i}
              />
            </div>
          ))}
        </div>
        <GlobeComponent
          data={data}
          selectedSubPillar={selectedSubPillar[inViewSlide]}
          countryTaxonomy={countryTaxonomy}
          rotate={inViewSlide < pillarsMetaData.length ? true : false}
          pillarsMetaData={pillarsMetaData}
          selectedMainIndicator={pillarsMetaData[inViewSlide]?.id || ''}
        />
      </motion.div>

      <div
        className='flex flex-col relative z-20'
        ref={countryLevelInsightsRef}
      >
        <CountryLevelInsight
          data={data}
          countryTaxonomy={countryTaxonomy}
          pillarsMetaData={pillarsMetaData}
        />
        <div className='w-full mt-20 px-20'>
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
            heading='Recommended projects'
          />
        </div>
        <div className='w-full my-20 px-20'>
          <HeadingText type='h2'>Partnerships</HeadingText>
          <Spacer size='xl' />
          <ParagraphText>
            We've curated comprehensive datasets from Transparency
            International, World Bank, UNODC, OECD, and other respected
            institutions. Compare corruption indices, governance indicators, and
            specialized measurements - all accessible with one click in one
            comprehensive dashboard.
          </ParagraphText>
        </div>
      </div>
    </div>
  );
}

export default HomepageEl;
