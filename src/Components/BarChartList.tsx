import { ParagraphText } from './Typography';

interface Props {
  data: { id: string; value: number }[];
  color: string;
  maxValue?: number;
  suffix?: string;
  textClassName?: string;
  bgColor?: string;
}

export const BarChartList = ({
  data,
  color,
  maxValue = 1,
  suffix = '',
  textClassName,
  bgColor = '#fff',
}: Props) => {
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
            style={{ backgroundColor: bgColor }}
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
