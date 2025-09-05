import '@/styles/fonts.css';
import '@/styles/style.css';
import '@undp/data-viz/style.css';
import '@undp/design-system-react/style.css';

import './styles/fonts.css';
import './styles/style.css';
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@undp/design-system-react/DropdownMenu';
import { H3, P } from '@undp/design-system-react/Typography';
import {
  ChevronDown,
  FacebookIcon,
  Globe,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import Homepage from './01-Homepage';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50); // adjust threshold
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed flex justify-between top-0 w-full px-16 py-9 z-50 transition-colors duration-300 z-1000 ${
        scrolled ? 'bg-[#0F0F0F] shadow-md' : 'bg-transparent'
      }`}
    >
      <Link to='/'>
        <div className='flex items-center gap-4'>
          <img src='/imgs/Logo.svg' alt='Example' className='w-7.5 h-auto' />
          <H3
            className='text-center poppins-bold !text-[20px] leading-[120%] tracking-[0%]'
            marginBottom='none'
          >
            Anti Corruption Compass
          </H3>
        </div>
      </Link>
      <div className='flex items-center gap-16'>
        <Link to='/'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            Home
          </P>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='flex items-center gap-2'>
              <P
                className='text-center poppins-medium !text-[18px] leading-none tracking-[0%] text-[#fff]'
                marginBottom='none'
              >
                Main indicators
              </P>
              <ChevronDown strokeWidth={1} color='#fff' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-70 rounded-[12px] mt-2 p-0'>
            <DropdownMenuItem className='poppins-medium !text-[14px] py-4 hover:!bg-[#4B6E91] hover:!text-[#fff]'>
              <Link to='/public-procurement-integrity'>
                <P
                  className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
                  marginBottom='none'
                >
                  Public procurement integrity
                </P>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='poppins-medium !text-[14px] py-4 hover:!bg-[#4B6E91] hover:!text-[#fff]'>
              <Link to='/business-experience'>
                <P
                  className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
                  marginBottom='none'
                >
                  Business experiences
                </P>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='poppins-medium !text-[14px] py-4 hover:!bg-[#4B6E91] hover:!text-[#fff]'>
              <Link to='/anti-corruption-authority'>
                <P
                  className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
                  marginBottom='none'
                >
                  Anti-corruption authorities
                </P>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to='/methodology'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            Methodology
          </P>
        </Link>
        <Link to='/about'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            About Us
          </P>
        </Link>
      </div>
      <div>
        <Globe strokeWidth={2} color='#fff' size={32} />
      </div>
    </header>
  );
}
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className='pt-30'>
        <Outlet />
      </main>
      <footer className='bg-[#2D4858] px-10 py-20 relative z-10'>
        <div className='flex flex-wrap'>
          <div className='w-1/2'>
            <P className='poppins-regular !text-[16px]' size='sm'>
              Copyright © 2025 Anti Corruption Compass
            </P>
            <div className='flex gap-8'>
              <FacebookIcon />
              <TwitterIcon />
              <InstagramIcon />
              <YoutubeIcon />
            </div>
          </div>
          <div className='w-1/2 flex gap-16 justify-end'>
            <Link to='/'>
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                Home
              </P>
            </Link>
            <div className='flex flex-col gap-8'>
              <Link to='/public-procurement-integrity'>
                <P className='poppins-regular !text-[16px]' marginBottom='none'>
                  Public procurement integrity
                </P>
              </Link>
              <Link to='/business-experience'>
                <P className='poppins-regular !text-[16px]' marginBottom='none'>
                  Business experiences
                </P>
              </Link>
              <Link to='/anti-corruption-authority'>
                <P className='poppins-regular !text-[16px]' marginBottom='none'>
                  Anti-corruption authorities
                </P>
              </Link>
            </div>
            <Link to='/methodology'>
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                Methodology
              </P>
            </Link>
            <Link to='/about'>
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                About Us
              </P>
            </Link>
          </div>
        </div>
      </footer>
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return <Homepage />;
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className='p-2'>About page here!</div>;
  },
});

const methodologyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/methodology',
  component: function About() {
    return <div className='p-2'>Methodology page here!</div>;
  },
});

const publicProcurementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/public-procurement-integrity',
  component: function About() {
    return <div className='p-2'>Public procurement integrity page here!</div>;
  },
});

const businessExperiencesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business-experience',
  component: function About() {
    return <div className='p-2'>Business experience page here!</div>;
  },
});

const antiCorruptionAuthorityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/anti-corruption-authority',
  component: function About() {
    return <div className='p-2'>Anti corruption authority page here!</div>;
  },
});
const countryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/countries/$isocode',
  component: CountryPage,
});

function CountryPage() {
  const { isocode } = countryRoute.useParams();
  return <h2>Country: {isocode}</h2>;
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  methodologyRoute,
  publicProcurementRoute,
  businessExperiencesRoute,
  antiCorruptionAuthorityRoute,
  countryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
