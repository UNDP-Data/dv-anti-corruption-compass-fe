import { useState } from 'react';
import { Modal } from '@undp/design-system-react/Modal';

import { CountryProfileCard } from '../Components/CountryProfileCard';
import AntiCorruptionLaws from '../CountryProfileModals/AntiCorruptionLaws';
import AntiCorruptionStrategies from '../CountryProfileModals/AntiCorruptionStrategies';
import AntiCorruptionAuthorities from '../CountryProfileModals/AntiCorruptionAuthorities';
import UncacReviewStatus from '../CountryProfileModals/UncacReviewStatus';
import ComplaintHandlingMechanism from '../CountryProfileModals/ComplaintHandlingMechanism';
import CountryLevelSurveys from '../CountryProfileModals/CountryLevelSurveys';
import FATF from '../CountryProfileModals/FATF';
import GloballyAvailableData from '../CountryProfileModals/GloballyAvailableData';

function CountryProfile({ isoCode }: { isoCode: string }) {
  const [cardClicked, setCardClicked] = useState<undefined | string>(undefined);
  return (
    <>
      <div className='flex items-stretch gap-6 w-full flex-wrap'>
        <CountryProfileCard
          title='Anti-corruption laws'
          imgSrc='/imgs/CountryProfileCardsIcons/01.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('antiCorruptionLaws');
          }}
        />
        <CountryProfileCard
          title='Anti-corruption strategies'
          imgSrc='/imgs/CountryProfileCardsIcons/02.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('antiCorruptionStrategies');
          }}
        />
        <CountryProfileCard
          title='Globally Available Indicators'
          imgSrc='/imgs/CountryProfileCardsIcons/03.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('globallyAvailableData');
          }}
        />
        <CountryProfileCard
          title='UNCAC review status'
          imgSrc='/imgs/CountryProfileCardsIcons/04.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('uncacReviewStatus');
          }}
        />
        <CountryProfileCard
          title='Complaints handling mechanism'
          imgSrc='/imgs/CountryProfileCardsIcons/05.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('complaintHandlingMechanism');
          }}
        />
        <CountryProfileCard
          title='Anti-corruption authorities'
          imgSrc='/imgs/CountryProfileCardsIcons/06.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('antiCorruptionAuthorities');
          }}
        />
        <CountryProfileCard
          title='Country-level surveys'
          imgSrc='/imgs/CountryProfileCardsIcons/07.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('countryLevelSurveys');
          }}
        />
        <CountryProfileCard
          title='Financial Action Task Force'
          imgSrc='/imgs/CountryProfileCardsIcons/08.png'
          description='Lorem ipsum dolor sit amet consectetur. Nec risus ipsum ipsum augue at in molestie sed vulputate.'
          onClick={() => {
            setCardClicked('fatf');
          }}
        />
      </div>
      {cardClicked && (
        <Modal
          open={cardClicked !== undefined}
          onClose={() => {
            setCardClicked(undefined);
          }}
          className='bg-[#F5F5F5]! border-0! rounded-lg!'
        >
          {cardClicked === 'antiCorruptionLaws' && (
            <AntiCorruptionLaws isoCode={isoCode} />
          )}
          {cardClicked === 'antiCorruptionAuthorities' && (
            <AntiCorruptionAuthorities isoCode={isoCode} />
          )}
          {cardClicked === 'antiCorruptionStrategies' && (
            <AntiCorruptionStrategies isoCode={isoCode} />
          )}
          {cardClicked === 'uncacReviewStatus' && (
            <UncacReviewStatus isoCode={isoCode} />
          )}
          {cardClicked === 'complaintHandlingMechanism' && (
            <ComplaintHandlingMechanism isoCode={isoCode} />
          )}
          {cardClicked === 'countryLevelSurveys' && (
            <CountryLevelSurveys isoCode={isoCode} />
          )}
          {cardClicked === 'fatf' && <FATF isoCode={isoCode} />}
          {cardClicked === 'globallyAvailableData' && (
            <GloballyAvailableData isoCode={isoCode} />
          )}
        </Modal>
      )}
    </>
  );
}

export default CountryProfile;
