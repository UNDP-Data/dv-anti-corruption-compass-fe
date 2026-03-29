import { Spacer } from '@undp/design-system-react/Spacer';
import { AlertTriangleIcon } from 'lucide-react';

import { ParagraphText } from './Typography';

export const ErrorState = () => (
  <div className='p-8 flex w-full justify-center items-center flex-col'>
    <AlertTriangleIcon stroke='#fff' size={36} strokeWidth={1} />
    <Spacer size='xl' />
    <ParagraphText>
      Sorry there was an error loading the page please try reloading teh page
      again
    </ParagraphText>
  </div>
);
