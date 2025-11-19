import { NoData } from './NoData';
import { ParagraphText } from './Typography';

interface Props {
  data: { id: string; value: number }[];
  color: string;
  maxValue?: number;
  suffix?: string;
  textClassName?: string;
  barBgColor?: string;
  isCardBgWhite?: boolean;
}

export const BarChartList = ({
  data,
  color,
  maxValue = 1,
  suffix = '',
  textClassName,
  barBgColor = '#fff',
  isCardBgWhite = false,
}: Props) => {
  if (data.length === 0) return <NoData isBgWhite={isCardBgWhite} />;
  return (
    <div className='flex flex-col gap-4'>
      {data.map((d, i) => (
        <div key={i} className='w-full'>
          <ParagraphText
            weight='medium'
            size='sm'
            marginBottom='2xs'
            className={textClassName}
          >
            {d.id}:{' '}
            {d.value !== null && d.value !== undefined
              ? `${d.value}${suffix}`
              : 'NA'}
          </ParagraphText>
          <div
            className='w-full rounded-full h-2'
            style={{ backgroundColor: barBgColor }}
          />
          <div
            className='rounded-full h-2 mt-[-8px]'
            style={{
              width: `${((d.value || 0) * 100) / maxValue}%`,
              backgroundColor: color || '#fff',
            }}
          />
        </div>
      ))}
    </div>
  );
};
