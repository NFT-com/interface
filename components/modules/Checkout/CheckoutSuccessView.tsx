
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnvBool } from 'utils/env';

import { CheckCircle } from 'phosphor-react';
import DesktopSuccessProfile from 'public/images/desktop_success_profile.svg';

export interface CheckoutSuccessViewProps {
  userAddress: string;
  subtitle?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CheckoutSuccessView(props: CheckoutSuccessViewProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();

  if (!getEnvBool(Doppler.NEXT_PUBLIC_NFT_OFFER_RESKIN_ENABLED)) {
    return <div className="flex flex-col items-center my-8">
      <CheckCircle size={60} className="text-green-500 mb-4" />
      <span className="text-lg">{props?.subtitle || ''}</span>
    </div>;
  } else {
    return myOwnedProfileTokens?.length > 0 ?
      <div className="flex items-center h-[596px] font-noi-grotesk">
        <div className="relative bg-gradient-to-br from-[#FAC213] to-[#FF9B37] h-full w-2/5 left-0">
          <DesktopSuccessProfile className="h-full w-full object-cover" />
        </div>
        <div className="relative h-full w-3/5 right-0">
          <div className='flex flex-col items-center justify-center h-full w-full px-10'>
            <div>Congratulations!</div>
            <div>Your listing is now live on nft.com</div>
            <div>Let&apos;s continue your web3 journey</div>
            <button onClick={() => alert('ok')} className="bg-[#F9D963] w-[277px] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[12px] focus:outline-none focus:shadow-outline mt-6" type="button">
            Share your Listing
            </button>
            <div>List another NFT</div>
          </div>
        </div>
      </div> :
      <div>
        nope
      </div>;
  }
}