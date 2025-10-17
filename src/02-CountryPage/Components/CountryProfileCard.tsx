import { cn } from '@undp/design-system-react/cn';
import { Spacer } from '@undp/design-system-react/Spacer';
import { H3, P } from '@undp/design-system-react/Typography';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  imgSrc: string;
  description: string;
}

function CountryProfileCard({
  className,
  description,
  title,
  imgSrc,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={cn(
        'bg-[#FFFFFF12] shadow-[0_5px_60px_0_rgba(0,0,0,0.20)] rounded-[8px] basis-[calc(50%-0.75rem)] pr-16 pl-6 py-8 min-w-[320px] flex flex-col gap-0 cursor-pointer',
        className,
      )}
    >
      <img src={imgSrc} className='w-[80px] h-[80px]' alt='icons' />
      <Spacer size='2xl' />
      <H3
        className='poppins-semibold !text-[20px] text-primary-white'
        marginBottom='none'
      >
        {title}
      </H3>
      <Spacer size='xl' />
      <P className='poppins-light text-[16px]! !leading-[140%] text-primary-white mb-0'>
        {description}
      </P>
      <Spacer size='2xl' />
      <P className='poppins-semibold text-[16px]! text-primary-white'>
        View More →
      </P>
    </div>
  );
}

export { CountryProfileCard };
