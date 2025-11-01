import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseJSON } from '@undp/data-viz/fetchAndParseData';
import { Spinner } from '@undp/design-system-react/Spinner';

import Overview from './Overview';
import ProcurementViz from './ProcurementViz';
import { CountrySelectionSection } from './Components/CountrySelectionSection';

import {
  CountryTaxonomyDataType,
  IndicatorDataType,
  PillarsMetaDataType,
  SubPillarsMetaDataType,
} from '@/Types';
import { DROPDOWN_CLASSNAMES } from '@/Constants';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { ErrorState } from '@/Components/ErrorState';

interface Props {
  pillarMetaData: PillarsMetaDataType;
  countryTaxonomy: CountryTaxonomyDataType[];
  countryTaxonomyDataError: boolean;
  countryTaxonomyDataLoading: boolean;
}

async function fetchData(pillarId: string) {
  return fetchAndParseJSON(`/data/${pillarId}.json`);
}

function usePillarData(indicator: string) {
  const pillars = useQuery({
    queryKey: [`pillarData-${indicator}`],
    queryFn: () => fetchData(indicator),
  });
  return { pillars };
}
function MainIndicatorPageEl({
  pillarMetaData,
  countryTaxonomy,
  countryTaxonomyDataLoading,
  countryTaxonomyDataError,
}: Props) {
  const { pillars } = usePillarData(pillarMetaData.id);
  const { data, isLoading, isError } = pillars;
  const [selectedPillar, setSelectedPillar] = useState({
    value: pillarMetaData.subPillars[0].id,
    label: pillarMetaData.subPillars[0].value,
  });
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  return (
    <div className='w-full'>
      <Overview
        title={pillarMetaData.value}
        description={pillarMetaData.description}
      />
      {isLoading && <Spinner size='lg' className='my-20 m-auto' />}
      {isError && (
        <div className='px-4 container mx-auto'>
          <ErrorState />
        </div>
      )}
      {data && (
        <div className='container mx-auto'>
          <div className='flex items-center gap-4 w-full'>
            <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
              <Label className='text-primary-white'>Sub-pillar</Label>
              <DropdownSelect
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(d: any) => {
                  setSelectedPillar(d);
                }}
                value={selectedPillar}
                options={pillarMetaData.subPillars.map(d => ({
                  value: d.id,
                  label: d.value,
                }))}
                size='base'
                variant='normal'
                className='poppins-regular border-0! rounded-[100px]! px-2!'
                classNames={DROPDOWN_CLASSNAMES}
                components={customDropdownComponents('light', false)}
              />
            </div>
            <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
              <Label className='text-primary-white'>Year</Label>
              <DropdownSelect
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(d: any) => {
                  setSelectedYear(d.value);
                }}
                defaultValue={{
                  value: Math.max(
                    ...(data as IndicatorDataType[]).map(d => d.Year),
                  ),
                  label: Math.max(
                    ...(data as IndicatorDataType[]).map(d => d.Year),
                  ),
                }}
                value={
                  selectedYear
                    ? { value: selectedYear, label: selectedYear }
                    : undefined
                }
                options={[
                  ...new Set((data as IndicatorDataType[]).map(d => d.Year)),
                ].map(d => ({
                  value: d,
                  label: d,
                }))}
                size='base'
                variant='normal'
                className='poppins-regular border-0! rounded-[100px]! px-2!'
                classNames={DROPDOWN_CLASSNAMES}
                components={customDropdownComponents('light', false)}
              />
            </div>
          </div>
          <Spacer size='2xl' />
          {pillarMetaData.id === 'publicProcurement' ? (
            <ProcurementViz
              subPillarMetaData={
                pillarMetaData.subPillars.find(
                  d => d.value === selectedPillar.label,
                ) as SubPillarsMetaDataType
              }
              year={
                selectedYear ||
                Math.max(...(data as IndicatorDataType[]).map(d => d.Year))
              }
              countryTaxonomy={countryTaxonomy}
              data={data}
            />
          ) : null}
        </div>
      )}
      <Spacer size='6xl' />
      {!countryTaxonomyDataError && (
        <CountrySelectionSection
          indicator={pillarMetaData.value.toLowerCase()}
          countryTaxonomy={countryTaxonomy || []}
          loading={countryTaxonomyDataLoading}
        />
      )}
    </div>
  );
}

export default MainIndicatorPageEl;
