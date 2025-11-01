import { Spinner } from '@undp/design-system-react/Spinner';
import { Badge } from '@undp/design-system-react/Badge';
import { Link } from '@tanstack/react-router';
import { Spacer } from '@undp/design-system-react/Spacer';
import { useState } from 'react';
import {
  checkIfNullOrUndefined,
  getTextColorBasedOnBgColor,
} from '@undp/data-viz/utils';
import { Pagination } from '@undp/design-system-react/Pagination';

import { CountryTaxonomyDataType, IndicatorDataType } from '@/Types';

interface Props {
  data: IndicatorDataType[];
  colors: string[];
  countryTaxonomy: CountryTaxonomyDataType[];
}

function DataTableSimple({ data, colors = [], countryTaxonomy }: Props) {
  const [page, setPage] = useState(1);
  const pageLength = 10;
  return (
    <div className='gap-4.5 flex flex-col w-full text-primary-gray-700'>
      <div className='dark'>
        <div className='flex w-full pb-2 border-b border-b-primary-white'>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[45%] pr-4!'>
            Country name
          </div>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[25%] pr-4!'>
            Indicator value
          </div>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[15%] pr-4!'>
            Value
          </div>
          <div className='poppins-semibold text-[16px]! text-primary-white! w-[15%] pr-4!' />
        </div>
        <div>
          {data.length > 0 ? (
            data
              .filter(
                (_el, i) =>
                  i < page * pageLength && i >= (page - 1) * pageLength,
              )
              .map((el, i) => {
                return (
                  <div key={i}>
                    <div className='flex w-full py-4 border-b border-b-[0.5px] border-b-primary-white items-center'>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[45%] pr-4!'>
                        {
                          countryTaxonomy.find(
                            c => c['Alpha-3 code'] === el.ISO3_Code,
                          )?.['Country or Area']
                        }
                      </div>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[25%] pr-4!'>
                        <Badge
                          rounded='full'
                          className='poppins-medium py-0 text-[12px]! px-3!'
                          style={{
                            backgroundColor:
                              ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                el.Indicator_value,
                              ) !== -1
                                ? colors[
                                    ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                      el.Indicator_value,
                                    )
                                  ]
                                : '#DADADA',
                            color: getTextColorBasedOnBgColor(
                              ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                el.Indicator_value,
                              ) !== -1
                                ? colors[
                                    ['LOW', 'MEDIUM', 'HIGH'].indexOf(
                                      el.Indicator_value,
                                    )
                                  ]
                                : '#DADADA',
                            ),
                          }}
                        >
                          {el.Indicator_value}
                        </Badge>
                      </div>
                      <div className='poppins-light text-[16px]! text-primary-white! w-[15%] pr-4!'>
                        {checkIfNullOrUndefined(el.Indicator_value_numeric)
                          ? 'NA'
                          : el.Indicator_value_numeric.toFixed(2)}
                      </div>
                      <Link
                        to='/countries/$isoCode'
                        className='poppins-light text-[16px]! text-primary-white! w-[15%] pr-4! opacity-100 hover:opacity-80 underline underline-offset-4'
                        params={{ isoCode: el.ISO3_Code }}
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
          total={data.length}
          pageSize={pageLength}
          onChange={page => {
            setPage(page);
          }}
        />
      </div>
    </div>
  );
}

export default DataTableSimple;
