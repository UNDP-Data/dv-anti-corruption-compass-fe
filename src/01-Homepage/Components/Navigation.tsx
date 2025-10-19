import { P } from '@undp/design-system-react';
import { Fragment } from 'react/jsx-runtime';

import { ScrollToObj } from '@/Utils/ScrollToObj';
import { PillarsMetaDataType } from '@/Types';

interface Props {
  inViewSlide: number;
  countryLevelInsightsRef: React.RefObject<HTMLDivElement | null>;
  globeControlsRef: React.RefObject<(HTMLDivElement | null)[]>;
  pillarsMetaData: PillarsMetaDataType[];
}
const Navigation = (props: Props) => {
  const {
    inViewSlide,
    globeControlsRef,
    countryLevelInsightsRef,
    pillarsMetaData,
  } = props;
  return (
    <div className='fixed z-50 flex flex-col gap-0 justify-center items-center right-8 top-[50%] transform-[translate(0, -50%)'>
      {pillarsMetaData.map((d, i) => (
        <Fragment key={i}>
          <div className='flex gap-2 items-center'>
            <div className='flex items-center h-4 w-20 text-right'>
              <P
                className={`poppins-regular !text-[12px] text-right text-[#fff] w-20 opacity-0 md:opacity-100 ${inViewSlide === i ? '' : 'hidden'}`}
                marginBottom='none'
              >
                {d.value}
              </P>
            </div>
            <div
              className={`cursor-pointer rounded-full w-5 h-5 border-1 border-[#fff] ${inViewSlide === i ? 'bg-[#fff]' : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),rgba(7,43,78,0.5))]'}`}
              onClick={() => {
                ScrollToObj(globeControlsRef.current[i]);
              }}
            />
          </div>
          <div className='ml-22 my-2 w-[1px] h-10 border-l border-dashed border-white' />
        </Fragment>
      ))}
      <div className='flex gap-2 items-center'>
        <div className='flex items-center h-4 w-20 text-right'>
          <P
            className={`poppins-regular !text-[12px] text-right text-[#fff] w-20 opacity-0 md:opacity-100 ${inViewSlide === pillarsMetaData.length ? '' : 'hidden'}`}
            marginBottom='none'
          >
            Country level insights
          </P>
        </div>
        <div
          className={`cursor-pointer rounded-full w-5 h-5 border-1 border-[#fff] ${inViewSlide === pillarsMetaData.length ? 'bg-[#fff]' : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),rgba(7,43,78,0.5))]'}`}
          onClick={() => {
            ScrollToObj(countryLevelInsightsRef.current);
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;
