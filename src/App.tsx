import '@/styles/fonts.css';
import '@/styles/style.css';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Link,
} from '@tanstack/react-router';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Spinner } from '@undp/design-system-react/Spinner';
import { getCountryDetailsFromISO3 } from '@undp-data/data-utils';
import { createContext, useContext } from 'react';
import { Spacer } from '@undp/design-system-react/Spacer';

import Homepage from './01-Homepage';
import MethodologyPage from './04-Methodology';
import AboutUsPage from './05-AboutUs';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import CountryPageEl from './02-CountryPage';
import { ScrollToTop } from './Utils/ScrollToTop';
import {
  CountriesDataType,
  CountriesFromApiDataType,
  IndicatorsMetaDataType,
} from './Types';
import { ErrorState } from './Components/ErrorState';
import MainIndicatorPageEl from './03-MainIndicator';
import { getIndicatorsMetaData } from './QueryFn/getIndicatorsMetaData';
import { getCountriesList } from './QueryFn/getCountriesList';
import { HeadingText } from './Components/Typography';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

function useGlobalData() {
  const indicatorsMetaData = useQuery({
    queryKey: ['indicatorsMetaData'],
    queryFn: getIndicatorsMetaData,
    select: data =>
      data.map((c: IndicatorsMetaDataType) => ({
        ...c,
        subIndicators: c.subIndicators.map(d => ({
          ...d,
          id: `${d.mainIndicatorId}_${d.subIndicatorId}`,
        })),
      })),
  });
  const countriesList = useQuery({
    queryKey: ['countriesList'],
    queryFn: getCountriesList,
    select: countries =>
      countries
        .map((c: CountriesFromApiDataType) =>
          getCountryDetailsFromISO3(c.countryCode),
        )
        .filter((c?: CountriesDataType) => c !== undefined),
  });
  return { indicatorsMetaData, countriesList };
}

type GlobalDataContextType = {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesListData: CountriesDataType[];
  countriesListLoading: boolean;
  countriesListError: boolean;
};

const GlobalDataContext = createContext<GlobalDataContextType | null>(null);

export function useGlobalDataContext() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx)
    throw new Error('useGlobalDataContext must be used inside provider');
  return ctx;
}

function RootComponent() {
  const { indicatorsMetaData, countriesList } = useGlobalData();

  const isLoading = indicatorsMetaData.isLoading;
  const isError = indicatorsMetaData.isError;

  if (isLoading) return <Spinner size='lg' className='my-20 m-auto' />;
  if (isError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );

  return (
    <GlobalDataContext.Provider
      value={{
        indicatorsMetaData: indicatorsMetaData.data,
        countriesListData: countriesList.data,
        countriesListLoading: countriesList.isLoading,
        countriesListError: countriesList.isError,
      }}
    >
      <div className='min-h-screen flex flex-col background-inherit'>
        <Header
          indicatorsMetaData={indicatorsMetaData.data || []}
          countriesListData={countriesList.data}
          countriesListDataLoading={countriesList.isLoading}
          countriesListDataError={countriesList.isError}
        />
        <main className='flex-1 pt-30'>
          <ScrollToTop />
          <Outlet />
        </main>
        <Footer
          indicatorsMetaData={indicatorsMetaData.data}
          indicatorsMetaDataLoading={indicatorsMetaData.isLoading}
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
    const {
      indicatorsMetaData,
      countriesListData,
      countriesListLoading,
      countriesListError,
    } = useGlobalDataContext();
    return (
      <Homepage
        indicatorsMetaData={indicatorsMetaData}
        countriesList={countriesListData}
        countriesListLoading={countriesListLoading}
        countriesListError={countriesListError}
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
    indicatorsMetaData,
    countriesListData,
    countriesListLoading,
    countriesListError,
  } = useGlobalDataContext();

  const indicatorMetaData = indicatorsMetaData.find(
    d => d.name.replaceAll(' ', '-').toLowerCase() === indicator,
  );
  if (!indicatorMetaData)
    return (
      <div className='px-4 container mx-auto'>
        The indicator you are trying to search does not exist
      </div>
    );

  return (
    <MainIndicatorPageEl
      indicatorMetaData={indicatorMetaData}
      countriesListDataLoading={countriesListLoading}
      countriesListDataError={countriesListError}
      countriesList={countriesListData || []}
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
    indicatorsMetaData,
    countriesListData,
    countriesListLoading,
    countriesListError,
  } = useGlobalDataContext();
  if (countriesListLoading)
    return <Spinner size='lg' className='my-20 m-auto' />;
  if (countriesListError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );
  return (
    <CountryPageEl
      isoCode={isoCode}
      countriesList={countriesListData}
      indicatorsMetaData={indicatorsMetaData}
    />
  );
}

function CountriesListing() {
  const { countriesListData, countriesListLoading, countriesListError } =
    useGlobalDataContext();
  if (countriesListLoading)
    return <Spinner size='lg' className='my-20 m-auto' />;
  if (countriesListError)
    return (
      <div className='px-4 container mx-auto'>
        <ErrorState />
      </div>
    );

  const alphabets = [
    ...new Set(
      countriesListData.map(d =>
        d['Country or Area (official name)'][0].toUpperCase(),
      ),
    ),
  ];
  return (
    <div className='container mx-auto'>
      <HeadingText type='h2'>Country profile</HeadingText>
      <Spacer size='6xl' />
      {alphabets.map((d, i) => (
        <div key={i}>
          <HeadingText type='h2'>{d}</HeadingText>
          <Spacer size='2xl' />
          <div className='flex flex-wrap gap-4'>
            {countriesListData
              .filter(
                el =>
                  el['Country or Area (official name)'][0].toUpperCase() === d,
              )
              .map((el, j) => (
                <Link
                  to='/countries/$isoCode'
                  params={{ isoCode: el['Alpha-3 code'] }}
                  className='poppins-medium w-[calc(25%-0.75rem)] !text-[16px] text-[#fff]'
                  key={j}
                >
                  {el['Country or Area (official name)']}
                </Link>
              ))}
          </div>
          <Spacer size='6xl' />
        </div>
      ))}
    </div>
  );
}
const countriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/countries',
  component: CountriesListing,
});

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
  countriesRoute,
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
