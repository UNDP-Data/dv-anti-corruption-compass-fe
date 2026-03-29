import { Badge } from '@undp/design-system-react/Badge';

interface Props {
  data: { region: string; value: number }[];
  color: string;
  maxValue?: number;
  suffix: string;
}

export const BarChartTable = ({
  data,
  color,
  maxValue = 1,
  suffix = '',
}: Props) => {
  return (
    <div className='pr-4'>
      <div className='flex flex-col'>
        <div className='flex gap-8 py-2 pr-4 border-b border-b-[#9BA5AB]'>
          <div className='w-[calc(100%-48px)] poppins-medium text-[14px] text-[#9BA5AB]'>
            Region
          </div>
          <div className='w-[48px] poppins-medium text-[14px] text-[#9BA5AB]'>
            Value
          </div>
        </div>
        <div className='h-[500px] undp-scrollbar'>
          {data
            .sort((a, b) => b.value - a.value)
            .map((d, i) => (
              <div
                className='flex gap-8 py-3 pr-4 items-center border-b border-b-[0.5px] border-b-[#FFFFFF0F]'
                key={i}
              >
                <div className='w-[calc(100%-48px)] gap-2 flex items-center'>
                  <div className='w-[calc(40%-4px)] poppins-medium text-[14px] text-primary-white'>
                    {d.region}
                  </div>
                  <div className='w-[calc(60%-4px))] poppins-medium'>
                    <div className='w-full rounded-full bg-primary-white h-2' />
                    <div
                      className='rounded-full h-2 mt-[-8px]'
                      style={{
                        width: `${(d.value * 100) / maxValue}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
                <div className='w-[48px] poppins-medium text-[14px] text-primary-white text-right'>
                  <Badge
                    rounded='full'
                    className='bg-primary-white! text-[var(--color-text-black)]! poppins-bold px-1! text-[14px]! w-full! flex justify-center'
                  >
                    {maxValue <= 1 ? d.value.toFixed(2) : Math.round(d.value)}
                    {suffix}
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
