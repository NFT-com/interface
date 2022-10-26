import { useSidebar } from 'hooks/state/useSidebar';
import { Doppler, getEnvBool } from 'utils/env';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle } from 'phosphor-react';
import LightNavLogo from 'public/LogoFooterWhite.svg';

type MobileNoAccountProps = {
  setSignIn: (input: boolean) => void
}

export default function MobileNoAccount({ setSignIn }: MobileNoAccountProps) {
  const { setSidebarOpen } = useSidebar();

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <motion.div className='text-white font-noi-grotesk bg-black h-full px-5 py-10'>
        <div className="flex-shrink-0 flex items-center hover:cursor-pointer mr-7">
          <Link href='/' passHref legacyBehavior>
            <div className='w-8 h-8'>
              <LightNavLogo className='justify-start' />
            </div>
          </Link>
          <svg className='ml-3' width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z" fill="white" />
            <path d="M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z" fill="white" />
            <path d="M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z" fill="white" />
          </svg>
        </div>

        <div className='absolute top-10 right-4 hover:cursor-pointer w-9 h-9 bg-[#8B8B8B] rounded-full'></div>
        <XCircle onClick={() => setSidebarOpen(false)} className='absolute top-8 right-2 hover:cursor-pointer' size={52} color="black" weight="fill" />

        <div className='flex flex-col h-max mt-20'>

          <a onClick={() => setSignIn(true)}
            className='flex flex-row w-full items-start text-[#fff] hover:text-[#F9D54C] text-[2.5rem] font-grotesk font-medium leading-9 pr-12 pb-3 mb-7'
          >
            Sign in
          </a>

          <Link
            href='/app/discover'
            passHref
            onClick={() => setSidebarOpen(false)}
            className='flex flex-row w-full items-start text-[#fff] hover:text-[#F9D54C] text-[2.5rem] font-grotesk font-medium leading-9 pr-12 pb-3 mb-7 minlg:hidden'>
            
              Discover
            
          </Link>

          <Link
            href='/app/gallery'
            passHref
            onClick={() => setSidebarOpen(false)}
            className='flex flex-row w-full items-start text-[#fff] hover:text-[#F9D54C] text-[2.5rem] font-grotesk font-medium leading-9 pr-12 pb-3 mb-7 minlg:hidden'>
            
              Gallery
            
          </Link>

          <a
            target="_blank" href="https://docs.nft.com" rel="noopener noreferrer"
            className='flex flex-row w-full items-start text-[#fff] hover:text-[#F9D54C] text-[2.5rem] font-grotesk font-medium leading-9 pr-12 pb-3 mb-7 minlg:hidden'
          >
            Docs
          </a>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div className='text-black font-grotesk bg-white h-full p-8'>

        <div className='absolute top-11 right-4 hover:cursor-pointer w-6 h-6 bg-[#F9D963] rounded-full'></div>
        <XCircle onClick={() => setSidebarOpen(false)} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />

        <div className='flex flex-col h-max mt-20'>

          <a onClick={() => setSignIn(true)}
            className='hover:cursor-pointer flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3'
          >
            Sign in
          </a>

          <Link
            href='/app/discover'
            passHref
            onClick={() => setSidebarOpen(false)}
            className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'>
            
              Discover
            
          </Link>

          <Link
            href='/app/gallery'
            passHref
            onClick={() => setSidebarOpen(false)}
            className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'>
            
              Gallery
            
          </Link>

          <a
            target="_blank" href="https://docs.nft.com" rel="noopener noreferrer"
            className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'
          >
            Docs
          </a>
        </div>
      </motion.div>
    );
  }
}
