import { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Label } from '@undp/design-system-react/Label';
import { Badge } from '@undp/design-system-react/Badge';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@undp/design-system-react/HoverCard';
import { InfoIcon } from 'lucide-react';
import { Spinner } from '@undp/design-system-react/Spinner';
import { getTextColorBasedOnBgColor } from '@undp/data-viz/utils';

import { ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';
import {
  DROPDOWN_CLASSNAMES,
  DROPDOWN_CLASSNAMES_MULTI_SELECT,
} from '@/Constants';
import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { getFactsPage } from '@/QueryFn/getFactsPage';
import { useIsMobileBreakpoint } from '@/Utils/useIsMobileBreakpoint';

import seededFactsStageA from '@/static/factsStageA.json';

interface Props {
  indicatorsMetaData: IndicatorsMetaDataType[];
  countriesList: CountriesDataType[];
}

const DEFAULT_PAGE_SIZE = 50;

const seededFactsStageAData = seededFactsStageA as unknown as DataType[];

function yearsList(): { value: number; label: number }[] {
  const start = 2006;
  const end = new Date().getFullYear();
  const years: { value: number; label: number }[] = [];
  for (let y = end; y >= start; y -= 1) years.push({ value: y, label: y });
  return years;
}

function parseCombinedId(id: string): { mainIndicatorId: number; subIndicatorId: number } {
  const [m, s] = id.split('_');
  return { mainIndicatorId: parseInt(m, 10), subIndicatorId: parseInt(s, 10) };
}

export function PagedDataTableWithFilters({ indicatorsMetaData, countriesList }: Props) {
  const isMobile = useIsMobileBreakpoint();
  const subIndicators = indicatorsMetaData.map(d => d.subIndicators).flat();

  const defaultSub = subIndicators[0];
  const [selectedPillars, setSelectedPillars] = useState<
    { value: string; label: string }[]
  >(
    defaultSub
      ? [
          {
            value: `${defaultSub.mainIndicatorId}_${defaultSub.subIndicatorId}`,
            label: defaultSub.name,
          },
        ]
      : [],
  );

  const [selectedYear, setSelectedYear] = useState(2022);
  const [page, setPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;

  const selectedIds = useMemo(
    () => selectedPillars.map(p => p.value).filter(Boolean),
    [selectedPillars],
  );

  const countryNameByCode = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of countriesList) {
      const code = c['Alpha-3 code'];
      m.set(code, c['Country or Area (official name)'] || code);
    }
    return m;
  }, [countriesList]);

  const seededInitialData = useMemo(() => {
    if (seededFactsStageAData.length === 0) {
      return { rows: [] as DataType[], hasNext: false };
    }

    if (selectedIds.length === 0) {
      return { rows: [] as DataType[], hasNext: false };
    }

    const selectedIdsSet = new Set(selectedIds);
    const offset = (page - 1) * pageSize;

    const factsForRequest = seededFactsStageAData.filter(d => {
      if (d.year !== selectedYear) return false;
      if (!d.indicatorValue) return false;
      if (d.numericValue === null || d.numericValue === undefined) return false;
      const combinedId = `${d.mainIndicatorId}_${d.subIndicatorId}`;
      return selectedIdsSet.has(combinedId);
    });

    const hasNext = selectedIds.some(combinedId => {
      const totalForId = factsForRequest.filter(
        d => `${d.mainIndicatorId}_${d.subIndicatorId}` === combinedId,
      ).length;
      return totalForId > offset + pageSize;
    });

    // Approximate server-side paging by taking `pageSize` from each pillar slice
    // before the final global alphabetical sort (matches the intended UX).
    const mergedPerPillar: DataType[] = [];
    for (const combinedId of selectedIds) {
      const factsForId = factsForRequest.filter(
        d => `${d.mainIndicatorId}_${d.subIndicatorId}` === combinedId,
      );

      factsForId.sort((a, b) => {
        const an = countryNameByCode.get(a.countryCode) || a.countryCode;
        const bn = countryNameByCode.get(b.countryCode) || b.countryCode;
        return an.localeCompare(bn);
      });

      // The query uses `page` and `pageSize` per pillar.
      const pageSlice = factsForId.slice(offset, offset + pageSize).map(d => ({
        ...d,
        id: combinedId,
      }));
      mergedPerPillar.push(...pageSlice);
    }

    mergedPerPillar.sort((a, b) => {
      const an = countryNameByCode.get(a.countryCode) || a.countryCode;
      const bn = countryNameByCode.get(b.countryCode) || b.countryCode;
      return an.localeCompare(bn);
    });

    return { rows: mergedPerPillar, hasNext };
  }, [
    countriesList,
    countryNameByCode,
    page,
    pageSize,
    selectedIds,
    selectedYear,
  ]);

  const query = useQuery({
    queryKey: ['factsTable', selectedYear, selectedIds, page, pageSize],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const calls = selectedIds.map(async combinedId => {
        const { mainIndicatorId, subIndicatorId } = parseCombinedId(combinedId);
        const data = await getFactsPage({
          mainIndicatorId,
          subIndicatorId,
          year: selectedYear,
          regionId: null,
          productMarketId: null,
          page,
          pageSize,
        });
        return { combinedId, data };
      });

      const results = await Promise.all(calls);
      const merged: DataType[] = [];
      let hasNext = false;

      for (const r of results) {
        if (Array.isArray(r.data)) {
          if (r.data.length === pageSize) hasNext = true;
          for (const raw of r.data as DataType[]) {
            merged.push({
              ...raw,
              id: r.combinedId,
            });
          }
        }
      }

      // Filter down to usable numeric facts and stable sort by country name
      const filtered = merged.filter(
        d =>
          d.year === selectedYear &&
          d.indicatorValue &&
          d.numericValue !== undefined &&
          d.numericValue !== null,
      );
      filtered.sort((a, b) => {
        const an =
          countriesList.find(c => c['Alpha-3 code'] === a.countryCode)?.[
            'Country or Area (official name)'
          ] || a.countryCode;
        const bn =
          countriesList.find(c => c['Alpha-3 code'] === b.countryCode)?.[
            'Country or Area (official name)'
          ] || b.countryCode;
        return an.localeCompare(bn);
      });

      return { rows: filtered, hasNext };
    },
    // Seed instantly from bundled facts so the "See Full List" table doesn't block on the first API page(s).
    initialData: seededInitialData,
    initialDataUpdatedAt: 0,
  });

  const rows = query.data?.rows || [];
  const hasNext = query.data?.hasNext || false;
  const isBusy = query.isFetching;

  return (
    <div className='gap-4.5 flex flex-col w-full text-primary-gray-700'>
      <div className='flex flex-col lg:flex-row justify-between w-full items-start lg:items-center gap-4'>
        <div className='gap-4 flex flex-col lg:flex-row grow-1 w-full lg:w-auto'>
          <div className='flex flex-col gap-1 w-full lg:w-[calc(25%-0.75rem)] grow-1 lg:min-w-[240px] lg:max-w-[480px] flex-wrap'>
            <Label className='text-primary-white'>Filter by year</Label>
            <DropdownSelect
              value={{ value: selectedYear, label: selectedYear }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedYear(d.value);
                setPage(1);
              }}
              options={yearsList()}
              size='base'
              variant='normal'
              className='bg-primary-white! border-0! rounded-full! px-4!'
              classNames={DROPDOWN_CLASSNAMES}
              isClearable={false}
              components={customDropdownComponents('light', false)}
            />
          </div>
          <div className='flex flex-col gap-1 w-full lg:w-[calc(25%-0.75rem)] grow-1 lg:min-w-[240px] lg:max-w-[480px] flex-wrap'>
            <Label className='text-primary-white'>Filter by pillar</Label>
            <DropdownSelect
              placeholder='Select Pillar'
              value={selectedPillars}
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedPillars(d);
                setPage(1);
              }}
              options={indicatorsMetaData.map(d => ({
                label: d.name,
                options: d.subIndicators.map(el => ({
                  value: `${el.mainIndicatorId}_${el.subIndicatorId}`,
                  label: el.name,
                })),
              }))}
              size='base'
              variant='normal'
              className='bg-primary-white! border-0! rounded-full! px-4!'
              classNames={DROPDOWN_CLASSNAMES_MULTI_SELECT}
              isClearable={false}
              components={customDropdownComponents('light', true)}
              maxTagCount={2}
            />
          </div>
        </div>
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <div className='flex gap-2 items-center mt-6'>
              <ParagraphText
                weight='medium'
                marginBottom='none'
                className='p-0 leading-normal'
              >
                Data availability
              </ParagraphText>
              <InfoIcon color='#fff' size={16} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className='rounded text-[12px] poppins-regular !leading-[150%] p-3 rounded-[8px] text-[#4D4D4D] w-60'>
            Use the filters to see a list of countries with data for the chosen
            corruption-related indicator(s) and year. Public procurement
            indicators are available for the years 2017 to 2024. World Bank
            Enterprise Survey data is available for the years 2006 to 2025.
            Countries are listed in alphabetical order.
          </HoverCardContent>
        </HoverCard>
      </div>

      <Spacer size='lg' />

      <div className='dark'>
        {!isMobile && (
          <div className='flex items-center justify-between'>
            <div className='flex w-full pb-2 border-b border-b-primary-white'>
              <div className='poppins-semibold text-[16px]! text-primary-white! w-[35%] pr-4!'>
                Country name
              </div>
              <div className='poppins-semibold text-[16px]! text-primary-white! w-[25%] pr-4!'>
                Pillar
              </div>
              <div className='poppins-semibold text-[16px]! text-primary-white! w-[20%] pr-4!'>
                Indicator value
              </div>
              <div className='poppins-semibold text-[16px]! text-primary-white! w-[10%] pr-4!'>
                Value
              </div>
              <div className='poppins-semibold text-[16px]! text-primary-white! w-[10%] pr-4!' />
            </div>
          </div>
        )}

        {query.isLoading && <Spinner size='lg' className='my-10 m-auto' />}

        <div className='mt-2'>
          {rows.map((el, i) => {
            const tagColors =
              subIndicators
                .find(
                  d => `${d.mainIndicatorId}_${d.subIndicatorId}` === el.id,
                )
                ?.colors?.split(',') || [];

            const countryName =
              countriesList.find(c => c['Alpha-3 code'] === el.countryCode)?.[
                'Country or Area (official name)'
              ] || el.countryCode;
            const pillarName =
              subIndicators.find(
                pd => `${pd.mainIndicatorId}_${pd.subIndicatorId}` === el.id,
              )?.name || '';
            const valueStr =
              el.numericValue === null || el.numericValue === undefined
                ? 'NA'
                : el.numericValue.toFixed(2) +
                  (indicatorsMetaData.find(
                    d => d.mainIndicatorId === el.mainIndicatorId,
                  )?.suffix || '');
            const badgeBg =
              el.indicatorValue === null
                ? '#DADADA'
                : ['LOW', 'MEDIUM', 'HIGH'].indexOf(el.indicatorValue) !== -1
                  ? tagColors[
                      ['LOW', 'MEDIUM', 'HIGH'].indexOf(el.indicatorValue)
                    ]
                  : '#DADADA';
            const badgeColor =
              el.indicatorValue === null
                ? '#000'
                : getTextColorBasedOnBgColor(
                    ['LOW', 'MEDIUM', 'HIGH'].indexOf(el.indicatorValue) !== -1
                      ? tagColors[
                          ['LOW', 'MEDIUM', 'HIGH'].indexOf(el.indicatorValue)
                        ]
                      : '#DADADA',
                  );

            return (
              <div key={`${el.factId}-${i}`}>
                {isMobile ? (
                  <div className='py-4 border-b border-b-[0.5px] border-b-primary-white'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='poppins-medium text-[14px] text-primary-white'>
                        {countryName}
                      </span>
                      <Link
                        to='/countries/$isoCode/{-$indicator}'
                        className='poppins-medium text-[13px] text-primary-white opacity-100 hover:opacity-80 underline underline-offset-4 shrink-0 ml-2'
                        params={{ isoCode: el.countryCode }}
                      >
                        View Details
                      </Link>
                    </div>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <span className='poppins-light text-[13px] text-primary-white'>
                        {pillarName}
                      </span>
                      <Badge
                        rounded='full'
                        className='poppins-medium py-0 text-[11px]! px-2!'
                        style={{
                          backgroundColor: badgeBg,
                          color: badgeColor,
                        }}
                      >
                        {el.indicatorValue}
                      </Badge>
                      <span className='poppins-light text-[13px] text-primary-white'>
                        {valueStr}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='flex w-full py-4 border-b border-b-[0.5px] border-b-primary-white items-center'>
                    <div className='poppins-light text-[16px]! text-primary-white! w-[35%] pr-4!'>
                      {countryName}
                    </div>
                    <div className='poppins-light text-[16px]! text-primary-white! w-[25%] pr-4!'>
                      {pillarName}
                    </div>
                    <div className='poppins-light text-[16px]! text-primary-white! w-[20%] pr-4!'>
                      <Badge
                        rounded='full'
                        className='poppins-medium py-0 text-[12px]! px-3!'
                        style={{
                          backgroundColor: badgeBg,
                          color: badgeColor,
                        }}
                      >
                        {el.indicatorValue}
                      </Badge>
                    </div>
                    <div className='poppins-light text-[16px]! text-primary-white! w-[10%] pr-4!'>
                      {valueStr}
                    </div>
                    <Link
                      to='/countries/$isoCode/{-$indicator}'
                      className='poppins-light text-[16px]! text-primary-white! w-[10%] pr-4! opacity-100 hover:opacity-80 underline underline-offset-4'
                      params={{ isoCode: el.countryCode }}
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Spacer size='4xl' />

        <div className='flex items-center justify-between'>
          <ParagraphText className='text-primary-white'>
            Page {page}
            {isBusy ? ' (loading…) ' : ''}
          </ParagraphText>
          <div className='flex gap-3'>
            <Button
              variant='secondary'
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isBusy}
            >
              Prev
            </Button>
            <Button
              variant='secondary'
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext || isBusy}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

