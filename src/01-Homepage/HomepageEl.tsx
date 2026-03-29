import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from '@tanstack/react-router';
import * as THREE from 'three';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { transformDataForGraph } from '@undp/data-viz/transformData';

import GlobeControls from './Components/GlobeControls';
import Navigation from './Components/Navigation';
import GlobeComponent from './Components/GlobeComponent';
import CountryLevelInsight from './Sections/CountryLevelInsight';
import Introduction from './Sections/Introduction';

import { getCountryDetailsFromISO3 } from '@undp-data/data-utils';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { ErrorState } from '@/Components/ErrorState';
import { ArcChart } from '@/Components/ArcChart';
import { BarChartList } from '@/Components/BarChartList';
import { Button } from '@/Components/Button';
import {
  logTimelinePhase,
  endTimeline,
  logResourceSummary,
} from '@/logging/loadTimeLogger';
import {
  HomepageCountriesYes,
  HomepageGlobeAvailability,
} from '@/Utils/homepageFactsCache';
import { getHomepageDefaultSubIndicatorId } from './homepagePreferredSubIndicators';
import { useIsMobileBreakpoint } from '@/Utils/useIsMobileBreakpoint';

const isDev =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

const getGlobeData = (data: DataType[]) => {
  const uniqueCountryCodes = [...new Set(data.map(d => d.countryCode))];
  const availabilityData = uniqueCountryCodes
    .map(countryCode => {
      const countryData = data.filter(
        d =>
          d.countryCode === countryCode &&
          d.numericValue !== null &&
          d.numericValue !== undefined,
      );
      const uniqueIndicatorIds = [
        ...new Set(
          countryData.map(d => `${d.mainIndicatorId}_${d.subIndicatorId}`),
        ),
      ].map(d => {
        const indicatorDataYears = countryData
          .filter(
            el =>
              `${el.mainIndicatorId}` === d.split('_')[0] &&
              `${el.subIndicatorId}` === d.split('_')[1],
          )
          .map(el => el.year);
        const latestYear = indicatorDataYears.sort((a, b) => b - a)[0];
        return { countryCode, indicatorId: d, year: latestYear };
      });
      return uniqueIndicatorIds;
    })
    .flat();
  return availabilityData;
};

