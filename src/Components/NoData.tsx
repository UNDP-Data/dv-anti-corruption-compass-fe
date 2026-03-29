import { ParagraphText } from './Typography';

export const NoData = ({ isBgWhite }: { isBgWhite?: boolean }) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <ParagraphText
        className={
          isBgWhite
            ? 'text-[var(--color-text-black)]'
            : 'text-[rgba(255, 255, 255, 0.6)]'
        }
      >
        No data available
      </ParagraphText>
    </div>
  );
};
