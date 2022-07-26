import { useSidebar } from 'hooks/state/useSidebar';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle } from 'phosphor-react';

type SignInProps = {
  profileValue?: string;
  setProfileValue?: any;
};

export default function SignIn({ setProfileValue, profileValue }: SignInProps) {
  const { setSidebarOpen } = useSidebar();
  const { openConnectModal } = useConnectModal();
  return (
    <motion.div className='text-black font-grotesk bg-white h-full p-8'>
               
      <XCircle onClick={() => {setSidebarOpen(false);}} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
                
      <h2 className='font-bold text-4xl mb-9 pt-24'>Sign In</h2>

      <p className='text-[#6F6F6F]'>Enter your profile and connect your wallet.</p>
      <input onChange={(e) => setProfileValue(e.target.value.trim())} className="shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-4" id="account" type="text" placeholder="Profile Name" />
      <button onClick={openConnectModal} disabled={!profileValue} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-4" type="button">
                  Sign in with Profile
      </button>

      <h2 className='font-bold text-4xl my-9'>Or</h2>
      <p className='text-[#6F6F6F]'>Maybe you don’t have one yet?</p>
      <button onClick={openConnectModal} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-4" type="button">
                  Connect with Wallet
      </button>

      <h3 className='mb-4 mt-9 text-3xl font-bold'>Have no idea what we’re talking about?</h3>
      <Link href='#' >
        <span className='underline mt-4 hover:cursor-pointer text-[#6F6F6F]'>Wallets! Learn about them by clicking here.</span>
      </Link>
      <br className='mt-4'/>
      <a target="_blank" href="https://docs.nft.com/profiles/what-is-a-nft.com-profile" rel="noopener noreferrer">
        <p className='underline mt-4 hover:cursor-pointer text-[#6F6F6F]'>Profiles are great! Click here to learn more.</p>
      </a>
    </motion.div>
  );
}
