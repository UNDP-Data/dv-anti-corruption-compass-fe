import { P } from '@undp/design-system-react/Typography';

export const NoData = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <P
        className='poppins-regular !text-[16px] text-center'
        marginBottom='none'
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
      >
        No data available
      </P>
    </div>
  );
};
