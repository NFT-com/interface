import DefaultLayout from 'components/layouts/DefaultLayout';
import MintFreeProfileCard from 'components/modules/ProfileFactory/MintFreeProfileCard';
import MintGKProfileCard from 'components/modules/ProfileFactory/MintGKProfileCard';
import MintPaidProfileCard from 'components/modules/ProfileFactory/MintPaidProfileCard';
import MintProfileCardSkeleton from 'components/modules/ProfileFactory/MintProfileCardSkeleton';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Player } from '@lottiefiles/react-lottie-player';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowCircleLeft } from 'phosphor-react';
import NFTLogo from 'public/nft_logo.svg';
import NFTLogoSmall from 'public/nft_logo_small.svg';
import ProfileClickIcon from 'public/profile-click-icon.svg';
import ProfileIcon from 'public/profile-icon.svg';
import ProfileKeyIcon from 'public/profile-key-icon.svg';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
export default function MintProfilesPage() {
  const { openConnectModal } = useConnectModal();
  const { address: currentAddress } = useAccount();
  const { freeMintAvailable } = useFreeMintAvailable(currentAddress);
  const { claimable } = useClaimableProfileCount(currentAddress);
  
  useMaybeCreateUser();

  useEffect(() => {
    if(!currentAddress && openConnectModal) {
      openConnectModal();
    }
  }, [currentAddress, openConnectModal]);

  const getMintProfileCard = useCallback(() => {
    if(freeMintAvailable) {
      return <MintFreeProfileCard/>;
    }
    if(!isNullOrEmpty(claimable) && !freeMintAvailable) {
      return <MintGKProfileCard />;
    }
    if(freeMintAvailable && isNullOrEmpty(claimable)) {
      return <MintFreeProfileCard />;
    }
    if(!freeMintAvailable && isNullOrEmpty(claimable)) {
      return <MintPaidProfileCard />;
    }
    return <MintProfileCardSkeleton />;
  }, [claimable, freeMintAvailable]);
  
  return (
    <div
      className={tw(
        'flex flex-col relative w-full items-center bg-black',
        'overflow-y-auto -mb-20 pb-20'
      )}
    >
      {/* Header */}
      <div
        className='bg-black h-max w-full relative overflow-hidden'
      >
        <Player
          autoplay
          loop
          src="/anim/cycle.json"
          style={{ width: '100%' }}
          className='opacity-60 absolute mx-auto'
        >
        </Player>
        <div className='justify-end mt-10 mr-5 hidden minmd:flex'>
          {currentAddress && <ConnectButton />}
        </div>
        
        <div className='w-full max-w-nftcom mx-auto relative mt-10 minmd:mt-4 z-50'>
          <Link href='/'>
            <a>
              <NFTLogoSmall className='mx-auto block minmd:hidden hover:cursor-pointer' />
            </a>
          </Link>
          <div className='absolute bottom-2 minmd:top-2 left-6 minlg:right-1 hover:cursor-pointer w-7 h-7 bg-black rounded-full'></div>
          <Link href='/'>
            <ArrowCircleLeft className='absolute bottom-0 minmd:top-0 left-5 hover:cursor-pointer' size={45} color="white" weight="fill" />
          </Link>

          <Link href='/'>
            <a>
              <NFTLogo className='mx-auto hidden minmd:block hover:cursor-pointer' />
            </a>
          </Link>
          <div className=' justify-end mt-10 mr-5 flex minmd:hidden'>
            {currentAddress && <ConnectButton />}
          </div>
          
        </div>

        {/* Mint Card Component */}
        {getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED) ?
          getMintProfileCard()
          :
          <MintGKProfileCard />
        }
        
        <span className='absolute w-full h-[460px] left-0 bottom-0 bg-img-shadow'></span>
      </div>
      
      {/* 3 Col Component */}
      <div className='bg-black grid grid-cols-1 minlg:grid-cols-3 gap-6 minlg:gap-24 text-white py-16 minlg:py-[100px] w-full max-w-nftcom mx-auto px-5'>
        <div className='pt-[14px]'>
          <ProfileIcon />
          <h3 className='text-[28px] mt-3'>Create your NFT Profile</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>Create a unique profile that is itself an NFT. It&apos;s your profile, you should own it.</p>
        </div>
        <div>
          <ProfileClickIcon />
          <h3 className='text-[28px] mt-3'>Promote Your Collection</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>Connect any address or NFT collection to your NFT Profile to show off your work.</p>
        </div>
        <div>
          <ProfileKeyIcon />
          <h3 className='text-[28px] mt-3'>Trade NFTs</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>Buy and sell NFTs across marketplaces with the built in marketplace aggregator.</p>
        </div>
      </div>
    </div>
  );
}

MintProfilesPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout hideSearch hideHeader={true}>
      { page }
    </DefaultLayout>
  );
};