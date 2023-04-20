import Link from 'next/link';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';

import ClaimProfileIcon from 'public/icons/claim_profile_icon.svg?svgr';

export function ClaimProfileCard() {
  return (
    <div className='h-full w-full rounded-[20px] border-[1.5px] border-black py-6 text-center font-noi-grotesk minlg:px-5'>
      <div className='mb-4 flex justify-center minlg:mb-10'>
        <div className='h-6 w-14 minlg:h-[60px] minlg:w-[90px]'>
          <ClaimProfileIcon />
        </div>
      </div>

      <h3 className='mb-[10px] text-lg font-semibold minlg:mb-6 minlg:text-[27px] minlg:font-medium'>
        Claim another profile
      </h3>
      <p className='mb-4 text-[#6A6A6A] minlg:mb-10'>
        You’re now a part of millions of creators, collectors, and curators.
      </p>
      <Link href={'/app/mint-profiles'}>
        <Button onClick={() => null} label='mint another profile' type={ButtonType.PRIMARY} size={ButtonSize.LARGE} />
      </Link>
    </div>
  );
}
