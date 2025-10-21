import { Spinner } from '@undp/design-system-react/Spinner';
import { DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Label } from '@undp/design-system-react/Label';
import { Badge } from '@undp/design-system-react/Badge';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import { useState } from 'react';
import { getTextColorBasedOnBgColor } from '@undp/data-viz/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@undp/design-system-react/HoverCard';
import { InfoIcon } from 'lucide-react';

import {
  DROPDOWN_CLASSNAMES_MULTI_SELECT,
  DROPDOWN_CLASSNAMES_WHITE,
  YEARS,
} from '@/Constants';
import { DataType, PillarsMetaDataType } from '@/Types';
import { customDropdownComponents } from '@/Utils/DropdownComponents';
import { ParagraphText } from '@/Components/Typography';

interface Props {
  data: DataType[];
  pillarsMetaData: PillarsMetaDataType[];
}

function DataTable({ data, pillarsMetaData }: Props) {
  const [selectedPillars, setSelectedPillars] = useState<string[]>([
    'Contract Modifications',
  ]);
  const [selectedYear, setSelectedYear] = useState(2022);
  const subPillars = pillarsMetaData.map(d => d.subPillars).flat();
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
              options={YEARS.map(d => ({
                value: d,
                label: d,
              }))}
              size='base'
              variant='normal'
              className='bg-primary-white! border-0! rounded-[8px]!'
              classNames={DROPDOWN_CLASSNAMES_WHITE}
              isClearable={false}
              components={customDropdownComponents('light', false)}
            />
          </div>
          <div className='flex flex-col gap-1 w-[calc(25%-0.75rem)] grow-1 min-w-[240px] max-w-[480px] flex-wrap'>
            <Label className='text-primary-white'>Filter by pillar</Label>
            <DropdownSelect
              placeholder='Select Pillar'
              value={selectedPillars.map(d => ({
                value: d,
                label: d,
              }))}
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(d: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setSelectedPillars(d.map((el: any) => el.value));
              }}
              options={pillarsMetaData.map(d => ({
                label: d.value,
                options: d.subPillars.map(el => ({
                  value: el.value,
                  label: el.value,
                })),
              }))}
              size='base'
              variant='normal'
              className='bg-primary-white! border-0! rounded-[8px]!'
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </HoverCardContent>
        </HoverCard>
      </div>
      <Spacer size='lg' />
      <div className='dark'>
        <div className='flex w-full pb-2 border-b border-b-primary-white'>
          <div className='poppins-bold text-[16px]! text-primary-white! w-[35%] pr-4!'>
            Country name
          </div>
          <div className='poppins-bold text-[16px]! text-primary-white! w-[25%] pr-4!'>
            Pillar
          </div>
          <div className='poppins-bold text-[16px]! text-primary-white! w-[20%] pr-4!'>
            Indicator value
          </div>
          <div className='poppins-bold text-[16px]! text-primary-white! w-[10%] pr-4!'>
            Value
          </div>
          <div className='poppins-bold text-[16px]! text-primary-white! w-[10%] pr-4!' />
        </div>
        <div className='max-h-[600px] undp-scrollbar'>
          {data.length > 0 ? (
            data.map((el, i) => (
              <div key={i}>
                {selectedPillars.map((p, j) => (
                  <div
                    className='flex w-full py-4 border-b border-b-primary-white items-center'
                    key={j}
                  >
                    <div className='poppins-regular text-[16px]! text-primary-white! w-[35%] pr-4!'>
                      {el.country}
                    </div>
                    <div className='poppins-regular text-[16px]! text-primary-white! w-[25%] pr-4!'>
                      {p}
                    </div>
                    <div className='poppins-regular text-[16px]! text-primary-white! w-[20%] pr-4!'>
                      <Badge
                        rounded='full'
                        className='poppins-regular'
                        style={{
                          backgroundColor: subPillars.find(d => d.value === p)
                            ?.colors[['Low', 'Medium', 'High'].indexOf(el.x)],
                          color: getTextColorBasedOnBgColor(
                            subPillars.find(d => d.value === p)?.colors[
                              ['Low', 'Medium', 'High'].indexOf(el.x)
                            ] || '#000000',
                          ),
                        }}
                      >
                        {el.x}
                      </Badge>
                    </div>
                    <div className='poppins-regular text-[16px]! text-primary-white! w-[10%] pr-4!'>
                      0.25
                    </div>
                    <Link
                      to='/countries/$isoCode'
                      className='poppins-regular text-[16px]! text-primary-white! w-[10%] pr-4! opacity-100 hover:opacity-80 underline underline-offset-4'
                      params={{ isoCode: el.id }}
                    >
                      View country
                    </Link>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}

export default DataTable;
