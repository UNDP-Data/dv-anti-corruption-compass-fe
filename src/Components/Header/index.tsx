import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@undp/design-system-react/DropdownMenu';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@undp/design-system-react/Modal';

import { HeadingText, ParagraphText } from '../Typography';

import { CountryList } from './CountryList';

import { CountryTaxonomyDataType, PillarsMetaDataType } from '@/Types';

export const Header = ({
  pillarsMetaData,
  countryTaxonomyDataLoading,
  countryTaxonomyDataError,
  countryTaxonomyData,
}: {
  pillarsMetaData: PillarsMetaDataType[];
  countryTaxonomyDataLoading: boolean;
  countryTaxonomyDataError: boolean;
  countryTaxonomyData: CountryTaxonomyDataType[];
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCountrySelection, setShowCountrySelection] = useState(false);

  return (
    <>
      <header className='fixed flex justify-between top-0 w-full px-16 py-9 z-50 background-inherit'>
        <Link to='/'>
          <div className='flex items-center gap-4'>
            <img src='/imgs/Logo.svg' alt='Example' className='w-7.5 h-auto' />
            <HeadingText
              type='h3'
              weight='bold'
              alignment='center'
              marginBottom='none'
            >
              Anti Corruption Compass
            </HeadingText>
          </div>
        </Link>
        <div className='items-center gap-16 hidden lg:flex'>
          <Link to='/'>
            <ParagraphText
              alignment='center'
              size='lg'
              weight='medium'
              leading='none'
            >
              Home
            </ParagraphText>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='flex items-center gap-2'>
                <ParagraphText
                  alignment='center'
                  size='lg'
                  weight='medium'
                  leading='none'
                >
                  Main indicators
                </ParagraphText>
                <ChevronDown strokeWidth={3} size={16} color='#fff' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60 rounded-[8px] mt-2 p-0 z-1000 border-none shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]'>
              {(pillarsMetaData || []).map((d, i) => (
                <DropdownMenuItem
                  key={i}
                  asChild
                  className='poppins-medium !text-[14px] py-4 px-3 hover:!bg-[#4B6E91] text-[var(--color-black-bg)] hover:!text-[var(--color-text-white)]'
                >
                  <Link
                    to='/main-indicators/$indicator'
                    params={{
                      indicator: d.value.replaceAll(' ', '-').toLowerCase(),
                    }}
                  >
                    <ParagraphText
                      alignment='center'
                      size='sm'
                      weight='medium'
                      className='text-[inherit]'
                    >
                      {d.value}
                    </ParagraphText>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to='/methodology'>
            <ParagraphText
              alignment='center'
              size='lg'
              weight='medium'
              leading='none'
            >
              Methodology
            </ParagraphText>
          </Link>
          <Link to='/about'>
            <ParagraphText
              alignment='center'
              size='lg'
              weight='medium'
              leading='none'
            >
              About Us
            </ParagraphText>
          </Link>
        </div>
        <div className='hidden lg:block'>
          <button
            type='button'
            className='m-0 p-0 cursor-pointer'
            onClick={() => {
              setShowCountrySelection(true);
            }}
          >
            <Globe color='#fff' size={28} />
          </button>
        </div>
        <div className='grow justify-end gap-8 flex lg:hidden'>
          <button
            type='button'
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? (
              <X className='w-10 h-10 stroke-white' />
            ) : (
              <Menu className='w-10 h-10 stroke-white' />
            )}
          </button>
          {showMenu ? (
            <div className='box-border h-[calc(100vh-120px)] left-0 m-0 overflow-y-auto p-5 absolute top-full w-full backdrop-blur-[18px] bg-[#2D4858]'>
              <div className='flex flex-col justify-start items-start gap-8'>
                <ParagraphText size='sm' weight='medium' leading='none'>
                  Main indicators
                </ParagraphText>
                <div className='flex flex-col justify-start items-start gap-8 pl-5'>
                  {pillarsMetaData.map((d, i) => (
                    <Link
                      key={i}
                      to='/main-indicators/$indicator'
                      params={{
                        indicator: d.value.replaceAll(' ', '-').toLowerCase(),
                      }}
                    >
                      <ParagraphText size='sm' weight='medium' leading='none'>
                        {d.value}
                      </ParagraphText>
                    </Link>
                  ))}
                </div>
                <Link to='/methodology'>
                  <ParagraphText size='sm' weight='medium' leading='none'>
                    Methodology
                  </ParagraphText>
                </Link>
                <Link to='/about'>
                  <ParagraphText size='sm' weight='medium' leading='none'>
                    About Us
                  </ParagraphText>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </header>
      {showCountrySelection && (
        <Modal
          open={showCountrySelection}
          onClose={() => {
            setShowCountrySelection(false);
          }}
          className='bg-[#F5F5F5]! border-0! rounded-lg!'
        >
          <CountryList
            countryTaxonomyData={countryTaxonomyData || []}
            countryTaxonomyDataLoading={countryTaxonomyDataLoading}
            countryTaxonomyDataError={countryTaxonomyDataError}
            setShowCountrySelection={setShowCountrySelection}
            mode='light'
          />
        </Modal>
      )}
    </>
  );
};
