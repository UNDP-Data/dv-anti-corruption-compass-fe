import '@/styles/fonts.css';
import '@/styles/style.css';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';

import Homepage from './01-Homepage';
import MethodologyPage from './03-Methodology';
import AboutUsPage from './04-AboutUs';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className='pt-30'>
        <Outlet />
      </main>
      <Footer />
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
    return <AboutUsPage />;
  },
});

const methodologyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/methodology',
  component: function About() {
    return <MethodologyPage />;
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
