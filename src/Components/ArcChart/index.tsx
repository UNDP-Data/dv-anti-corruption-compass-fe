import { ParagraphText } from '../Typography';

import { Graph } from './Graph';

interface Props {
  data: number[];
  colors: string[];
  subPillars: string[];
}

export const ArcChart = ({ data, colors, subPillars }: Props) => {
  return (
    <div className='bg-transparent w-full mx-auto'>
      <Graph data={data} radius={125} colors={colors} />
      <div className='mt-4'>
        <div className='flex flex gap-6 poppins-regular flex-wrap'>
          {colors.map((d, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <div
                className='w-4 h-4 rounded-full'
                style={{
                  backgroundColor: d,
                }}
              />
              <ParagraphText leading='none'>{subPillars[i]}</ParagraphText>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
