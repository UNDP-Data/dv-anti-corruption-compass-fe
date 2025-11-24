import { Spinner } from '@undp/design-system-react/Spinner';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Label } from '@undp/design-system-react/Label';
import { Badge } from '@undp/design-system-react/Badge';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import { useEffect, useEffectEvent, useState } from 'react';
import { getTextColorBasedOnBgColor } from '@undp/data-viz/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@undp/design-system-react/HoverCard';
import { InfoIcon } from 'lucide-react';
import { Pagination } from '@undp/design-system-react/Pagination';

import { ParagraphText } from '../Typography';

import {
  DROPDOWN_CLASSNAMES_MULTI_SELECT,
  DROPDOWN_CLASSNAMES,
} from '@/Constants';
import { CountriesDataType, DataType, IndicatorsMetaDataType } from '@/Types';
import { customDropdownComponents } from '@/Utils/DropdownComponents';

interface Props {
  data: DataType[];
  indicatorsMetaData?: IndicatorsMetaDataType[];
  colors?: string[];
  countriesList: CountriesDataType[];
}

function DataTableWithFilters({
  data,
  indicatorsMetaData = [],
  colors = [],
  countriesList,
}: Props) {
  const [selectedPillars, setSelectedPillars] = useState<
    { value: string; label: string }[]
  >([
    {
      value: `${indicatorsMetaData.map(d => d.subIndicators).flat()[0].mainIndicatorId}_${indicatorsMetaData.map(d => d.subIndicators).flat()[0].subIndicatorId}`,
      label: indicatorsMetaData.map(d => d.subIndicators).flat()[0].name,
    },
  ]);
  const pageLength = 10;
  const [filteredData, setFilteredData] = useState(
    data.filter(
      d =>
        d.id ===
        `${indicatorsMetaData.map(d => d.subIndicators).flat()[0].mainIndicatorId}_${indicatorsMetaData.map(d => d.subIndicators).flat()[0].subIndicatorId}`,
    ),
  );
  const [page, setPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2022);
  const subIndicators = indicatorsMetaData.map(d => d.subIndicators).flat();

  const setFilteredDataEvent = useEffectEvent(() => {
    const filtered = data.filter(
      d =>
        selectedPillars?.findIndex(el => el.value === d.id) !== -1 &&
        d.year === selectedYear &&
        d.indicatorValue &&
        d.numericValue !== undefined &&
        d.numericValue !== null,
    );
    setFilteredData(filtered);
  });
  useEffect(() => {
    setFilteredDataEvent();
  }, [data, selectedPillars]);
  return (
    <div className='gap-4.5 flex flex-col w-full text-primary-gray-700'>
      <div className='flex justify-between w-full items-center'>
        <div className='gap-4 flex grow-1'>
          <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px] max-w-[480px] flex-wrap'>
            <Label className='text-primary-white'>Filter by year</Label>
            <DropdownSelect
              value={{
                value: selectedYear,
                label: selectedYear,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedYear(d.value);
              }}
              placeholder='Select contract value'
              options={data
                .map(d => d.year)
                .map(d => ({
                  value: d,
                  label: d,
                }))}
              size='base'
              variant='normal'
              className='bg-primary-white! border-0! rounded-full! px-4!'
              classNames={DROPDOWN_CLASSNAMES}
              isClearable={false}
              components={customDropdownComponents('light', false)}
            />
          </div>
          <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px] max-w-[480px] flex-wrap'>
            <Label className='text-primary-white'>Filter by pillar</Label>
            <DropdownSelect
              placeholder='Select Pillar'
              value={selectedPillars}
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                setSelectedPillars(d);
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
        <div>
          {data.length > 0 ? (
            filteredData
              .filter(
                (_el, i) =>
                  i < page * pageLength && i >= (page - 1) * pageLength,
              )
              .map((el, i) => {
                const tagColors =
                  colors.length > 0
                    ? colors
                    : subIndicators.find(
                        d =>
                          `${d.mainIndicatorId}_${d.subIndicatorId}` === el.id,
                      )?.colors || [];
                return (
                  <div key={i}>
                    <div className='flex w-full py-4 border-b border-b-[0.5px] border-b-primary-white items-center'>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[35%] pr-4!'>
                        {
                          countriesList.find(
                            c => c['Alpha-3 code'] === el.countryCode,
                          )?.['Country or Area (official name)']
                        }
                      </div>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[25%] pr-4!'>
                        {
                          indicatorsMetaData
                            .map(pd => pd.subIndicators)
                            .flat()
                            .find(
                              pd =>
                                `${pd.mainIndicatorId}_${pd.subIndicatorId}` ===
                                el.id,
                            )?.name
                        }
                      </div>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[20%] pr-4!'>
                        <Badge
                          rounded='full'
                          className='poppins-medium py-0 text-[12px]! px-3!'
                          style={{
                            backgroundColor: !el.indicatorValue
                              ? '#DADADA'
                              : ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                    el.indicatorValue,
                                  ) !== -1
                                ? tagColors[
                                    ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                      el.indicatorValue,
                                    )
                                  ]
                                : '#DADADA',
                            color: !el.indicatorValue
                              ? '#000'
                              : getTextColorBasedOnBgColor(
                                  ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                    el.indicatorValue,
                                  ) !== -1
                                    ? tagColors[
                                        ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                          el.indicatorValue,
                                        )
                                      ]
                                    : '#DADADA',
                                ),
                          }}
                        >
                          {el.indicatorValue}
                        </Badge>
                      </div>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[10%] pr-4!'>
                        {el.numericValue === null ||
                        el.numericValue === undefined
                          ? 'NA'
                          : el.numericValue.toFixed(2)}
                      </div>
                      <Link
                        to='/countries/$isoCode/{-$indicator}'
                        className='poppins-light text-[16px]! text-primary-white! w-[10%] pr-4! opacity-100 hover:opacity-80 underline underline-offset-4'
                        params={{ isoCode: el.countryCode }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
          ) : (
            <Spinner />
          )}
        </div>
        <Spacer size='5xl' />
        <Pagination
          total={filteredData.length}
          pageSize={pageLength}
          onChange={page => {
            setPage(page);
          }}
        />
      </div>
    </div>
  );
}

export default DataTableWithFilters;
