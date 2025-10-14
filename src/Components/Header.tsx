import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@undp/design-system-react/DropdownMenu';
import { Search } from '@undp/design-system-react/Search';
import { H3, P } from '@undp/design-system-react/Typography';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header
      className='fixed flex justify-between top-0 w-full px-16 py-9 z-50'
      style={{ background: 'inherit' }}
    >
      <Link to='/'>
        <div className='flex items-center gap-4'>
          <img src='/imgs/Logo.svg' alt='Example' className='w-7.5 h-auto' />
          <H3
            className='text-center poppins-bold !text-[20px] tracking-[0%]'
            marginBottom='none'
          >
            Anti Corruption Compass
          </H3>
        </div>
      </Link>
      <div className='items-center gap-16 hidden lg:flex'>
        <Link to='/'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            Home
          </P>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='flex items-center gap-2'>
              <P
                className='text-center poppins-medium !text-[18px] leading-none tracking-[0%] text-[#fff]'
                marginBottom='none'
              >
                Main indicators
              </P>
              <ChevronDown strokeWidth={3} size={16} color='#fff' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-60 rounded-[8px] mt-2 p-0 z-1000 border-none shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]'>
            <DropdownMenuItem className='poppins-medium !text-[14px] py-4 px-3 hover:!bg-[#4B6E91] hover:!text-[#fff]'>
              <Link to='/public-procurement-integrity'>
                <P
                  className='text-center poppins-medium !text-[14px] !leading-[1.37] tracking-[0%]'
                  marginBottom='none'
                >
                  Public procurement integrity
                </P>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='poppins-medium !text-[14px] py-4 px-3 hover:!bg-[#4B6E91] hover:!text-[#fff]'>
              <Link to='/business-experience'>
                <P
                  className='text-center poppins-medium !text-[14px] !leading-[1.37] tracking-[0%]'
                  marginBottom='none'
                >
                  Business experiences
                </P>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to='/methodology'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            Methodology
          </P>
        </Link>
        <Link to='/about'>
          <P
            className='text-center poppins-medium !text-[18px] leading-none tracking-[0%]'
            marginBottom='none'
          >
            About Us
          </P>
        </Link>
      </div>
      <div className='search-component hidden lg:block'>
        <Search
          buttonVariant='icon'
          className='flex-row-reverse'
          inputSize='sm'
          inputVariant='light'
          inputClassName='bg-transparent rounded-full py-3 px-3 border-1 border-[#fff] text-[#fff] w-50 poppins-regular !text-[12px]'
          showSearchButton={false}
        />
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
              <P
                className='poppins-medium !text-[14px] leading-none tracking-[0%]'
                marginBottom='none'
              >
                Main indicators
              </P>
              <div className='flex flex-col justify-start items-start gap-8 pl-5'>
                <Link to='/public-procurement-integrity'>
                  <P
                    className='poppins-regular !text-[14px] leading-none tracking-[0%]'
                    marginBottom='none'
                  >
                    Public procurement integrity
                  </P>
                </Link>
                <Link to='/business-experience'>
                  <P
                    className='poppins-regular !text-[14px] leading-none tracking-[0%]'
                    marginBottom='none'
                  >
                    Business experiences
                  </P>
                </Link>
                <Link to='/anti-corruption-authority'>
                  <P
                    className='poppins-regular !text-[14px] leading-none tracking-[0%]'
                    marginBottom='none'
                  >
                    Country level insights
                  </P>
                </Link>
              </div>
              <Link to='/methodology'>
                <P
                  className='poppins-medium !text-[14px] leading-none tracking-[0%]'
                  marginBottom='none'
                >
                  Methodology
                </P>
              </Link>
              <Link to='/about'>
                <P
                  className='poppins-medium !text-[14px] leading-none tracking-[0%]'
                  marginBottom='none'
                >
                  About Us
                </P>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
