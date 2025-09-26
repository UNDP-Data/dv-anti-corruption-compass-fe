import {
  Card,
  CardHeader,
  CardImage,
  CardTitle,
  CardDescription,
} from '@undp/design-system-react/Card';

interface Props {
  img: string;
  title: string;
  date: string;
}

export const CardEl = ({ img, title, date }: Props) => (
  <div className='dark'>
    <Card
      border
      size='full'
      variant='with-image'
      className='rounded-[20px] border-0 max-w-65'
    >
      <CardHeader>
        <CardImage
          className='rounded-tl-[20px] rounded-tr-[20px] h-40'
          src={img}
        />
        <CardTitle className='poppins-medium !text-[16px] !leading-[26px]'>
          {title}
        </CardTitle>
        <CardDescription className='poppins-regular !text-[12px] !leading-[16px] text-[#808191]'>
          Published on {date}
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
);
