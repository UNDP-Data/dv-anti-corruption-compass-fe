import { Spacer } from '@undp/design-system-react/Spacer';

import { HeadingText } from './Typography';
import { ProjectCards } from './ProjectCards';

interface Props {
  heading?: string;
  cards: {
    img: string;
    title: string;
    date: string;
  }[];
}

export const ProjectsSection = (props: Props) => {
  const { heading = 'Recommended projects', cards } = props;
  return (
    <>
      <HeadingText type='h2'>{heading}</HeadingText>
      <Spacer size='2xl' />
      <div className='flex gap-6'>
        {cards.map((d, i) => (
          <ProjectCards img={d.img} title={d.title} date={d.date} key={i} />
        ))}
      </div>
    </>
  );
};
