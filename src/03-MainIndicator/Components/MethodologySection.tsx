import { Spacer } from '@undp/design-system-react/Spacer';
import { ReactElement } from 'react';
import { Link } from '@tanstack/react-router';

import { HeadingText } from '@/Components/Typography';
import { Button } from '@/Components/Button';

export const MethodologySection = ({
  description,
}: {
  description: ReactElement;
}) => {
  return (
    <>
      <HeadingText type='h2'>Methodology</HeadingText>
      <Spacer size='2xl' />
      {description}
      <Spacer size='xl' />
      <Link to='/methodology'>
        <Button variant='tertiary'>View more →</Button>
      </Link>
    </>
  );
};