function HomepageEl({
  indicatorsMetaData = [],
  countriesList = [],
  data = [],
  factsLoading = false,
  factsError = false,
  cachedCountriesYes = [],
  cachedGlobeAvailability = [],
  countriesListLoading = false,
  countriesListError = false,
}: {
  indicatorsMetaData?: IndicatorsMetaDataType[];
  countriesList?: CountriesDataType[];
  data?: DataType[];
  factsLoading?: boolean;
  factsError?: boolean;
  cachedCountriesYes?: HomepageCountriesYes;
  cachedGlobeAvailability?: HomepageGlobeAvailability;
  countriesListLoading?: boolean;
  countriesListError?: boolean;
}) {
  logTimelinePhase('HomepageEl render start');
  const safeCountriesList = Array.isArray(countriesList) ? countriesList : [];
  const safeIndicatorsMetaData = Array.isArray(indicatorsMetaData)
    ? indicatorsMetaData
    : [];
  const safeCachedCountriesYes = Array.isArray(cachedCountriesYes)
    ? cachedCountriesYes
    : [];
  const safeCachedGlobeAvailability = Array.isArray(cachedGlobeAvailability)
    ? cachedGlobeAvailability
    : [];
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  const [inViewSlide, setInViewSlide] = useState<number>(0);
  const [selectedSubIndicators, setSelectedSubIndicators] = useState<string[]>(
    [...new Set(safeIndicatorsMetaData.map(d => d.mainIndicatorId))].map(d => {
      const indicator = safeIndicatorsMetaData.find(el => el.mainIndicatorId === d);
      return indicator ? getHomepageDefaultSubIndicatorId(indicator) : '';
    }),
  );
  const safeSelectedSubIndicator = Array.isArray(selectedSubIndicators)
    ? selectedSubIndicators
    : [];
  const [showNavigation, setShowNavigation] = useState(false);
  const isMobile = useIsMobileBreakpoint();

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
    logTimelinePhase('HomepageEl mount & effects');
    const unsubscribe = introductionOpacity.on('change', latest => {
      setShowNavigation(latest < 0.25);
      if (latest > 0.5) {
        setSelectedId(undefined);
        setSelectedYear(undefined);
      }
    });

    return () => unsubscribe();
  }, [introductionOpacity]);

  useEffect(() => {
    const unsubscribe = pillarVisualizationOpacity.on('change', latest => {
      if (latest < 0.25) {
        setSelectedId(undefined);
        setSelectedYear(undefined);
      }
    });

    return () => unsubscribe();
  }, [pillarVisualizationOpacity]);

  const factsLoaded = data.length !== 0;
  const globeData = factsLoaded ? getGlobeData(data) : safeCachedGlobeAvailability;
  logTimelinePhase('Computed globeData for homepage');

  const activeSubIndicator =
    safeSelectedSubIndicator[inViewSlide] ||
    safeIndicatorsMetaData[inViewSlide]?.subIndicators?.[0]?.id ||
    safeIndicatorsMetaData[0]?.subIndicators?.[0]?.id;

  useEffect(() => {
    if (!isDev) return;
    const filtered = globeData.filter(d => d.indicatorId === activeSubIndicator);
    // eslint-disable-next-line no-console -- intentional dev-only diagnostics
    console.info('[ACC dev] HomepageEl slide/subIndicator', {
      inViewSlide,
      activeSubIndicator,
      factsLoaded,
      factsLoading,
      factsError,
      countriesListLoading,
      countriesListError,
      countriesListCount: safeCountriesList.length,
      globeDataTotal: globeData.length,
      globeDataForActive: filtered.length,
      sampleForActive: filtered.slice(0, 3),
    });
  }, [
    inViewSlide,
    activeSubIndicator,
    factsLoaded,
    factsLoading,
    factsError,
    countriesListLoading,
    countriesListError,
    safeCountriesList.length,
    globeData,
  ]);

  const updateYear = useEffectEvent(
    (inViewSlide: number, selectedId?: string) => {
      if (!selectedId) return;
      setSelectedYear(
        globeData.find(
          d =>
            d.indicatorId === safeSelectedSubIndicator[inViewSlide] &&
            d.countryCode === selectedId,
        )?.year,
      );
    },
  );

  useEffect(() => {
    updateYear(inViewSlide, selectedId);
  }, [inViewSlide, selectedId]);

  useEffect(() => {
    // Treat this as "homepage visible with main sections rendered"
    logTimelinePhase('HomepageEl main sections rendered');
    // After initial render, log the slowest loaded resources (JS chunks, images, etc.)
    logResourceSummary('Homepage', { minDurationMs: 50, limit: 30 });
    endTimeline('HomepageEl initial render complete');
    // We only want to log once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative'>
      {showNavigation && (
        <Navigation
          inViewSlide={
            countryLevelInsightsInView ? safeIndicatorsMetaData.length : inViewSlide
          }
          globeControlsRef={globeControlsRef}
          countryLevelInsightsRef={countryLevelInsightsRef}
          indicatorsMetaData={safeIndicatorsMetaData.filter(d => !d.comingSoon)}
        />
      )}
      <div
        className='w-screen h-screen fixed top-0'
        style={{
          background:
            'linear-gradient(141.12deg, #0F0F0F -2.91%, #2D4351 44.74%, #437390 95.34%, #93DBFF 119.46%)',
        }}
      />
      {isMobile ? (
        <div className='relative flex flex-col pt-8'>
          <Introduction
            data={
              safeCountriesList.length
                ? safeCountriesList.map(c => ({
                    id: c['Alpha-3 code'],
                    x: 'Yes' as const,
                  }))
                : factsLoaded
                  ? [...new Set(data.map(d => d.countryCode))].map(d => ({
                      id: d,
                      x: 'Yes' as const,
                    }))
                  : safeCachedCountriesYes
            }
            pillarVisualizationRef={pillarVisualizationRef}
            countryLevelInsightsRef={countryLevelInsightsRef}
            indicatorsMetaData={safeIndicatorsMetaData.filter(d => !d.comingSoon)}
            globeControlsRef={globeControlsRef}
          />
        </div>
      ) : (
        <motion.div
          style={{ opacity: introductionOpacity }}
          className='sticky top-[184px] h-[calc(100vh-120px)] flex flex-col'
        >
          <Introduction
            data={
              safeCountriesList.length
                ? safeCountriesList.map(c => ({
                    id: c['Alpha-3 code'],
                    x: 'Yes' as const,
                  }))
                : factsLoaded
                  ? [...new Set(data.map(d => d.countryCode))].map(d => ({
                      id: d,
                      x: 'Yes' as const,
                    }))
                  : safeCachedCountriesYes
            }
            pillarVisualizationRef={pillarVisualizationRef}
            countryLevelInsightsRef={countryLevelInsightsRef}
            indicatorsMetaData={safeIndicatorsMetaData.filter(d => !d.comingSoon)}
            globeControlsRef={globeControlsRef}
          />
        </motion.div>
      )}
      {isMobile ? (
        <div ref={pillarVisualizationRef} className='relative z-5 pb-12'>
          {safeIndicatorsMetaData.map((d, i) => {
            const subIndicatorId =
              safeSelectedSubIndicator[i] || d.subIndicators[0]?.id;
            const subIndicator = d.subIndicators.find(
              sub => sub.id === subIndicatorId,
            );
            return (
              <div
                ref={el => {
                  globeControlsRef.current[i] = el;
                }}
                key={i}
                className='mb-8'
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
                    setSelectedSubIndicators(prev =>
                      prev.map((v, idx) => (idx === i ? el : v)),
                    );
                  }}
                  index={i}
                />
                <div className='w-full h-[300px] overflow-hidden'>
                  {globeData.filter(gd => gd.indicatorId === subIndicatorId)
                    .length > 0 ? (
                    <ThreeDGlobe
                      showColorScale={false}
                      polygonAltitude={0.005}
                      highlightedAltitude={0.01}
                      colors={[
                        subIndicator?.colors?.split(',')[0] || '#4A7591',
                      ]}
                      colorDomain={['Yes']}
                      scale={0.8}
                      footNote=''
                      enableZoom={false}
                      atmosphereColor={subIndicator?.color || '#117df8'}
                      globeMaterial={
                        new THREE.MeshBasicMaterial({ color: 0xfafafa })
                      }
                      atmosphereAltitude={0.15}
                      globeCurvatureResolution={2}
                      resetSelectionOnDoubleClick={false}
                      autoRotate={1}
                      data={transformDataForGraph(
                        globeData
                          .filter(gd => gd.indicatorId === subIndicatorId)
                          .map(gd => ({
                            countryCode: gd.countryCode,
                            x: 'Yes',
                            year: gd.year,
                          })),
                        'threeDGlobe',
                        [
                          { chartConfigId: 'id', columnId: 'countryCode' },
                          { chartConfigId: 'x', columnId: 'x' },
                        ],
                      )}
                    />
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-full gap-3 opacity-60'>
                      <Spinner size='sm' />
                      <ParagraphText size='sm'>
                        Loading {d.name} data...
                      </ParagraphText>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          ref={pillarVisualizationRef}
          className='flex lg:flex-row z-5 relative top-[120px] pb-60'
          style={{
            opacity: pillarVisualizationOpacity,
          }}
        >
          <div className='lg:w-1/2 lg:px-10'>
            {safeIndicatorsMetaData.map((d, i) => (
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
                    setSelectedSubIndicators(prev =>
                      prev.map((v, idx) => (idx === i ? el : v)),
                    );
                  }}
                  index={i}
                />
              </div>
            ))}
          </div>
          {countriesListError ? (
            <div className='px-4 container mx-auto'>
              <ErrorState />
            </div>
          ) : activeSubIndicator ? (
            <GlobeComponent
              globeData={globeData}
              data={data}
              selectedSubIndicator={activeSubIndicator}
              countriesList={countriesListLoading ? [] : safeCountriesList}
              inViewSlide={inViewSlide}
              rotate={inViewSlide < safeIndicatorsMetaData.length ? true : false}
              indicatorsMetaData={safeIndicatorsMetaData}
              selectedIndicator={
                safeIndicatorsMetaData[inViewSlide] || safeIndicatorsMetaData[0]
              }
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              setSelectedYear={setSelectedYear}
              globeLoading={
                (!factsLoaded && !factsError) ||
                factsLoading ||
                countriesListLoading
              }
            />
          ) : null}
        </motion.div>
      )}
      <div
        className='flex flex-col relative z-10'
        ref={countryLevelInsightsRef}
      >
        {countriesListLoading && (
          <div className='flex flex-col items-center gap-3 my-20'>
            <Spinner size='lg' />
            <ParagraphText size='sm' className='opacity-60'>
              Loading country insights...
            </ParagraphText>
          </div>
        )}
        {countriesListError && (
          <div className='px-4 container mx-auto'>
            <ErrorState />
          </div>
        )}
        {!countriesListError && !countriesListLoading ? (
          <CountryLevelInsight
            countriesList={safeCountriesList}
            indicatorsMetaData={safeIndicatorsMetaData}
          />
        ) : null}
        <div className='w-full my-20 px-4 lg:px-20'>
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
      {selectedId &&
        factsLoaded &&
        createPortal(
          <div className='fixed bottom-0 left-0 right-0 lg:bottom-8 lg:right-20 lg:left-auto bg-[#fff] p-6 w-full lg:w-[360px] rounded-t-[16px] lg:rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] z-[999] max-h-[80vh] overflow-y-auto'>
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
              {(() => {
                const fromList = safeCountriesList.find(
                  el => el['Alpha-3 code'] === selectedId,
                );
                const fromUtils = getCountryDetailsFromISO3(selectedId);
                const alpha2 =
                  fromList?.['Alpha-2 code'] ?? fromUtils?.['Alpha-2 code'];
                const countryTitle =
                  fromList?.['Country or Area (official name)'] ??
                  fromUtils?.['Country or Area (official name)'] ??
                  selectedId;
                const flagUrl = alpha2
                  ? `http://purecatamphetamine.github.io/country-flag-icons/3x2/${alpha2}.svg`
                  : null;

                if (isDev) {
                  // eslint-disable-next-line no-console -- intentional dev-only diagnostics
                  console.info('[ACC dev] Country panel header data', {
                    selectedId,
                    countryTitle,
                    alpha2,
                    flagUrl,
                    countriesListCount: safeCountriesList.length,
                    hasFromUtils: Boolean(fromUtils),
                    pageProtocol:
                      typeof window !== 'undefined' ? window.location.protocol : '',
                  });
                }
                return (
                  <>
                    {alpha2 ? (
                      <img
                        alt=''
                        className='w-9 mb-3'
                        src={flagUrl as string}
                      />
                    ) : (
                      <div
                        className='w-9 h-6 mb-3 rounded bg-[#e8ecef] animate-pulse'
                        aria-hidden
                      />
                    )}
                    <ParagraphText
                      className='text-[var(--color-text-black)]'
                      alignment='center'
                      weight='semibold'
                      size='xl'
                    >
                      {countryTitle}
                    </ParagraphText>
                  </>
                );
              })()}
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
              {(safeIndicatorsMetaData.find(
                d =>
                  d.mainIndicatorId ===
                  parseInt(safeSelectedSubIndicator[inViewSlide].split('_')[0]),
              )?.subIndicators?.length || 0) < 6 ? (
                <div className='w-full flex items-center text-primary-gray-500 justify-center'>
                  <ArcChart
                    data={data
                      .filter(
                        d =>
                          d.year === selectedYear &&
                          d.countryCode === selectedId &&
                          `${d.mainIndicatorId}` ===
                            safeSelectedSubIndicator[inViewSlide].split('_')[0] &&
                          d.contractValue === 'ALL',
                      )
                      .map(d => ({ value: d.numericValue, id: d.id }))}
                    colors={
                      indicatorsMetaData
                        .find(
                          d =>
                            `${d.mainIndicatorId}` ===
                            safeSelectedSubIndicator[inViewSlide].split('_')[0],
                        )
                        ?.subIndicators.map(d => ({
                          id: d.id,
                          color: d.color,
                        })) || []
                    }
                    subPillars={
                      indicatorsMetaData
                        .map(d => d.subIndicators)
                        .flat()
                        .filter(
                          d =>
                            `${d.mainIndicatorId}` ===
                            safeSelectedSubIndicator[inViewSlide].split('_')[0],
                        )
                        .map(d => ({ name: d.name, id: d.id })) || []
                    }
                    suffix={
                      indicatorsMetaData.find(
                        d =>
                          `${d.mainIndicatorId}` ===
                          safeSelectedSubIndicator[inViewSlide].split('_')[0],
                      )?.suffix || ''
                    }
                    maxValue={
                      indicatorsMetaData.find(
                        d =>
                          `${d.mainIndicatorId}` ===
                          safeSelectedSubIndicator[inViewSlide].split('_')[0],
                      )?.maxValue ?? 100
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
                          safeSelectedSubIndicator[inViewSlide].split('_')[0] &&
                        d.contractValue === 'ALL',
                    )
                    .map(d => ({
                      id:
                        indicatorsMetaData
                          .find(el => el.mainIndicatorId === d.mainIndicatorId)
                          ?.subIndicators.find(el => el.id === d.id)?.name ||
                        '',
                      value: d.numericValue || 0,
                    }))}
                  suffix={
                    indicatorsMetaData.find(
                      d =>
                        `${d.mainIndicatorId}` ===
                        safeSelectedSubIndicator[inViewSlide].split('_')[0],
                    )?.suffix || ''
                  }
                  maxValue={
                    indicatorsMetaData.find(
                      d =>
                        `${d.mainIndicatorId}` ===
                        safeSelectedSubIndicator[inViewSlide].split('_')[0],
                    )?.maxValue ?? 100
                  }
                  color={
                    indicatorsMetaData.find(
                      d =>
                        `${d.mainIndicatorId}` ===
                        safeSelectedSubIndicator[inViewSlide].split('_')[0],
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
                  indicator: indicatorsMetaData[inViewSlide].name
                    .replaceAll(' ', '-')
                    .toLowerCase(),
                }}
              >
                <Button variant='primary'>View more →</Button>
              </Link>
            </div>
          </div>,
          document.getElementById('root') as HTMLElement,
        )}
    </div>
  );
}

export default HomepageEl;
