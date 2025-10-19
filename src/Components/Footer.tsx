import { Link } from '@tanstack/react-router';
import { P } from '@undp/design-system-react/Typography';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';

import { PillarsMetaDataType } from '@/Types';

export const Footer = ({
  pillarsMetaData,
}: {
  pillarsMetaData: PillarsMetaDataType[];
}) => {
  return (
    <footer className='bg-[#537286] px-20 py-24 relative z-10'>
      <div className='flex flex-wrap flex-col lg:flex-row gap-4 md:gap-12 lg:gap-0'>
        <div className='w-full lg:w-1/2'>
          <P className='poppins-regular !text-[16px]' size='sm'>
            Copyright © 2025 Anti Corruption Compass
          </P>
          <div className='flex gap-8'>
            <FacebookIcon />
            <TwitterIcon />
            <InstagramIcon />
            <YoutubeIcon />
          </div>
        </div>
        <div className='w-full flex gap-4 justify-start flex-col md:flex-row md:justify-between lg:w-1/2 lg:justify-end md:gap-4 lg:gap-16'>
          <Link to='/'>
            <P className='poppins-regular !text-[16px]' marginBottom='none'>
              Home
            </P>
          </Link>
          <div className='flex flex-col gap-4 md:gap-8'>
            {pillarsMetaData.map((d, i) => (
              <Link
                to='/main-indicators/$indicator'
                params={{
                  indicator: d.value.replaceAll(' ', '-').toLowerCase(),
                }}
                key={i}
              >
                <P className='poppins-regular !text-[16px]' marginBottom='none'>
                  {d.value}
                </P>
              </Link>
            ))}
          </div>
          <Link to='/methodology'>
            <P className='poppins-regular !text-[16px]' marginBottom='none'>
              Methodology
            </P>
          </Link>
          <Link to='/about'>
            <P className='poppins-regular !text-[16px]' marginBottom='none'>
              About Us
            </P>
          </Link>
        </div>
      </div>
    </footer>
  );
};
