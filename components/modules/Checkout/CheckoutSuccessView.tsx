import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { processIPFSURL } from 'utils/helpers';

import { NFTListingsContext } from './NFTListingsContext';
import { NFTPurchasesContext } from './NFTPurchaseContext';

import { useRouter } from 'next/router';
import { Check } from 'phosphor-react';
import DesktopNoProfile from 'public/images/desktop_no_profile.svg';
import DesktopSuccessProfile from 'public/images/desktop_success_profile.svg';
import NullProfile from 'public/images/null_profile.svg';
import { useContext } from 'react';

export enum SuccessType {
  Purchase = 'Purchase',
  Listing = 'Listing'
}
export interface CheckoutSuccessViewProps {
  userAddress: string;
  type: SuccessType;
  subtitle?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CheckoutSuccessView(props: CheckoutSuccessViewProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const router = useRouter();

  const {
    toList,
  } = useContext(NFTListingsContext);

  const {
    toBuy,
  } = useContext(NFTPurchasesContext);

  const list = props.type === SuccessType.Listing ? toList : toBuy;

  const images = () => {
    if (list.length == 1) {
      return <div className='relative'>
        <RoundedCornerMedia
          containerClasses='w-[130px] h-[130px] mb-10 z-10'
          src={processIPFSURL(list[0]?.nft?.metadata?.imageURL)}
          variant={RoundedCornerVariant.Success}
        />
        <Check className={'absolute top-[-12px] right-[-12px] z-20 h-7 w-7 p-1 text-white font-medium aspect-square shrink-0 rounded-full -ml-4 bg-[#26AA73]'} />
      </div>;
    } else if (list.length > 1) {
      return <div className='relative'>
        <div className='flex flex-row justify-center items-center ml-16 mb-5'>
          {/* @ts-ignore */}
          {list?.filter((_, index) => index < 3).map((item, i) =>
            <RoundedCornerMedia
              key={i}
              containerClasses={`w-[${130 - (i * 10)}px] h-[${130 - (i * 10)}px] z-${50 - i * 10} -ml-16 shadow-xl`}
              src={processIPFSURL(item?.nft?.metadata?.imageURL)}
              variant={RoundedCornerVariant.Success}
            />
          )}
          {list.length > 3 &&
            <div className='flex items-center justify-end w-[90px] h-[90px] z-10 -ml-16 pr-2 bg-[#F9D54C] rounded-[18px]'>
              +{list.length - 3}
            </div>
          }
        </div>
        <Check className={`absolute ${list.length >= 3 ? 'top-0' : 'top-[-10px]'} right-[-13px] z-[100] h-7 w-7 p-1 text-white font-medium aspect-square shrink-0 rounded-full -ml-4 bg-[#26AA73]`} />
      </div>;
    }
  };

  const message = () => {
    return list.length > 1 ?
      `You have successfully ${props.type == SuccessType.Listing ? 'listed' : 'purchased'} ${list.length} NFTs` :
      `You have successfully ${props.type == SuccessType.Listing ? 'listed your' : 'purchased a'} NFT`;
  };

  return myOwnedProfileTokens?.length > 0 ?
    <div className="flex items-center h-[596px] font-noi-grotesk">
      <div onClick={() => router.push('/app/mint-profiles')} className='absolute bottom-5 left-7 hover:cursor-pointer underline text-[16px] z-50 font-medium flex items-center'>
        <NullProfile className='mr-2' />Create a NFT Profile
      </div>
      <div className="relative bg-gradient-to-br from-[#FAC213] to-[#FF9B37] h-full w-2/5 left-0">
        <DesktopSuccessProfile className="h-full w-full object-cover" />
      </div>
      <div className="relative h-full w-3/5 right-0">
        <div className='flex flex-col items-center justify-center h-full w-full px-10'>
          {images()}
          <div className='text-[34px] font-medium'>Congratulations!</div>
          <div className='text-[18px] font-medium mt-4'>{message()}</div>
          <div className='text-[16px] mt-10'>Let&apos;s continue your web3 journey</div>
          <button onClick={() => alert('ok')} className="bg-[#F9D963] w-[277px] my-8 font-medium hover:bg-[#fcd034] text-base text-black text-[14px] p-4 rounded-[12px] focus:outline-none focus:shadow-outline" type="button">
            Share your Listing
          </button>
          <div onClick={() => router.push('/app/assets')} className='text-[#E4BA18] font-medium underline text-[14px] cursor-pointer'>List another NFT</div>
        </div>
      </div>
    </div> :
    <div className="flex flex-col items-center h-[596px] font-noi-grotesk">
      <div className="relative bg-gradient-to-br from-[#FAC213] to-[#FF9B37] w-full h-2/5 top-0">
        <DesktopNoProfile className="h-full w-full object-cover" />
      </div>
      <div className="relative w-full h-3/5 bottom-0">
        <div className='flex flex-col items-center justify-center h-full w-full px-10'>
          <div className='text-[30px] font-medium text-center w-[400px] mt-10'>
            Get access to lower fees by creating an NFT Profile
          </div>
          <div className='w-[277px] flex flex-col text-[16px] mt-6'>
            <div className='flex item-center py-3 justify-between'>
              <div className='text-[#6A6A6A]'>With an NFT Profile</div>
              <div className='font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#FAC213] to-[#FF9B37]'>0% fee</div>
            </div>
            <div className='flex item-center py-3 justify-between border-t border-[#ECECEC]'>
              <div className='text-[#6A6A6A]'>Without an NFT Profile</div>
              <div className='font-medium line-through'>2.5% fee</div>
            </div>
          </div>
          <button onClick={() => router.push('/app/mint-profiles')} className="bg-[#F9D963] w-[277px] mt-8 mb-14 font-medium hover:bg-[#fcd034] text-base text-black text-[16px] p-4 rounded-[12px] focus:outline-none focus:shadow-outline" type="button">
            Create a Profile
          </button>
        </div>
      </div>
    </div>;
}