import { Card } from '@/Components/Card';
import { ParagraphText } from '@/Components/Typography';

interface Props {
  img: string;
  title: string;
  date: string;
}

export const ProjectCards = ({ img, title, date }: Props) => (
  <Card className='rounded-[20px] border-0 max-w-65 p-0 min-w-auto bg-[#242730] cursor-pointer hover:bg-[#124E6F]'>
    <img
      className='rounded-tl-[20px] rounded-tr-[20px] h-40'
      src={img}
      alt='card image'
    />
    <div className='px-6 py-9'>
      <ParagraphText weight='medium' className='pb-4'>
        {title}
      </ParagraphText>
      <ParagraphText size='xs' className='text-[#808191]'>
        Published on {date}
      </ParagraphText>
    </div>
  </Card>
);
