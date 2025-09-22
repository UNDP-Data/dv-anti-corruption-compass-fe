import { Button } from '@undp/design-system-react/Button';
import { H2, H3, P } from '@undp/design-system-react/Typography';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';
import {
  Card,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from '@undp/design-system-react/Card';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';
import { DataTable } from '@undp/data-viz/DataTable';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';

import ControlPanel from './ControlPanel';
import Navigation from './Navigation';

import { COLOR_SCALES } from '@/Constants';

function Homepage() {
  /*
  const { data, isFetching, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  */
  const [data, setData] = useState(undefined);
  useEffect(() => {
    fetchAndParseJSON('./data/data.json').then(d => {
      setData(d);
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

  const [view, setView] = useState('map');

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
                className='rounded-full bg-[#fff] px-10 text-[var(--gray-700)] hover:bg-[#DEF7FF] poppins-semibold !text-[16px]'
              >
                Take a tour →
              </Button>
              <Button
                variant='primary-without-icon'
                className='rounded-full bg-[#4B6E91] px-10 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[16px]'
              >
                View Country Level Insights →
              </Button>
            </div>
          </div>
          <div
            className='m-auto w-full grow flex radialGradientMask'
            ref={globeDiv}
          >
            {data ? (
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
        <div className='w-1/2 sticky top-[120px] h-[calc(100vh-120px)] flex flex-col py-10 pl-10 pr-30'>
          <div className='w-full grow flex radialGradientMask'>
            {data ? (
              <ThreeDGlobe
                showColorScale={false}
                polygonAltitude={0.005}
                highlightedAltitude={0.01}
                colors={
                  COLOR_SCALES.find(d => d.id === selectedIndicator.id)?.colors
                }
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

      <div ref={refSlideThree} className='flex flex-col relative z-20 p-10'>
        <div className='flex gap-4 w-full items-center justify-between py-10'>
          <SegmentedControl
            color='blue'
            value={view}
            onValueChange={d => {
              setView(d);
            }}
            options={[
              {
                label: 'Map view',
                value: 'map',
              },
              {
                label: 'Table view',
                value: 'table',
              },
            ]}
            size='base'
            variant='normal'
            className='rounded-full p-0 border-0'
            activeButtonClassName='rounded-full py-4 px-16 poppins-bold bg-[#4B6E91] text-[#fff]'
            buttonClassName='px-16 poppins-regular py-4 rounded-full'
          />
        </div>
        <div>
          {view === 'map' ? (
            <ChoroplethMap
              footNote=''
              relativeHeight={0.4}
              showColorScale={false}
              centerPoint={[0, 10]}
              showAntarctica={false}
              data={[
                {
                  id: 'IND',
                  x: 1,
                },
                {
                  id: 'FIN',
                  x: 2,
                },
                {
                  id: 'IDN',
                  x: 3,
                },
                {
                  id: 'ZAF',
                  x: 4,
                },
                {
                  id: 'PER',
                  x: 5,
                },
                {
                  id: 'PAK',
                  x: 6,
                },
                {
                  id: 'USA',
                  x: 7,
                },
                {
                  id: 'SWE',
                  x: 8,
                },
              ]}
            />
          ) : (
            <div className='dark'>
              <DataTable
                columnData={[
                  {
                    columnId: 'label',
                    columnTitle: 'Label',
                  },
                  {
                    align: 'right',
                    columnId: 'value1',
                    columnTitle: 'Value #1',
                    sortable: true,
                  },
                  {
                    align: 'center',
                    columnId: 'value2',
                    columnTitle: 'Value #2',
                  },
                  {
                    columnId: 'value3',
                    columnTitle: 'Value #3',
                    prefix: 'US $ ',
                  },
                ]}
                data={[
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q1',
                    value1: 3,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q2',
                    value1: 8,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q3',
                    value1: 11,
                    value2: 3,
                    value3: 3,
                  },
                  {
                    label: '2020 Q4',
                    value1: 19,
                    value2: 3,
                    value3: 3,
                  },
                ]}
              />
            </div>
          )}
        </div>
        <div className='w-full mt-14'>
          <H3 className='poppins-semibold !text-[24px] !mb-10'>
            Recommended projects
          </H3>
          <div className='flex gap-6 mt-10 dark'>
            <Card
              border
              size='sm'
              variant='with-image'
              className='rounded-[20px] border-0 max-w-65'
            >
              <CardHeader>
                <CardImage
                  className='rounded-tl-[20px] rounded-tr-[20px] h-40'
                  src='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                />
                <CardTitle className='poppins-medium !text-[16px] !leading-[26px] text-[#fff]'>
                  Global Report on Public Procurement
                </CardTitle>
                <CardDescription className='poppins-regular !text-[12px] !leading-[16px] text-[#808191]'>
                  Published on July 2nd 2025
                </CardDescription>
              </CardHeader>
            </Card>
            <Card
              border
              size='sm'
              variant='with-image'
              className='rounded-[20px] border-0 max-w-65'
            >
              <CardHeader>
                <CardImage
                  className='rounded-tl-[20px] rounded-tr-[20px] h-40'
                  src='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                />
                <CardTitle className='poppins-medium !text-[16px] !leading-[26px] text-[#fff]'>
                  Global Report on Public Procurement
                </CardTitle>
                <CardDescription className='poppins-regular !text-[12px] !leading-[16px] text-[#808191]'>
                  Published on July 2nd 2025
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className='w-full my-11'>
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
    </div>
  );
}

export default Homepage;
