import { Button } from '@undp/design-system-react/Button';
import { H2, H3, H5, P } from '@undp/design-system-react/Typography';
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

import ControlPanel from './ControlPanel';
import Navigation from './Navigation';
import { CardEl } from './Cards';

import { COLOR_SCALES } from '@/Constants';

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
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [countryTaxonomy, setCountryTaxonomy] = useState(undefined);
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
    id: 'contractModifications',
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
      id: 'contractModifications',
    });
  const [
    selectedIndicatorBusinessExperience,
    setSelectedIndicatorBusinessExperience,
  ] = useState({ label: 'Incidence', id: 'incidence' });
  const [
    selectedIndicatorAntiCorruptionAuthorities,
    setSelectedIndicatorAntiCorruptionAuthorities,
  ] = useState({
    label: 'Anti Corruption Authorities',
    id: 'antiCorruptionAuthorities',
  });
  useEffect(() => {
    if (isInViewControlPanelOne) {
      setSelectedIndicator(selectedIndicatorPrimaryData);
    }
    if (isInViewControlPanelTwo) {
      setSelectedIndicator(selectedIndicatorBusinessExperience);
    }
    if (isInViewControlPanelThree) {
      setSelectedIndicator(selectedIndicatorAntiCorruptionAuthorities);
    }
  }, [
    isInViewControlPanelOne,
    isInViewControlPanelTwo,
    isInViewControlPanelThree,
    selectedIndicatorPrimaryData,
    selectedIndicatorBusinessExperience,
    selectedIndicatorAntiCorruptionAuthorities,
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
                colors={COLOR_SCALES[0].colors}
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
            buttons={[
              { label: 'Contract Modifications', id: 'contractModifications' },
              { label: 'Single Bidding', id: 'singleBinding' },
              {
                label: 'No Call for tenders Published',
                id: 'noCallForTenders',
              },
              { label: 'Tax Haven', id: 'taxHaven' },
              { label: 'Non-open procedure', id: 'nonOpenProcedure' },
              { label: 'Beneficiary Ownership', id: 'beneficiaryOwnership' },
            ]}
            onClick={d => {
              setSelectedIndicatorPrimaryData(d);
              setSelectedIndicator(d);
            }}
          />
          <ControlPanel
            ref={refControlPanelTwo}
            heading='Business Experiences'
            description='What do businesses really experience on the ground? Go beyond perception to understand real encounters with corruption. Our indicators capture the incidence of corrupt practices, document specific practices businesses encounter, and reveal counter measures organizations implement. This ground-truth data empowers evidence-based strategies.'
            buttons={[
              { label: 'Incidence', id: 'incidence' },
              { label: 'Practices', id: 'practices' },
              {
                label: 'Counter Measures',
                id: 'counterMeasures',
              },
            ]}
            onClick={d => {
              setSelectedIndicatorBusinessExperience(d);
              setSelectedIndicator(d);
            }}
          />
          <ControlPanel
            ref={refControlPanelThree}
            heading='Anti-corruption Authorities'
            description='Lorem ipsum dolor sit amet consectetur. In tellus nunc enim vitae aliquet dignissim ac in. Enim ultrices et accumsan enim viverra volutpat. Magnis sapien diam sit ut elementum netus odio commodo fermentum. Nullam diam maecenas consequat eleifend rhoncus est odio. A vehicula non donec faucibus viverra parturient ipsum sit.'
            buttons={[{ label: 'Category 1', id: 'antiCorruptionAuthorities' }]}
            onClick={d => {
              setSelectedIndicatorAntiCorruptionAuthorities(d);
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
                {COLOR_SCALES.find(
                  d => d.id === selectedIndicator.id,
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
                  COLOR_SCALES.find(d => d.id === selectedIndicator.id)?.colors
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
                  COLOR_SCALES.find(d => d.id === selectedIndicator.id)
                    ?.colors[2]
                }
                globeMaterial={
                  new THREE.MeshBasicMaterial({
                    color: 0xfafafa,
                  })
                }
                fogSettings={{
                  color:
                    COLOR_SCALES.find(d => d.id === selectedIndicator.id)
                      ?.colors[2] || '#fff',
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
        <div className="flex items-center justify-center w-full bg-cover bg-center bg-no-repeat bg-[url('/imgs/sphere.webp')] px-8 py-[40px] md:py-[260px] lg:py-[320px]">
          <div className='gap-4.5 flex flex-col w-full max-w-[920px] text-primary-gray-700'>
            <H2
              className='!text-[24px] poppins-bold text-center text-primary-white'
              marginBottom='none'
            >
              Uncover detailed anti-corruption data for your country.
            </H2>
            <P
              className='poppins-regular leading-[120%] text-center text-primary-white'
              size='base'
              marginBottom='none'
            >
              Choose a country to reveal its complete anti-corruption profile —
              from key indicators to institutional strategies
            </P>
            {countryTaxonomy ? (
              <DropdownSelect
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={(countryTaxonomy as any).map((d: any) => ({
                  label: d['Country or Area'],
                  value: d['Alpha-3 code'],
                }))}
                className='rounded-full! px-4!'
                variant='light'
                placeholder='Select a country'
                isSearchable
              />
            ) : (
              <Spinner />
            )}
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
        <div className='fixed bottom-8 right-8 z-15 bg-primary-white p-6 w-[280px]'>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255, 1)',
              border: '1px solid var(--gray-400)',
              borderRadius: '999px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              padding: '4px',
              zIndex: 10,
              position: 'absolute',
              right: '-1rem',
              top: '-1rem',
            }}
            onClick={() => {
              setSelectedId(undefined);
            }}
          >
            <X color='#000' strokeWidth={2} />
          </div>
          <div className='w-full flex flex-col'>
            <H5 className='text-primary-gray-700 poppins-bold'>
              {data.find(d => d.id === selectedId)?.country}
            </H5>
            <Button
              variant='primary-without-icon'
              className='capitalize rounded-full bg-[#4B6E91] px-10 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[16px]'
            >
              View details →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
