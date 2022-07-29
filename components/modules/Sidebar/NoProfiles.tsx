import { useSidebar } from 'hooks/state/useSidebar';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NoProfiles() {
  const { setSidebarOpen } = useSidebar();
  return (
    <motion.div>
      <h2 className='font-bold text-4xl mb-9 mt-24'>Get a Free Profile</h2>
      <p className='text-[#6F6F6F] mb-4 tracking-wide'>We want you to be part of our community and own your space on NFT.com. To that end, we want to give you a profile. </p>
      <p className='text-[#6F6F6F] tracking-wide'>Please join us in building our future together.</p>
      <Link href='/app/auctions'>
        <button onClick={() => setSidebarOpen(false)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-4 tracking-wide" type="button">
              Get a Profile
        </button>
      </Link>
    </motion.div>
  );
}
