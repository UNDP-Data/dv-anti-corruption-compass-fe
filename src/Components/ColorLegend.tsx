import { cn } from '@undp/design-system-react/cn';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@undp/design-system-react/HoverCard';
import { P } from '@undp/design-system-react/Typography';
import { InfoIcon } from 'lucide-react';

export const ColorLegend = ({
  colors,
  className,
  showTitle = true,
  keyValues = ['Low', 'Medium', 'High'],
}: {
  colors: string[];
  className?: string;
  showTitle?: boolean;
  keyValues?: string[];
}) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showTitle && (
        <div className='flex gap-2 items-center mt-6'>
          <P
            size='base'
            marginBottom='none'
            className='p-0 leading-normal text-primary-white poppins-medium'
          >
            Indicator Value
          </P>
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <InfoIcon color='#fff' size={16} />
            </HoverCardTrigger>
            <HoverCardContent className='rounded text-[12px] poppins-regular !leading-[150%] p-3 rounded-[8px] text-[#4D4D4D] w-60'>
              Countries in the top third are assigned High, the middle third
              Medium, and the bottom third Low. Missing values are labelled Not
              Available.
            </HoverCardContent>
          </HoverCard>
        </div>
      )}

      <div className='flex flex gap-7 poppins-regular'>
        {colors.map((d, i) => (
          <div key={i} className='flex gap-2 items-center'>
            <div
              className='w-4 h-4 rounded-full'
              style={{
                backgroundColor: d,
              }}
            />
            <P size='base' marginBottom='none' leading='none'>
              {keyValues[i]}
            </P>
          </div>
        ))}
      </div>
    </div>
  );
};
