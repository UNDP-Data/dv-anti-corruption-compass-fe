import { Badge } from '@undp/design-system-react/Badge';
import { cn } from '@undp/design-system-react/cn';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H3 } from '@undp/design-system-react/Typography';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  chips?: (string | number)[];
}

function GraphCard({
  className,
  children,
  title,
  chips = [],
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={cn(
        'bg-[#3A5261] rounded-[8px] basis-[calc(50%-0.75rem)] p-6 min-w-[320px] flex flex-col gap-0',
        className,
      )}
    >
      <div className='flex flex-wrap gap-4 items-center'>
        <H3
          className='poppins-semibold !text-[16px] text-primary-white'
          marginBottom='none'
        >
          {title}
        </H3>
        {chips.map((d, i) => (
          <Badge
            key={i}
            rounded='xs'
            className='poppins-regular !text-[10px] bg-[#475258] text-primary-white'
          >
            {d}
          </Badge>
        ))}
      </div>
      <Spacer size='xl' />
      {children}
    </div>
  );
}

export { GraphCard };
