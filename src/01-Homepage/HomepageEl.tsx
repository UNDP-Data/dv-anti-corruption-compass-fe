import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Spacer } from '@undp/design-system-react/Spacer';
import { Spinner } from '@undp/design-system-react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from '@tanstack/react-router';

import GlobeControls from './Components/GlobeControls';
import Navigation from './Components/Navigation';
import GlobeComponent from './Components/GlobeComponent';
import CountryLevelInsight from './Sections/CountryLevelInsight';
import Introduction from './Sections/Introduction';

import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { HeadingText, ParagraphText } from '@/Components/Typography';
import { ErrorState } from '@/Components/ErrorState';
import { ArcChart } from '@/Components/ArcChart';
import { BarChartList } from '@/Components/BarChartList';
import { Button } from '@/Components/Button';

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
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
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

  const globeData = getGlobeData(data);

  const updateYear = useEffectEvent(
    (inViewSlide: number, selectedId?: string) => {
      if (!selectedId) return;
      setSelectedYear(
        globeData.find(
          d =>
            d.indicatorId === selectedSubIndicator[inViewSlide] &&
            d.countryCode === selectedId,
        )?.year,
      );
    },
  );

  useEffect(() => {
    updateYear(inViewSlide, selectedId);
  }, [inViewSlide, selectedId]);

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
          data={[...new Set(data.map(d => d.countryCode))].map(d => ({
            id: d,
            x: 'Yes',
          }))}
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
        <div className='w-1/2 px-20'>
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
          globeData={globeData}
          data={data}
          selectedSubIndicator={selectedSubIndicator[inViewSlide]}
          countriesList={countriesList}
          inViewSlide={inViewSlide}
          rotate={inViewSlide < indicatorsMetaData.length ? true : false}
          indicatorsMetaData={indicatorsMetaData}
          selectedIndicator={indicatorsMetaData[inViewSlide]}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setSelectedYear={setSelectedYear}
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
      {selectedId &&
        data.length !== 0 &&
        createPortal(
          <div className='fixed bottom-8 right-20 bg-[#fff] p-6 lg:w-[300px] sm:w-[360px] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] z-[999] max-h-[80vh] overflow-y-auto'>
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
                  parseInt(selectedSubIndicator[inViewSlide].split('_')[0]),
              )?.subIndicators.length || 0) < 6 ? (
                <div className='w-full flex items-center text-primary-gray-500 justify-center'>
                  <ArcChart
                    data={data
                      .filter(
                        d =>
                          d.year === selectedYear &&
                          d.countryCode === selectedId &&
                          `${d.mainIndicatorId}` ===
                            selectedSubIndicator[inViewSlide].split('_')[0] &&
                          d.contractValue === 'ALL',
                      )
                      .map(d => d.numericValue)}
                    colors={
                      indicatorsMetaData
                        .find(
                          d =>
                            `${d.mainIndicatorId}` ===
                            selectedSubIndicator[inViewSlide].split('_')[0],
                        )
                        ?.subIndicators.map(d => d.color) || []
                    }
                    subPillars={
                      indicatorsMetaData
                        .map(d => d.subIndicators)
                        .flat()
                        .map(d => d.name) || []
                    }
                    suffix={
                      indicatorsMetaData.find(
                        d =>
                          `${d.mainIndicatorId}` ===
                          selectedSubIndicator[inViewSlide].split('_')[0],
                      )?.suffix || ''
                    }
                    maxValue={
                      indicatorsMetaData.find(
                        d =>
                          `${d.mainIndicatorId}` ===
                          selectedSubIndicator[inViewSlide].split('_')[0],
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
                          selectedSubIndicator[inViewSlide].split('_')[0] &&
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
                        selectedSubIndicator[inViewSlide].split('_')[0],
                    )?.suffix || ''
                  }
                  maxValue={
                    indicatorsMetaData.find(
                      d =>
                        `${d.mainIndicatorId}` ===
                        selectedSubIndicator[inViewSlide].split('_')[0],
                    )?.maxValue ?? 100
                  }
                  color={
                    indicatorsMetaData.find(
                      d =>
                        `${d.mainIndicatorId}` ===
                        selectedSubIndicator[inViewSlide].split('_')[0],
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
