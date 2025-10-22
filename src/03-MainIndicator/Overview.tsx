import { HeadingText, ParagraphText } from '@/Components/Typography';

interface Props {
  title: string;
  description: string;
}

function CountryPageEl({ title, description }: Props) {
  return (
    <div className='flex items-center justify-center gap-1 flex-col mt-16 mb-26'>
      <div className='flex flex-col gap-8 justify-center items-center container-md m-auto px-4'>
        <HeadingText type='h1'>{title}</HeadingText>
        <ParagraphText alignment='center' size='lg'>
          {description}
        </ParagraphText>
      </div>
    </div>
  );
}

export default CountryPageEl;
