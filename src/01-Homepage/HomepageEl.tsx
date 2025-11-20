import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react';

import GlobeControls from './Components/GlobeControls';
import Navigation from './Components/Navigation';
import GlobeComponent from './Components/GlobeComponent';
import CountryLevelInsight from './Sections/CountryLevelInsight';
import Introduction from './Sections/Introduction';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { ErrorState } from '@/Components/ErrorState';

function HomepageEl({
  indicatorsMetaData,
  countriesList,
  data,
  countriesListLoading,
  countriesListError,
}: {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
  data: DataType[];
  countriesListLoading: boolean;
  countriesListError: boolean;
}) {
  const [inViewSlide, setInViewSlide] = useState<number>(0);
  const [selectedSubIndicator, setSelectedSubIndicator] = useState<string[]>(
    [...new Set(indicatorsMetaData.map(d => d.mainIndicatorId))].map(
      d =>
        indicatorsMetaData.find(el => el.mainIndicatorId === d)
          ?.subIndicators[0].id as string,
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
            countryLevelInsightsInView ? indicatorsMetaData.length : inViewSlide
          }
          globeControlsRef={globeControlsRef}
          countryLevelInsightsRef={countryLevelInsightsRef}
          indicatorsMetaData={indicatorsMetaData.filter(d => !d.comingSoon)}
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
          indicatorsMetaData={indicatorsMetaData.filter(d => !d.comingSoon)}
          globeControlsRef={globeControlsRef}
        />
      </motion.div>
      <motion.div
        ref={pillarVisualizationRef}
        className='flex z-5 relative top-[120px] pb-60'
        style={{
          opacity: pillarVisualizationOpacity,
        }}
      >
        <div className='w-1/2 px-10'>
          {indicatorsMetaData.map((d, i) => (
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
                heading={d.name}
                description={d.description}
                buttons={d.subIndicators.map(el => ({
                  label: el.name,
                  value: `${el.mainIndicatorId}_${el.subIndicatorId}`,
                  color: el.color,
                }))}
                onClick={el => {
                  setSelectedSubIndicator(prev =>
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
          selectedSubIndicator={selectedSubIndicator[inViewSlide]}
          countriesList={countriesList}
          rotate={inViewSlide < indicatorsMetaData.length ? true : false}
          indicatorsMetaData={indicatorsMetaData}
          selectedIndicator={indicatorsMetaData[inViewSlide]}
        />
      </motion.div>
      <div
        className='flex flex-col relative z-10'
        ref={countryLevelInsightsRef}
      >
        {countriesListLoading && <Spinner size='lg' className='my-20 m-auto' />}
        {countriesListError && (
          <div className='px-4 container mx-auto'>
            <ErrorState />
          </div>
        )}
        {!countriesListError && !countriesListLoading ? (
          <CountryLevelInsight
            data={data}
            countriesList={countriesList}
            indicatorsMetaData={indicatorsMetaData}
          />
        ) : null}
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
