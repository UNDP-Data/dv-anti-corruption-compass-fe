import { Button } from '@undp/design-system-react/Button';
import { H2, H3, P } from '@undp/design-system-react/Typography';
import { SegmentedControl } from '@undp/design-system-react/SegmentedControl';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from '@undp/design-system-react/Card';
import { ChoroplethMap } from '@undp/data-viz/ChoroplethMap';
import { DataTable } from '@undp/data-viz/DataTable';
import { ThreeDGlobe } from '@undp/data-viz/ThreeDGlobe';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import ControlPanel from './ControlPanel';

function Homepage() {
  /*
  const { data, isFetching, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  */
  const refSlideTwo = useRef(null);
  const refSlideThree = useRef(null);
  const refControlPanelOne = useRef(null);
  const refControlPanelTwo = useRef(null);
  const refControlPanelThree = useRef(null);
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
    activeColor: '#93DBFF',
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

  const [selectedIndicatorPrimaryData, setSelectedIndicatorPrimaryData] =
    useState({
      label: 'Contract Modifications',
      activeColor: '#93DBFF',
    });
  const [
    selectedIndicatorBusinessExperience,
    setSelectedIndicatorBusinessExperience,
  ] = useState({ label: 'Incidence', activeColor: '#F0B292' });
  const [
    selectedIndicatorAntiCorruptionAuthorities,
    setSelectedIndicatorAntiCorruptionAuthorities,
  ] = useState({ label: 'Category 1', activeColor: '#93DBFF' });
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
  return (
    <div className='relative'>
      <motion.div
        style={{ opacity: slideOneOpacity }}
        className='sticky top-[120px] h-[calc(100vh-120px)] flex flex-col'
      >
        <div className='flex flex-col min-h-[calc(100vh-120px)]'>
          <div className='flex flex-col gap-8 justify-center items-center max-w-[1272px] m-auto py-16'>
            <H2 className='poppins-bold !text-[44px] !tracking-[120%]'>
              Is your nation winning the fight against corruption?
            </H2>
            <P
              className='text-center poppins-regular !tracking-[120%]'
              size='lg'
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
            <div className='flex gap-8'>
              <Button
                variant='primary-without-icon'
                className='rounded-full bg-[#fff] px-10 text-[var(--gray-700)] hover:bg-[#DEF7FF] poppins-semibold !text-[18px]'
              >
                Take a tour →
              </Button>
              <Button
                variant='primary-without-icon'
                className='rounded-full bg-[#4B6E91] px-10 text-[#fff] hover:bg-[#2A3F53] poppins-semibold !text-[18px]'
              >
                View Country Level Insights →
              </Button>
            </div>
          </div>
          <div className='m-auto w-full grow flex'>
            <ThreeDGlobe
              showColorScale={false}
              globeOffset={[0, (150 * window.innerHeight) / 750]}
              polygonAltitude={0.005}
              scale={window.innerHeight < 1000 ? 0.35 : 1}
              footNote=''
              enableZoom={false}
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
              globeMaterial={{
                color: '#fff',
                opacity: 1,
                transparent: true,
              }}
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        ref={refSlideTwo}
        className='flex z-10 relative sticky top-[120px] pb-60'
        style={{
          opacity: slideTwoOpacity,
          background:
            'linear-gradient(180deg, #0F0F0F 0%, #437390 52.88%, #93DBFF 100%)',
        }}
      >
        <div className='w-1/2 px-10'>
          <ControlPanel
            ref={refControlPanelOne}
            heading='Primary Data - Public Procurement Integrity'
            description='Uncover the hidden patterns in public procurement. Our primary indicators reveal critical insights into procurement transparency. Explore contract modifications, instances where no call for tenders was published, non-open procedures, single bidding cases, tax haven connections, and beneficiary ownership transparency. These experience-based indicators provide actionable intelligence for reformers.'
            buttons={[
              { label: 'Contract Modifications', activeColor: '#93DBFF' },
              { label: 'Single Bidding', activeColor: '#6466F1' },
              {
                label: 'No Call for tenders Published',
                activeColor: '#71A612',
              },
              { label: 'Tax Haven', activeColor: '#A21942' },
              { label: 'Non-open procedure', activeColor: '#FD6925' },
              { label: 'Beneficiary Ownership', activeColor: '#666' },
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
              { label: 'Incidence', activeColor: '#F0B292' },
              { label: 'Practices', activeColor: '#FFDD00' },
              {
                label: 'Counter Measures',
                activeColor: '#D001B4',
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
            buttons={[
              { label: 'Category 1', activeColor: '#93DBFF' },
              { label: 'Category 2', activeColor: '#93DBFF' },
              {
                label: 'Category 3',
                activeColor: '#93DBFF',
              },
            ]}
            onClick={d => {
              setSelectedIndicatorAntiCorruptionAuthorities(d);
              setSelectedIndicator(d);
            }}
          />
        </div>
        <div className='w-1/2 sticky top-[120px] h-[calc(100vh-120px)] flex flex-col items-center justify-center'>
          <ThreeDGlobe
            showColorScale={false}
            polygonAltitude={0.005}
            scale={Math.max(2, 3000 / window.innerWidth)}
            footNote=''
            enableZoom={false}
            atmosphereColor={selectedIndicator.activeColor}
            globeMaterial={{
              color: '#fff',
              opacity: 1,
              transparent: true,
            }}
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
        </div>
      </motion.div>

      <div
        ref={refSlideThree}
        className='dark flex flex-col relative z-20 sticky p-10'
        style={{
          background:
            'linear-gradient(180deg, #0F0F0F 0%, #437390 52.88%, #93DBFF 100%)',
        }}
      >
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
          />
        </div>
        <div>
          {view === 'map' ? (
            <ChoroplethMap
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
          )}
        </div>
        <div className='w-full py-10'>
          <H3 className='poppins-semibold !text-[24px]'>
            Recommended projects
          </H3>
          <div className='flex gap-6 mt-10'>
            <Card backgroundColor='white' border size='sm' variant='with-image'>
              <CardHeader>
                <CardImage src='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                <CardTitle>Card title</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  blandit augue eu sagittis facilisis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button padding='none' variant='link'>
                  Read more
                </Button>
              </CardFooter>
            </Card>
            <Card backgroundColor='white' border size='sm' variant='with-image'>
              <CardHeader>
                <CardImage src='https://plus.unsplash.com/premium_photo-1738857914575-3d3b2fb7064e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                <CardTitle>Card title</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  blandit augue eu sagittis facilisis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button padding='none' variant='link'>
                  Read more
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className='w-full py-10'>
          <H3 className='poppins-semibold !text-[24px]'>Partnerships</H3>
          <P className='poppins-regular !text-[16px]'>
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
