import { Badge } from '@undp/design-system-react/Badge';
import { Spacer } from '@undp/design-system-react/Spacer';
import React from 'react';

import { Card } from './Card';
import { ParagraphText } from './Typography';

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
    <Card {...props} className={className}>
      <div className='flex flex-wrap gap-4 items-center'>
        <ParagraphText weight='semibold'>{title}</ParagraphText>
        {chips.map((d, i) => (
          <Badge
            key={i}
            rounded='xs'
            className='poppins-medium !text-[12px] bg-[#FFFFFF1F] rounded-[4px] text-primary-white py-1 px-2'
          >
            {d}
          </Badge>
        ))}
      </div>
      <Spacer size='xl' />
      {children}
    </Card>
  );
}

export { GraphCard };
