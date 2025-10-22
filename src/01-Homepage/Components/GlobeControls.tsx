import { Link } from '@tanstack/react-router';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';

import { HeadingText, ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

interface Props {
  heading: string;
  description: string;
  isLastSection?: boolean;
  buttons?: { label: string; value: string; color: string }[];
  onClick: (_d: string) => void;
  onViewChange: (_d: number) => void;
  index: number;
}

const GlobeControls = (props: Props) => {
  const {
    heading,
    description,
    buttons = [],
    onClick,
    isLastSection,
    onViewChange,
    index,
  } = props;
  const [activeButton, setActiveButton] = useState(buttons[0].label);
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, amount: 0.6 });
  useEffect(() => {
    if (isInView) {
      onViewChange(index);
    }
  }, [index, isInView, onViewChange]);
  return (
    <div
      ref={ref}
      className={`h-[calc(100vh-120px)] px-4 ${isLastSection ? 'mb-60' : ''} `}
    >
      <div className='h-full max-w-[720px] m-auto flex-col gap-10 justify-center flex'>
        <div className='flex-col gap-4.5 justify-center flex'>
          <HeadingText type='h2'>{heading}</HeadingText>
          <ParagraphText className='hidden md:block'>
            {description}
          </ParagraphText>
        </div>
        <div
          className={`hidden md:flex gap-y-5 gap-x-4 flex-wrap${buttons.length > 3 ? '' : ' flex-col'}`}
        >
          {buttons.map((d, i) => (
            <button
              type='button'
              key={i}
              onClick={() => {
                setActiveButton(d.label);
                onClick(d.label);
              }}
              className={cn(
                'flex pointer items-center rounded-xl py-4 px-4 gap-4 w-[calc(50%-0.5rem)] border-1 border-[#fff] cursor-pointer bg-transparent hover:bg-[#124E6F]',
                activeButton === d.label
                  ? 'text-[var(--gray-700)] bg-[#fff] hover:bg-[#fff]'
                  : 'text-[#fff]',
              )}
            >
              <div
                style={{
                  backgroundColor: activeButton !== d.label ? '#fff' : d.color,
                }}
                className='w-4 h-4 rounded-full'
              />
              <ParagraphText
                weight='medium'
                size='lg'
                className={
                  activeButton !== d.label ? '' : 'text-[var(--color-black-bg)]'
                }
              >
                {d.label}
              </ParagraphText>
            </button>
          ))}
        </div>
        <Link
          to='/main-indicators/$indicator'
          params={{ indicator: heading.replaceAll(' ', '-').toLowerCase() }}
        >
          <Button variant='tertiary'>View more →</Button>
        </Link>
      </div>
    </div>
  );
};

export default GlobeControls;
