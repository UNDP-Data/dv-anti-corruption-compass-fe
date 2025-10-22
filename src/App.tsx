import '@/styles/fonts.css';
import '@/styles/style.css';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { createContext, useContext } from 'react';

import Homepage from './01-Homepage';
import MethodologyPage from './04-Methodology';
import AboutUsPage from './05-AboutUs';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import CountryPageEl from './02-CountryPage';
import { ScrollToTop } from './Utils/ScrollToTop';
import { CountryTaxonomyDataType, PillarsMetaDataType } from './Types';
import { ErrorState } from './Components/ErrorState';
import MainIndicatorPageEl from './03-MainIndicator';

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

async function fetchCountryTaxonomyData() {
  return fetchAndParseJSON(
    'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/refs/heads/main/country_territory_groups.json',
  );
}

function useGlobalData() {
  const pillars = useQuery({
    queryKey: ['pillars'],
    queryFn: fetchPillarsMetaData,
  });
  const countryTaxonomy = useQuery({
    queryKey: ['countryTaxonomy'],
    queryFn: fetchCountryTaxonomyData,
  });
  return { pillars, countryTaxonomy };
}

type GlobalDataContextType = {
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomyData: CountryTaxonomyDataType[];
  countryTaxonomyLoading: boolean;
  countryTaxonomyError: boolean;
};

const GlobalDataContext = createContext<GlobalDataContextType | null>(null);

export function useGlobalDataContext() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx)
    throw new Error('useGlobalDataContext must be used inside provider');
  return ctx;
}

function RootComponent() {
  const { pillars, countryTaxonomy } = useGlobalData();

  const isLoading = pillars.isLoading;
  const isError = pillars.isError;

  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container-md mx-auto'>
        <ErrorState />
      </div>
    );

  return (
    <GlobalDataContext.Provider
      value={{
        pillarsMetaData: pillars.data,
        countryTaxonomyData: countryTaxonomy.data,
        countryTaxonomyLoading: countryTaxonomy.isLoading,
        countryTaxonomyError: countryTaxonomy.isError,
      }}
    >
      <div className='min-h-screen flex flex-col background-inherit'>
        <Header
          pillarsMetaData={pillars.data || []}
          countryTaxonomyData={countryTaxonomy.data}
          countryTaxonomyDataLoading={countryTaxonomy.isLoading}
          countryTaxonomyDataError={countryTaxonomy.isError}
        />
        <main className='flex-1 pt-30'>
          <ScrollToTop />
          <Outlet />
        </main>
        <Footer
          pillarsMetaData={pillars.data}
          pillarsMetaDataLoading={pillars.isLoading}
        />
      </div>
    </GlobalDataContext.Provider>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    const { pillarsMetaData, countryTaxonomyData } = useGlobalDataContext();
    return (
      <Homepage
        pillarsMetaData={pillarsMetaData}
        countryTaxonomy={countryTaxonomyData}
      />
    );
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
  component: function Methodology() {
    return <MethodologyPage />;
  },
});

function MainIndicator() {
  const { indicator } = mainIndicatorRoute.useParams();
  const {
    pillarsMetaData,
    countryTaxonomyData,
    countryTaxonomyLoading,
    countryTaxonomyError,
  } = useGlobalDataContext();

  const pillarMetaData = pillarsMetaData.find(
    d => d.value.replaceAll(' ', '-').toLowerCase() === indicator,
  );
  if (!pillarMetaData)
    return (
      <div className='px-4 container-md mx-auto'>
        The indicator you are trying to search does not exist
      </div>
    );

  return (
    <MainIndicatorPageEl
      pillarMetaData={pillarMetaData}
      countryTaxonomyDataLoading={countryTaxonomyLoading}
      countryTaxonomyDataError={countryTaxonomyError}
      countryTaxonomy={countryTaxonomyData || []}
    />
  );
}

const mainIndicatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main-indicators/$indicator',
  component: MainIndicator,
});

function Country() {
  const { isoCode } = countryRoute.useParams();
  const {
    pillarsMetaData,
    countryTaxonomyData,
    countryTaxonomyLoading,
    countryTaxonomyError,
  } = useGlobalDataContext();

  if (countryTaxonomyLoading)
    return <Spinner size='lg' className='my-20 m-auto' />;
  if (countryTaxonomyError)
    return (
      <div className='px-4 container-md mx-auto'>
        <ErrorState />
      </div>
    );
  return (
    <CountryPageEl
      isoCode={isoCode}
      countryTaxonomy={countryTaxonomyData}
      pillarsMetaData={pillarsMetaData}
    />
  );
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
