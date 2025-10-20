import { Spacer } from '@undp/design-system-react/Spacer';

import { CountryProfileCard } from '../Components/CountryProfileCard';

import { HeadingText } from '@/Components/Typography';

function CountryProfile() {
  return (
    <div className='w-full'>
      <HeadingText type='h2'>Country profile</HeadingText>
      <Spacer size='2xl' />
      <div className='flex items-stretch gap-6 w-full flex-wrap'>
        <CountryProfileCard
          title='Anti-corruption laws'
          imgSrc='/imgs/CountryProfileCardsIcons/01.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='Anti-corruption strategies'
          imgSrc='/imgs/CountryProfileCardsIcons/02.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='Globally Available Indicators'
          imgSrc='/imgs/CountryProfileCardsIcons/03.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='UNCAC review status'
          imgSrc='/imgs/CountryProfileCardsIcons/04.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='Complaints handling mechanism'
          imgSrc='/imgs/CountryProfileCardsIcons/05.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='Anti-corruption authorities'
          imgSrc='/imgs/CountryProfileCardsIcons/06.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
        <CountryProfileCard
          title='Country-level surveys'
          imgSrc='/imgs/CountryProfileCardsIcons/07.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
        />
      </div>
    </div>
  );
}

export default CountryProfile;
