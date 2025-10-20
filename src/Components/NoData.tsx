import { ParagraphText } from './Typography';

export const NoData = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <ParagraphText className='text-[rgba(255, 255, 255, 0.6)]'>
        No data available
      </ParagraphText>
    </div>
  );
};
