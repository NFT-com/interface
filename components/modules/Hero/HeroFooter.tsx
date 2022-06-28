import { tw } from 'utils/tw';

import moment from 'moment';
import Image from 'next/image';

export default function HeroFooter() {
  return (
    <div
      id="footerSection"
      className={tw(
        'relative',
        'pl-5 py-8 deprecated_minmd:py-5 flex flex-col',
        'w-full items-left',
        'bg-always-black'
      )}
    >
      <div className="text-grey-txt font-hero-heading1 flex items-center">
        <div className="h-10 w-10 text-always-white mr-1 relative">
          <Image
            src={'https://cdn.nft.com/hero_corner_gray.svg'}
            alt="nft.com"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <span>NFT.COM</span>
      </div>
      <div className={tw(
        'flex flex-col items-lefts mt-4',
        'deprecated_minxs2:mr-20 text-grey-txt max-w-[75%]')}>
        <span className='text-base font-normal'>
          © {moment().year()} NFT.com. All rights reserved &nbsp;
        </span>
        <div className="">
          <a href='https://announcements.nft.com'>
            <span className='cursor-pointer decoration-white underline-nonee'>
              Announcements
            </span>
          </a>
          <a href='https://support.nft.com'>
            <span className='cursor-pointer decoration-white underline-nonee'>
              &nbsp;|&nbsp; FAQ
            </span>
          </a>
          <a href="https://cdn.nft.com/nft_com_terms_of_service.pdf">
            <span className='cursor-pointer decoration-white underline-nonee'>
              &nbsp;|&nbsp; Terms of Service
            </span>
          </a>
          <a href="https://cdn.nft.com/nft_com_privacy_policy.pdf">
            <span className='cursor-pointer decoration-white underline-none'>
              &nbsp;|&nbsp;Privacy Policy
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}