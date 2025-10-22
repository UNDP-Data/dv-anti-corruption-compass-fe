import { Spacer } from '@undp/design-system-react/Spacer';
import { Label } from '@undp/design-system-react/Label';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { useState } from 'react';

import Overview from './Overview';
import ProcurementViz from './ProcurementViz';
import { CountrySelectionSection } from './Components/CountrySelectionSection';

import {
  CountryTaxonomyDataType,
  PillarsMetaDataType,
  SubPillarsMetaDataType,
} from '@/Types';
import { DROPDOWN_CLASSNAMES, YEARS } from '@/Constants';
import { customDropdownComponents } from '@/Utils/DropdownComponents';

interface Props {
  pillarMetaData: PillarsMetaDataType;
  countryTaxonomy: CountryTaxonomyDataType[];
  countryTaxonomyDataError: boolean;
  countryTaxonomyDataLoading: boolean;
}

function MainIndicatorPageEl({
  pillarMetaData,
  countryTaxonomy,
  countryTaxonomyDataLoading,
  countryTaxonomyDataError,
}: Props) {
  const [selectedPillar, setSelectedPillar] = useState<string>(
    pillarMetaData.subPillars[0].value,
  );
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  return (
    <div className='w-full'>
      <Overview
        title={pillarMetaData.value}
        description={pillarMetaData.description}
      />
      <div className='container mx-auto'>
        <Spacer size='6xl' />
        <div className='flex items-center gap-4 w-full'>
          <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
            <Label className='text-primary-white'>Sub-pillar</Label>
            <DropdownSelect
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedPillar(d.value);
              }}
              value={{ value: selectedPillar, label: selectedPillar }}
              options={pillarMetaData.subPillars.map(d => ({
                value: d.value,
                label: d.value,
              }))}
              size='base'
              variant='normal'
              className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
              classNames={DROPDOWN_CLASSNAMES}
              components={customDropdownComponents('dark', false)}
            />
          </div>
          <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px]'>
            <Label className='text-primary-white'>Year</Label>
            <DropdownSelect
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedYear(d.value);
              }}
              value={{ value: selectedYear, label: selectedYear }}
              options={YEARS.map(d => ({ value: d, label: d }))}
              size='base'
              variant='normal'
              className='bg-[var(--color-white-bg)]! poppins-regular border-0! rounded-[8px]!'
              classNames={DROPDOWN_CLASSNAMES}
              components={customDropdownComponents('dark', false)}
            />
          </div>
        </div>
        <Spacer size='2xl' />
        {pillarMetaData.id === 'publicProcurement' ? (
          <ProcurementViz
            pillarMetaData={
              pillarMetaData.subPillars.find(
                d => d.value === selectedPillar,
              ) as SubPillarsMetaDataType
            }
            year={selectedYear}
          />
        ) : null}
      </div>
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
