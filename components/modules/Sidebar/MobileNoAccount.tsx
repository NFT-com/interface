import { useSidebar } from 'hooks/state/useSidebar';
import { Doppler, getEnvBool } from 'utils/env';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle } from 'phosphor-react';

type MobileNoAccountProps = {
  setSignIn: (input: boolean) => void
}

export default function MobileNoAccount({ setSignIn } : MobileNoAccountProps) {
  const { setSidebarOpen } = useSidebar();

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

        {getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) &&
          <Link href='/app/discover' passHref>
            <a onClick={() => setSidebarOpen(false)}
              className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'
            >
            Discover
            </a>
          </Link>
        }

        <Link href='/app/gallery' passHref>
          <a onClick={() => setSidebarOpen(false)}
            className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'
          >
              Gallery
          </a>
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
