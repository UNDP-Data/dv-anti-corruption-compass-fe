import { H3, P } from '@undp/design-system-react';
import { forwardRef, useState } from 'react';

interface Props {
  heading: string;
  description: string;
  buttons: { label: string; activeColor: string }[];
  onClick: (_d: { label: string; activeColor: string }) => void;
}

const ControlPanel = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { heading, description, buttons, onClick } = props;
  const [activeButton, setActiveButton] = useState(buttons[0].label);
  return (
    <div ref={ref} className='h-[calc(100vh-120px)]'>
      <div className='h-full max-w-[720px] m-auto flex-col gap-10.5 justify-center flex'>
        <div className='flex-col gap-4.5 justify-center flex'>
          <H3
            className='poppins-bold !text-[24px] !leading-[120%]'
            marginBottom='none'
          >
            {heading}
          </H3>
          <P
            className='poppins-regular !text-[16px] !leading-[140%]'
            marginBottom='none'
          >
            {description}
          </P>
        </div>
        <div
          className={`flex gap-4 flex-wrap${buttons.length > 3 ? '' : ' flex-col'}`}
        >
          {buttons.map((d, i) => (
            <button
              type='button'
              key={i}
              onClick={() => {
                setActiveButton(d.label);
                onClick(d);
              }}
              style={{
                backgroundColor:
                  activeButton === d.label ? '#fff' : 'transparent',
                color: activeButton === d.label ? 'var(--gray-700)' : '#fff',
              }}
              className='flex pointer items-center rounded-xl py-4 px-4 gap-2 w-[calc(50%-0.5rem)] border-2 border-[#fff]'
            >
              <div
                style={{
                  backgroundColor:
                    activeButton !== d.label ? '#fff' : d.activeColor,
                }}
                className='w-4 h-4 rounded-full'
              />
              <P
                className='poppins-medium !text-[18px] text-left'
                marginBottom='none'
              >
                {d.label}
              </P>
            </button>
          ))}
        </div>
        <P
          className='poppins-medium !text-[16px] text-left mt-4'
          marginBottom='none'
        >
          View more →
        </P>
      </div>
    </div>
  );
});

export default ControlPanel;
