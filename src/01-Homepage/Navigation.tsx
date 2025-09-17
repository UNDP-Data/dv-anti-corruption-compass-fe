import { P } from '@undp/design-system-react';

interface Props {
  isInViewControlPanelOne: boolean;
  isInViewControlPanelTwo: boolean;
  isInViewControlPanelThree: boolean;
  isInViewSlideThree: boolean;
  refControlPanelOne: React.RefObject<HTMLDivElement | null>;
  refControlPanelTwo: React.RefObject<HTMLDivElement | null>;
  refControlPanelThree: React.RefObject<HTMLDivElement | null>;
  refSlideThree: React.RefObject<HTMLDivElement | null>;
}

const Navigation = (props: Props) => {
  const handleScroll = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current) return;

    const y =
      targetRef.current.getBoundingClientRect().top + window.scrollY - 120;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const {
    isInViewControlPanelOne,
    isInViewControlPanelTwo,
    isInViewControlPanelThree,
    isInViewSlideThree,
    refControlPanelOne,
    refControlPanelTwo,
    refControlPanelThree,
    refSlideThree,
  } = props;
  return (
    <div
      className={`fixed z-50 ${isInViewControlPanelOne || isInViewControlPanelTwo || isInViewControlPanelThree || isInViewSlideThree ? 'flex' : 'hidden'} flex-col gap-0 justify-center items-center right-8 top-[50%] transform-[translate(0, -50%)`}
    >
      <div className='flex gap-2 items-center'>
        <div className='flex items-center h-4 w-20 text-right'>
          <P
            className='poppins-regular !text-[12px] text-right text-[#fff] w-20'
            marginBottom='none'
          >
            Public procurement integrity
          </P>
        </div>
        <div
          className={`cursor-pointer rounded-full w-4 h-4 border-2 border-[#fff] ${isInViewControlPanelOne ? 'bg-[#fff]' : 'bg-[rgba(255,255,255,0.3)]'} hover:!bg-[rgba(255,255,255,0.5)`}
          onClick={() => {
            handleScroll(refControlPanelOne);
          }}
        />
      </div>
      <div className='ml-22 w-[1px] h-10 bg-[#fff]' />
      <div className='flex gap-2 items-center'>
        <div className='flex items-center h-4 w-20 text-right'>
          <P
            className='poppins-regular !text-[12px] text-right text-[#fff] w-20'
            marginBottom='none'
          >
            Business experience
          </P>
        </div>
        <div
          className={`cursor-pointer rounded-full w-4 h-4 border-2 border-[#fff] ${isInViewControlPanelTwo ? 'bg-[#fff]' : 'bg-[rgba(255,255,255,0.3)]'} hover:!bg-[rgba(255,255,255,0.5)`}
          onClick={() => {
            handleScroll(refControlPanelTwo);
          }}
        />
      </div>
      <div className='ml-22 w-[1px] h-10 bg-[#fff]' />
      <div className='flex gap-2 items-center'>
        <div className='flex items-center h-4 w-20 text-right'>
          <P
            className='poppins-regular !text-[12px] text-right text-[#fff] w-20'
            marginBottom='none'
          >
            Anti-corruption authorities
          </P>
        </div>
        <div
          className={`cursor-pointer rounded-full w-4 h-4 border-2 border-[#fff] ${isInViewControlPanelThree ? 'bg-[#fff]' : 'bg-[rgba(255,255,255,0.3)]'} hover:!bg-[rgba(255,255,255,0.5)`}
          onClick={() => {
            handleScroll(refControlPanelThree);
          }}
        />
      </div>
      <div className='ml-22 w-[1px] h-10 bg-[#fff]' />
      <div className='flex gap-2 items-center'>
        <div className='flex items-center h-4 w-20 text-right'>
          <P
            className='poppins-regular !text-[12px] text-right text-[#fff] w-20'
            marginBottom='none'
          >
            Country level insights
          </P>
        </div>
        <div
          className={`cursor-pointer rounded-full w-4 h-4 border-2 border-[#fff] ${isInViewSlideThree ? 'bg-[#fff]' : 'bg-[rgba(255,255,255,0.3)]'} hover:!bg-[rgba(255,255,255,0.5)`}
          onClick={() => {
            handleScroll(refSlideThree);
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;
