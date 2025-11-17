import { Spacer } from '@undp/design-system-react/Spacer';

import { HeadingText, ParagraphText } from '@/Components/Typography';
import { Button } from '@/Components/Button';
function MethodologyPage() {
  return (
    <div className='relative container mx-auto'>
      <div className='mb-16'>
        <Spacer size='7xl' />
        <HeadingText type='h2'>Methodology</HeadingText>
        <Spacer size='xl' />
        <ParagraphText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ParagraphText>
      </div>
      <div
        style={{
          background:
            'linear-gradient(97.48deg, #17232B -5.56%, #4E7691 156.23%)',
        }}
        className='px-8 !py-[80px] flex items-center justify-center flex-col gap-8 w-full'
      >
        <HeadingText type='h2'>Have feedback for us?</HeadingText>
        <a href='mailto:anti-corruption@undp.org'>
          <Button variant='secondary'>
            Send us an email: anti-corruption@undp.org
          </Button>
        </a>
      </div>
      <Spacer size='7xl' />
    </div>
  );
}

export default MethodologyPage;
