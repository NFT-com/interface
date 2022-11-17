import { tw } from 'utils/tw';

import Link from 'next/link';
import ClaimProfileIcon from 'public/claim_profile_icon.svg';

export function ClaimProfileCard() {
  return (
    <div className="w-full h-full border-black border-[1.5px] rounded-[20px] py-6 minlg:px-5 text-center font-noi-grotesk">
      <div className='flex justify-center mb-4 minlg:mb-10'>
        <div className='h-6 w-14 minlg:h-[60px] minlg:w-[90px]'>
          <ClaimProfileIcon />
        </div>
      </div>
      
      <h3 className="mb-[10px] minlg:mb-6 font-semibold minlg:font-medium text-lg minlg:text-[27px]">Claim another profile</h3>
      <p className="mb-4 minlg:mb-10 text-[#6A6A6A]">You’re now a part of millions of creators, collectors, and curators.</p>
      <Link href={'/app/mint-profiles'}>
        <button
          type="button"
          className={tw(
            'inline-flex w-max minlg:w-full justify-center font-noi-grotesk uppercase',
            'rounded-full border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'px-4 py-2 font-medium text-black',
            'focus:outline-none focus-visible:bg-[#E4BA18]'
          )}
        >
            mint another profile
        </button>
      </Link>
    </div>
  );
}
