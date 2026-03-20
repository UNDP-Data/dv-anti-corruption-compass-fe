import { useEffect, useMemo, useRef, useState } from 'react';

import { DataType, IndicatorsMetaDataType } from '@/Types';
import { getFactsPage } from '@/QueryFn/getFactsPage';
import {
  loadHomepageFactsCache,
  saveHomepageFactsCache,
} from '@/Utils/homepageFactsCache';
import { getHomepageDefaultSubIndicatorId } from './homepagePreferredSubIndicators';

const DEFAULT_PAGE_SIZE = 1000;

function indicatorId(mainIndicatorId: number, subIndicatorId: number) {
  return `${mainIndicatorId}_${subIndicatorId}`;
}

function parseCombinedId(id: string): { mainIndicatorId: number; subIndicatorId: number } {
  const [m, s] = id.split('_');
  return { mainIndicatorId: parseInt(m, 10), subIndicatorId: parseInt(s, 10) };
}

type AvailabilityKey = `${string}|${string}`; // `${countryCode}|${indicatorId}`

export function useIncrementalHomepageFacts(options: {
  indicatorsMetaData: IndicatorsMetaDataType[];
  firstPillarsCount: number;
}) {
  const { indicatorsMetaData, firstPillarsCount } = options;

  const cached = useMemo(() => loadHomepageFactsCache(), []);

  const [facts, setFacts] = useState<DataType[]>([]);
  const [factsLoading, setFactsLoading] = useState(true);
  const [factsError, setFactsError] = useState(false);
  const [globeAvailability, setGlobeAvailability] = useState(
    cached?.globeAvailability || [],
  );

  const factsByIdRef = useRef<Map<number, DataType>>(new Map());
  const availabilityRef = useRef<Map<AvailabilityKey, number>>(new Map());
  const loadedIndicatorIdsRef = useRef<Set<string>>(new Set());
  const abortRef = useRef<boolean>(false);

  // seed availability map from cache
  useEffect(() => {
    if (!cached?.globeAvailability) return;
    for (const a of cached.globeAvailability) {
      availabilityRef.current.set(
        `${a.countryCode}|${a.indicatorId}` as AvailabilityKey,
        a.year,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstTargets = useMemo(() => {
    const activeIndicators = indicatorsMetaData.filter(d => !d.comingSoon);

    // Priority load: Public Procurement + World Bank Enterprise Survey
    const priority = activeIndicators
      .filter(ind => {
        const name = (ind.name || '').toLowerCase();
        return (
          name.includes('public procurement') ||
          name.includes('enterprise survey') ||
          name.includes('enterprise surveys') ||
          name.includes('world bank')
        );
      })
      // Ensure deterministic order: Public Procurement first, then WBES
      .sort((a, b) => {
        const an = (a.name || '').toLowerCase();
        const bn = (b.name || '').toLowerCase();
        const score = (n: string) =>
          n.includes('public procurement')
            ? 0
            : n.includes('enterprise survey') ||
                n.includes('enterprise surveys') ||
                n.includes('world bank')
              ? 1
              : 2;
        return score(an) - score(bn);
      });

    const chosen =
      priority.length >= firstPillarsCount
        ? priority.slice(0, firstPillarsCount)
        : [...priority, ...activeIndicators.filter(i => !priority.includes(i))].slice(
            0,
            firstPillarsCount,
          );

    return Array.from(
      new Set(chosen.map(ind => getHomepageDefaultSubIndicatorId(ind)).filter(Boolean)),
    );
  }, [indicatorsMetaData, firstPillarsCount]);

  const backgroundTargets = useMemo(() => {
    const activeIndicators = indicatorsMetaData.filter(d => !d.comingSoon);
    const all = activeIndicators.flatMap(ind => ind.subIndicators.map(s => s.id));
    const remaining = all.filter(id => id && !firstTargets.includes(id));
    return Array.from(new Set(remaining));
  }, [indicatorsMetaData, firstTargets]);

  const recomputeDerived = () => {
    const availability: { countryCode: string; indicatorId: string; year: number }[] =
      [];
    availabilityRef.current.forEach((year, key) => {
      const [countryCode, indId] = key.split('|');
      availability.push({ countryCode, indicatorId: indId, year });
    });
    setGlobeAvailability(availability);

    const countriesYes = [
      ...new Set(availability.map(a => a.countryCode)),
    ].map(d => ({ id: d, x: 'Yes' as const }));
    saveHomepageFactsCache({ countriesYes, globeAvailability: availability });
  };

  const mergeFactsPage = (page: unknown[], mainIndicatorId: number, subIndicatorId: number) => {
    let changed = false;
    for (const raw of page as DataType[]) {
      const factId = raw.factId as unknown as number;
      if (!factsByIdRef.current.has(factId)) {
        const mapped: DataType = {
          ...raw,
          id: indicatorId(mainIndicatorId, subIndicatorId),
        };
        factsByIdRef.current.set(factId, mapped);
        changed = true;
        if (mapped.numericValue !== null && mapped.numericValue !== undefined) {
          const key = `${mapped.countryCode}|${mapped.id}` as AvailabilityKey;
          const prev = availabilityRef.current.get(key);
          if (prev === undefined || mapped.year > prev) {
            availabilityRef.current.set(key, mapped.year);
          }
        }
      }
    }
    if (changed) {
      setFacts(Array.from(factsByIdRef.current.values()));
      recomputeDerived();
    }
  };

  async function fetchAllPagesForSubIndicator(combinedId: string) {
    const { mainIndicatorId, subIndicatorId } = parseCombinedId(combinedId);
    if (loadedIndicatorIdsRef.current.has(combinedId)) return;
    loadedIndicatorIdsRef.current.add(combinedId);

    let page = 1;
    // keep paging until page returns < pageSize
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (abortRef.current) return;
      const data = await getFactsPage({
        mainIndicatorId,
        subIndicatorId,
        regionId: null,
        productMarketId: null,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      if (abortRef.current) return;
      if (Array.isArray(data) && data.length > 0) {
        mergeFactsPage(data, mainIndicatorId, subIndicatorId);
      }
      if (!Array.isArray(data) || data.length < DEFAULT_PAGE_SIZE) break;
      page += 1;
    }
  }

  useEffect(() => {
    abortRef.current = false;
    setFactsError(false);
    setFactsLoading(true);

    (async () => {
      try {
        // StageA: first N pillars default sub-indicators (parallel)
        await Promise.all(firstTargets.map(t => fetchAllPagesForSubIndicator(t)));
        if (abortRef.current) return;
        setFactsLoading(false);

        // StageB: remaining sub-indicators (sequential background)
        for (const t of backgroundTargets) {
          if (abortRef.current) return;
          if (loadedIndicatorIdsRef.current.has(t)) continue;
          // eslint-disable-next-line no-await-in-loop
          await fetchAllPagesForSubIndicator(t);
        }
      } catch {
        if (abortRef.current) return;
        setFactsError(true);
        setFactsLoading(false);
      }
    })();

    return () => {
      abortRef.current = true;
    };
  }, [firstTargets, backgroundTargets]);

  return {
    facts,
    factsLoading,
    factsError,
    globeAvailability,
    cachedCountriesYes: cached?.countriesYes || [],
  };
}

