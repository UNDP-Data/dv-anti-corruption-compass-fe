import { Button } from '@undp/design-system-react/Button';
import { H2, H3, P } from '@undp/design-system-react/Typography';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { ArrowDown, InfoIcon, X } from 'lucide-react';
import { Spinner } from '@undp/design-system-react/Spinner';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@undp/design-system-react/HoverCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@undp/design-system-react/Tabs';
import { Label } from '@undp/design-system-react/Label';
import { Badge } from '@undp/design-system-react/Badge';
import { Link, useNavigate } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';

import ControlPanel from './ControlPanel';
import Navigation from './Navigation';
import { CardEl } from './Cards';

import {
  DROPDOWN_CLASSNAMES_MULTI_SELECT,
  DROPDOWN_CLASSNAMES_WHITE,
  SUB_PILLARS,
  YEARS,
} from '@/Constants';
import { TaxonomyType } from '@/Types';

interface DataType {
  id: string;
  country: string;
  x: 'High' | 'Medium' | 'Low';
}

function Homepage() {
  /*
  const { data, isFetching, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  */
  const handleScroll = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current) return;

    const y =
      targetRef.current.getBoundingClientRect().top + window.scrollY - 120;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const [data, setData] = useState<DataType[]>([]);
  const [selectedTab, setSelectedTab] = useState('tab 1');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [countryTaxonomy, setCountryTaxonomy] = useState<TaxonomyType[]>([]);
  useEffect(() => {
    fetchAndParseJSON('./data/data.json').then(d => {
      setData(d as DataType[]);
    });
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/refs/heads/main/country_territory_groups.json',
    ).then(d => {
      setCountryTaxonomy(d);
    });
  });
  const globeDiv = useRef<HTMLDivElement>(null);

  const [globeYOffSet, setGlobeYOffSet] = useState(0);
  const refSlideOne = useRef<HTMLDivElement>(null);
  const refSlideTwo = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(2022);
  const navigate = useNavigate();
  const [selectedPillar, setSelectedPillar] = useState([
    'Contract Modifications',
  ]);
  const refSlideThree = useRef<HTMLDivElement>(null);
  const refControlPanelOne = useRef<HTMLDivElement>(null);
  const refControlPanelTwo = useRef<HTMLDivElement>(null);
  const refControlPanelThree = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: refSlideTwo,
    offset: ['start end', 'start center'],
  });
  const scrollYProgressSlideThree = useScroll({
    target: refSlideThree,
    offset: ['start end', 'start center'],
  });
  const [selectedIndicator, setSelectedIndicator] = useState({
    label: 'Contract Modifications',
    value: 'Contract Modifications',
    color: '#03682B',
  });

  const isInViewControlPanelOne = useInView(refControlPanelOne, {
    once: false,
    amount: 0.5,
  });
  const isInViewControlPanelTwo = useInView(refControlPanelTwo, {
    once: false,
    amount: 0.5,
  });
  const isInViewControlPanelThree = useInView(refControlPanelThree, {
    once: false,
    amount: 0.5,
  });

  const isInViewSlideThree = useInView(refSlideThree, {
    once: false,
    amount: 0,
  });

  const [selectedIndicatorPrimaryData, setSelectedIndicatorPrimaryData] =
    useState({
      label: 'Contract Modifications',
      value: 'Contract Modifications',
      color: '#03682B',
    });
  const [
    selectedIndicatorBusinessExperience,
    setSelectedIndicatorBusinessExperience,
  ] = useState({
    label: 'Incidence',
    value: 'Incidence',
    color: '#F49764',
  });
  useEffect(() => {
    if (isInViewControlPanelOne) {
      setSelectedIndicator(selectedIndicatorPrimaryData);
    }
    if (isInViewControlPanelTwo) {
      setSelectedIndicator(selectedIndicatorBusinessExperience);
    }
  }, [
    isInViewControlPanelOne,
    isInViewControlPanelTwo,
    isInViewControlPanelThree,
    selectedIndicatorPrimaryData,
    selectedIndicatorBusinessExperience,
  ]);
  const slideOneOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const slideTwoOpacity = useTransform(
    scrollYProgressSlideThree.scrollYProgress,
    [0, 1],
    [1, 0],
  );
  useEffect(() => {
    if (globeDiv.current) {
      setGlobeYOffSet(
        (100 * (globeDiv.current?.getBoundingClientRect()?.height || 0)) / 228,
      );
    }
  }, []);
  return (
    <div className='relative'>
      <Navigation
        isInViewControlPanelOne={isInViewControlPanelOne}
        isInViewControlPanelTwo={isInViewControlPanelTwo}
        isInViewControlPanelThree={isInViewControlPanelThree}
        isInViewSlideThree={isInViewSlideThree}
        refControlPanelOne={refControlPanelOne}
        refControlPanelTwo={refControlPanelTwo}
        refControlPanelThree={refControlPanelThree}
        refSlideThree={refSlideThree}
      />
      <div
        className='w-screen h-screen fixed top-0'
        style={{
          background:
            'linear-gradient(141.12deg, #0F0F0F -2.91%, #2D4351 44.74%, #437390 95.34%, #93DBFF 119.46%)',
        }}
      />
      <motion.div
        ref={refSlideOne}
        style={{ opacity: slideOneOpacity }}
        className='sticky top-[120px] h-[calc(100vh-120px)] flex flex-col'
      >
        <div className='flex flex-col min-h-[calc(100vh-120px)]'>
          <div className='flex flex-col gap-8 justify-center items-center max-w-[1272px] m-auto py-16 px-4'>
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
              business experiences with bribery, to curated datasets from
              trusted international sources, plus country-specific legal
              frameworks and institutional strategies - discover, compare, and
              drive evidence-based reforms across all dimensions of
              anti-corruption efforts.
            </P>
            <div className='flex gap-x-8 gap-y-4 flex-wrap'>
              <Button
                variant='primary-without-icon'
                className='capitalize rounded-full bg-[#fff] px-10 text-[var(--gray-700)] hover:bg-[#DEF7FF] poppins-semibold !text-[16px]'
              >
                Take a tour →
              </Button>
              <Button
                variant='primary-without-icon'
                className='capitalize rounded-full bg-[#4B6E91] px-10 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[16px]'
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
                scale={0.75}
                footNote=''
                globeMaterial={
                  new THREE.MeshBasicMaterial({
                    color: 0xfafafa,
                  })
                }
                atmosphereColor='#000'
                atmosphereAltitude={0.15}
                globeCurvatureResolution={2}
                enableZoom={false}
                autoRotate={scrollYProgress.get() < 1}
                data={data}
              />
            ) : null}
          </div>
        </div>
        <button
          className='cursor-pointer border-0 fixed bottom-6 left-[50%] translate-x-[-50%] rounded-full bg-primary-white p-4'
          onClick={() => {
            handleScroll(refControlPanelOne);
          }}
        >
          <ArrowDown color='#437390' strokeWidth={3} />
        </button>
      </motion.div>
      <motion.div
        ref={refSlideTwo}
        className='flex z-10 relative top-[120px] pb-60'
        style={{
          opacity: slideTwoOpacity,
        }}
      >
        <div className='w-1/2 px-10'>
          <ControlPanel
            ref={refControlPanelOne}
            heading='Primary Data - Public Procurement Integrity'
            description='Uncover the hidden patterns in public procurement. Our primary indicators reveal critical insights into procurement transparency. Explore contract modifications, instances where no call for tenders was published, non-open procedures, single bidding cases, tax haven connections, and beneficiary ownership transparency. These experience-based indicators provide actionable intelligence for reformers.'
            buttons={SUB_PILLARS.filter(
              d => d.mainIndicator === 'Public Procurement',
            ).map(d => ({
              label: d.label,
              value: d.value,
              color: d.indicatorColor,
            }))}
            onClick={d => {
              setSelectedIndicatorPrimaryData(d);
              setSelectedIndicator(d);
            }}
          />
          <ControlPanel
            ref={refControlPanelTwo}
            heading='Business Experiences'
            description='What do businesses really experience on the ground? Go beyond perception to understand real encounters with corruption. Our indicators capture the incidence of corrupt practices, document specific practices businesses encounter, and reveal counter measures organizations implement. This ground-truth data empowers evidence-based strategies.'
            buttons={SUB_PILLARS.filter(
              d => d.mainIndicator === 'Business Experiences',
            ).map(d => ({
              label: d.label,
              value: d.value,
              color: d.indicatorColor,
            }))}
            onClick={d => {
              setSelectedIndicatorBusinessExperience(d);
              setSelectedIndicator(d);
            }}
          />
        </div>
        <div className='w-1/2 sticky top-[120px] h-[calc(100vh-120px)] flex flex-col py-16 pl-10 pr-30'>
          <div className='absolute left-1/2 top-0 z-10 transform -translate-x-1/2'>
            <div className='p-2 flex flex-col gap-4'>
              <div className='flex gap-2 items-center'>
                <P
                  size='base'
                  marginBottom='none'
                  className='p-0 leading-normal text-primary-white poppins-bold'
                >
                  Indicator Value
                </P>
                <HoverCard openDelay={0}>
                  <HoverCardTrigger>
                    <InfoIcon color='#fff' />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Countries in the top third are assigned High, the middle
                    third Medium, and the bottom third Low. Missing values are
                    labelled Not Available.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className='flex flex gap-7 poppins-regular'>
                {SUB_PILLARS.find(
                  d => d.value === selectedIndicator.value,
                )?.colors.map((d, i) => (
                  <div key={i} className='flex gap-2 items-center'>
                    <div
                      className='w-4 h-4 rounded-full'
                      style={{
                        backgroundColor: d,
                      }}
                    />
                    <P size='base' marginBottom='none' leading='none'>
                      {i === 0 ? 'Low' : i === 1 ? 'Medium' : 'High'}
                    </P>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='w-full grow flex radialGradientMask'>
            {data.length !== 0 ? (
              <ThreeDGlobe
                showColorScale={false}
                polygonAltitude={0.005}
                highlightedAltitude={0.01}
                colors={
                  SUB_PILLARS.find(d => d.value === selectedIndicator.value)
                    ?.colors
                }
                selectedId={selectedId}
                onSeriesMouseClick={d => {
                  setSelectedId(d.id);
                }}
                colorDomain={['Low', 'Medium', 'High']}
                scale={
                  (window.innerWidth / 2 - 160) / (window.innerHeight - 200) >
                  0.95
                    ? 1.5
                    : (window.innerWidth / 2 - 160) /
                          (window.innerHeight - 200) >
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
                  SUB_PILLARS.find(d => d.value === selectedIndicator.value)
                    ?.indicatorColor
                }
                globeMaterial={
                  new THREE.MeshBasicMaterial({
                    color: 0xfafafa,
                  })
                }
                fogSettings={{
                  color:
                    SUB_PILLARS.find(d => d.value === selectedIndicator.value)
                      ?.indicatorColor || '#fff',
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
                autoRotate={
                  isInViewControlPanelOne ||
                  isInViewControlPanelThree ||
                  isInViewControlPanelTwo
                    ? 1
                    : false
                }
                data={data}
              />
            ) : null}
          </div>
        </div>
      </motion.div>

      <div ref={refSlideThree} className='flex flex-col relative z-20 py-10'>
        <div
          className={`flex items-center w-full px-4 bg-cover bg-center bg-no-repeat ${selectedTab === 'tab 2' ? 'bg-transparent' : "bg-[url('/imgs/sphere.webp')]"} px-8 py-[40px] md:py-[260px] lg:py-[320px]`}
        >
          <div className='gap-4.5 flex flex-col w-full text-primary-gray-700 max-w-[1272px] mx-auto'>
            <Tabs
              color='blue'
              defaultValue='tab 1'
              onValueChange={d => {
                setSelectedTab(d);
              }}
            >
              <TabsList className='mx-0 pl-0'>
                <TabsTrigger value='tab 1' className='text-primary-white!'>
                  Find a country
                </TabsTrigger>
                <TabsTrigger value='tab 2' className='text-primary-white!'>
                  See full list
                </TabsTrigger>
              </TabsList>
              <TabsContent value='tab 1'>
                <div className='gap-4.5 flex flex-col w-full text-primary-gray-700 pt-8'>
                  <H2
                    className='!text-[24px] poppins-bold text-primary-white'
                    marginBottom='none'
                  >
                    Uncover detailed anti-corruption data for your country.
                  </H2>
                  <P
                    className='poppins-regular leading-[120%] text-primary-white'
                    size='base'
                    marginBottom='none'
                  >
                    Choose a country to reveal its complete anti-corruption
                    profile — from key indicators to institutional strategies
                  </P>
                  {countryTaxonomy.length > 0 ? (
                    <DropdownSelect
                      placeholder='Select country'
                      options={countryTaxonomy.map(d => ({
                        label: d['Country or Area'],
                        value: d['Alpha-3 code'],
                      }))}
                      onChange={d => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        navigate({ to: `/countries/${(d as any).value}` });
                      }}
                      size='base'
                      variant='normal'
                      className='bg-primary-white! border-0! rounded-full! px-4!'
                      classNames={DROPDOWN_CLASSNAMES_WHITE}
                    />
                  ) : (
                    <Spinner />
                  )}
                </div>
              </TabsContent>
              <TabsContent value='tab 2'>
                <div className='gap-4.5 flex flex-col w-full text-primary-gray-700'>
                  <div className='gap-4 flex'>
                    <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px] max-w-[480px] flex-wrap'>
                      <Label className='text-primary-white'>
                        Filter by year
                      </Label>
                      <DropdownSelect
                        value={{
                          value: selectedYear,
                          label: selectedYear,
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(d: any) => {
                          setSelectedYear(d.value);
                        }}
                        placeholder='Select contract value'
                        options={YEARS.map(d => ({
                          value: d,
                          label: d,
                        }))}
                        size='base'
                        variant='normal'
                        className='bg-primary-white! border-0! rounded-[8px]!'
                        classNames={DROPDOWN_CLASSNAMES_WHITE}
                        isClearable={false}
                      />
                    </div>
                    <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px] max-w-[480px] flex-wrap'>
                      <Label className='text-primary-white'>
                        Filter by pillar
                      </Label>
                      <DropdownSelect
                        placeholder='Select Pillar'
                        value={selectedPillar.map(d => ({
                          value: d,
                          label: d,
                        }))}
                        isMulti
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(d: any) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setSelectedPillar(d.map((el: any) => el.value));
                        }}
                        options={[
                          ...new Set(SUB_PILLARS.map(d => d.mainIndicator)),
                        ].map(d => ({
                          label: d,
                          options: SUB_PILLARS.filter(
                            el => el.mainIndicator === d,
                          ).map(el => ({
                            value: el.label,
                            label: el.value,
                          })),
                        }))}
                        size='base'
                        variant='normal'
                        className='bg-primary-white! border-0! rounded-[8px]!'
                        classNames={DROPDOWN_CLASSNAMES_MULTI_SELECT}
                        isClearable={false}
                      />
                    </div>
                  </div>
                  <Spacer size='lg' />
                  <div className='dark'>
                    <div className='flex w-full pb-2 border-b border-b-primary-white'>
                      <div className='poppins-bold text-[16px]! text-primary-white! w-[35%] pr-4!'>
                        Country name
                      </div>
                      <div className='poppins-bold text-[16px]! text-primary-white! w-[25%] pr-4!'>
                        Pillar
                      </div>
                      <div className='poppins-bold text-[16px]! text-primary-white! w-[20%] pr-4!'>
                        Indicator value
                      </div>
                      <div className='poppins-bold text-[16px]! text-primary-white! w-[10%] pr-4!'>
                        Value
                      </div>
                      <div className='poppins-bold text-[16px]! text-primary-white! w-[10%] pr-4!' />
                    </div>
                    <div className='max-h-[600px] undp-scrollbar'>
                      {data.length > 0 ? (
                        data.map((el, i) => (
                          <div key={i}>
                            {selectedPillar.map((p, j) => (
                              <div
                                className='flex w-full py-4 border-b border-b-primary-white items-center'
                                key={j}
                              >
                                <div className='poppins-regular text-[16px]! text-primary-white! w-[35%] pr-4!'>
                                  {el.country}
                                </div>
                                <div className='poppins-regular text-[16px]! text-primary-white! w-[25%] pr-4!'>
                                  {p}
                                </div>
                                <div className='poppins-regular text-[16px]! text-primary-white! w-[20%] pr-4!'>
                                  <Badge
                                    rounded='full'
                                    className='poppins-regular'
                                    style={{
                                      backgroundColor: SUB_PILLARS.find(
                                        d => d.value === p,
                                      )?.colors[
                                        ['Low', 'Medium', 'High'].indexOf(el.x)
                                      ],
                                    }}
                                  >
                                    {el.x}
                                  </Badge>
                                </div>
                                <div className='poppins-regular text-[16px]! text-primary-white! w-[10%] pr-4!'>
                                  0.25
                                </div>
                                <Link
                                  to='/countries/$isoCode'
                                  className='poppins-regular text-[16px]! text-primary-white! w-[10%] pr-4!'
                                  params={{ isoCode: el.id }}
                                >
                                  View country
                                </Link>
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <Spinner />
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className='w-full mt-14 px-10'>
          <H3 className='poppins-semibold !text-[24px] !mb-10'>
            Recommended projects
          </H3>
          <div className='flex gap-6 mt-10'>
            <CardEl
              img='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              title='Global Report on Public Procurement'
              date='July 2nd 2025'
            />
            <CardEl
              img='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              title='Global Report on Public Procurement'
              date='July 2nd 2025'
            />
          </div>
        </div>
        <div className='w-full my-11 px-10'>
          <H3 className='poppins-bold !text-[24px] !mb-4'>Partnerships</H3>
          <P className='poppins-regular !text-[16px] !leading-[140%]'>
            We've curated comprehensive datasets from Transparency
            International, World Bank, UNODC, OECD, and other respected
            institutions. Compare corruption indices, governance indicators, and
            specialized measurements - all accessible with one click in one
            comprehensive dashboard.
          </P>
        </div>
      </div>
      {selectedId && data.length !== 0 && (
        <div className='fixed bottom-8 right-16 z-15 bg-[rgba(255,255,255,0.8)] p-6 w-[280px] sm:w-[360px] rounded-[8px]'>
          <div
            style={{
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              padding: '4px',
              zIndex: 10,
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
            }}
            onClick={() => {
              setSelectedId(undefined);
            }}
          >
            <X color='#000' strokeWidth={2} />
          </div>
          <div className='w-full flex flex-col items-center'>
            <img
              alt='Country flag'
              className='w-9 mb-2'
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryTaxonomy.find(d => d['Alpha-3 code'] === selectedId)?.['Alpha-2 code']}.svg`}
            />
            <P className='text-primary-gray-700 poppins-bold' size='lg'>
              {data.find(d => d.id === selectedId)?.country}
            </P>
            <Button
              variant='primary-without-icon'
              className='capitalize rounded-full bg-[#4B6E91] px-10 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[16px]'
            >
              View more
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
