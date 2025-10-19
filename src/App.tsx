import '@/styles/fonts.css';
import '@/styles/style.css';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { H2 } from '@undp/design-system-react/Typography';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';

import Homepage from './01-Homepage';
import MethodologyPage from './03-Methodology';
import AboutUsPage from './04-AboutUs';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import CountryPageEl from './02-CountryPage';
import { ScrollToTop } from './Utils/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

async function fetchPillarsMetaData() {
  return fetchAndParseJSON('/data/pillarMetaData.json');
}

function usePillarsData() {
  return useQuery({
    queryKey: ['pillars'],
    queryFn: fetchPillarsMetaData,
  });
}

function RootComponent() {
  const { data: pillarsMetaData } = usePillarsData();

  if (!pillarsMetaData)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Spinner size='lg' className='my-20 m-auto' />
      </div>
    );

  return (
    <div className='min-h-screen flex flex-col background-inherit'>
      <Header pillarsMetaData={pillarsMetaData} />
      <main className='flex-1 pt-30'>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer pillarsMetaData={pillarsMetaData} />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

function Index() {
  const { data: pillarsMetaData } = usePillarsData();
  if (!pillarsMetaData) return <Spinner size='lg' className='my-20 m-auto' />;
  return <Homepage pillarsMetaData={pillarsMetaData} />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
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
  component: function Methodology() {
    return <MethodologyPage />;
  },
});

function MainIndicator() {
  const { data: pillarsMetaData } = usePillarsData();
  const { indicator } = mainIndicatorRoute.useParams();
  if (!pillarsMetaData) return <Spinner size='lg' className='my-20 m-auto' />;
  return <H2 className='p-6 poppins-medium'>{indicator} page coming soon!</H2>;
}

const mainIndicatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main-indicators/$indicator',
  component: MainIndicator,
});

function Country() {
  const { isoCode } = countryRoute.useParams();
  const { data: pillarsMetaData } = usePillarsData();
  if (!pillarsMetaData) return <Spinner size='lg' className='my-20 m-auto' />;
  return <CountryPageEl isoCode={isoCode} pillarsMetaData={pillarsMetaData} />;
}

const countryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/countries/$isoCode',
  component: Country,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  methodologyRoute,
  mainIndicatorRoute,
  countryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
