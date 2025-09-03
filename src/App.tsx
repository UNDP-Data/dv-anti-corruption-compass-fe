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
      <div className='flex items-center gap-4'>
        <img src='/imgs/Logo.svg' alt='Example' className='w-7.5 h-auto' />
        <H3
          className='text-center poppins-bold !text-[20px] leading-[120%] tracking-[0%]'
          marginBottom='none'
        >
          Anti Corruption Compass
        </H3>
      </div>
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
                className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
                marginBottom='none'
              >
                Main indicators
              </P>
              <ChevronDown strokeWidth={1} color='#fff' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuItem className='poppins-medium !text-[14px]'>
              Public procurement integrity
            </DropdownMenuItem>
            <DropdownMenuItem className='poppins-medium !text-[14px]'>
              Business experiences
            </DropdownMenuItem>
            <DropdownMenuItem className='poppins-medium !text-[14px]'>
              Anti-corruption authorities
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to='/about'>
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
      <footer className='bg-[#2D4858] px-10 py-20'>
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
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                Public procurement integrity
              </P>
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                Business experiences
              </P>
              <P className='poppins-regular !text-[16px]' marginBottom='none'>
                Anti-corruption authorities
              </P>
            </div>
            <Link to='/about'>
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
    return <div className='p-2'>Hello from About!</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

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
