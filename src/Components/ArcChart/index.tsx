import { NoData } from '../NoData';
import { ParagraphText } from '../Typography';

import { Graph } from './Graph';

interface Props {
  data: number[];
  colors: string[];
  subPillars: string[];
  suffix: string;
  maxValue: number;
}

export const ArcChart = ({
  data,
  colors,
  subPillars,
  suffix,
  maxValue,
}: Props) => {
  if (data.length === 0) return <NoData isBgWhite />;
  return (
    <div className='bg-transparent w-full mx-auto'>
      <Graph data={data} radius={125} colors={colors} maxValue={maxValue} />
      <div className='mt-4'>
        <div className='flex gap-x-6 gap-y-4 poppins-regular flex-wrap'>
          {colors.map((d, i) => (
            <div key={i} className='flex gap-2 items-start'>
              <div
                className='w-3 h-3 rounded-full flex-shrink-0'
                style={{
                  backgroundColor: d,
                }}
              />
              <ParagraphText
                leading='none'
                size='xs'
                className='text-[var(--color-text-black)]'
              >
                {subPillars[i]}:{' '}
                <strong>
                  {data[i] !== null ? `${data[i].toFixed(2)}${suffix}` : 'NA'}
                </strong>
              </ParagraphText>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
