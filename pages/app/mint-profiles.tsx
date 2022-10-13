import DefaultLayout from 'components/layouts/DefaultLayout';
import MintFreeProfileCard from 'components/modules/ProfileFactory/MintFreeProfileCard';
import MintGKProfileCard from 'components/modules/ProfileFactory/MintGKProfileCard';
import MintProfileCardSkeleton from 'components/modules/ProfileFactory/MintProfileCardSkeleton';
import MintProfileModal from 'components/modules/ProfileFactory/MintProfileModal';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowCircleLeft } from 'phosphor-react';
import NFTLogo from 'public/nft_logo.svg';
import NFTLogoSmall from 'public/nft_logo_small.svg';
import ProfileClickIcon from 'public/profile-click-icon.svg';
import ProfileIcon from 'public/profile-icon.svg';
import ProfileKeyIcon from 'public/profile-key-icon.svg';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
export default function MintProfilesPage() {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { freeMintAvailable, loading: loadingFreeMint } = useFreeMintAvailable(currentAddress);
  const { claimable, loading: loadingClaimable } = useClaimableProfileCount(currentAddress);
  const [modalOpen, setModalOpen] = useState(false);
  const [mintingState, setMintingState] = useState(
    {
      inputs: null,
      tokenId: null,
      type: null
    }
  );
  
  useMaybeCreateUser();

  useEffect(() => {
    if(!currentAddress) {
      router.push('/');
    }
  }, [currentAddress, router]);

  const getMintProfileCard = useCallback(() => {
    if(!loadingClaimable && !isNullOrEmpty(claimable) && !freeMintAvailable && !loadingFreeMint) {
      return <MintGKProfileCard setModalOpen={setModalOpen} setMintingState={setMintingState} />;
    }

    if(!loadingFreeMint && freeMintAvailable && !loadingClaimable && isNullOrEmpty(claimable)) {
      return <MintFreeProfileCard type='Free' setModalOpen={setModalOpen} setMintingState={setMintingState}/>;
    }

    if(!loadingFreeMint && !freeMintAvailable && !loadingClaimable && isNullOrEmpty(claimable)) {
      return <MintFreeProfileCard type='Paid' setModalOpen={setModalOpen} setMintingState={setMintingState} />;
    }

    return <MintProfileCardSkeleton />;
  }, [claimable, freeMintAvailable, loadingClaimable, loadingFreeMint]);

  if (!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
    return <NotFoundPage />;
  }
  
  return (
    <div
      className={tw(
        'flex flex-col relative w-full items-center bg-black',
        'overflow-y-auto'
      )}
    >
      {/* Header */}
      <div
        className='bg-black h-max w-full relative'
      >
        <div className='h-full w-full absolute top-0 opacity-60' style={{ backgroundImage: 'url(/temp-intro.png)' }}></div>
        <div className='justify-end mt-10 mr-5 hidden minmd:flex'>
          <ConnectButton />
        </div>
        
        <div className='w-full max-w-nftcom mx-auto relative mt-10 minmd:mt-4'>
          <Link href='/'>
            <a>
              <NFTLogoSmall className='mx-auto block minmd:hidden hover:cursor-pointer' />
            </a>
          </Link>
          <div className='absolute top-2 left-6 minlg:right-1 hover:cursor-pointer w-7 h-7 bg-black rounded-full'></div>
          <Link href='/'>
            <ArrowCircleLeft className='absolute bottom-0 minmd:top-0 left-5 hover:cursor-pointer' size={45} color="white" weight="fill" />
          </Link>

          <Link href='/'>
            <a>
              <NFTLogo className='mx-auto hidden minmd:block hover:cursor-pointer' />
            </a>
          </Link>
          <div className=' justify-end mt-10 mr-5 flex minmd:hidden'>
            <ConnectButton />
          </div>
          
        </div>

        {/* Mint Card Component */}
        {getMintProfileCard()}
        
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
          <p className='mt-3 text-lg text-[#9C9C9C]'>Buy and sell NFTs across marketplaces with the build in marketplace aggregator.</p>
        </div>
      </div>

      <MintProfileModal isOpen={modalOpen} setIsOpen={setModalOpen} profilesToMint={mintingState.inputs} gkTokenId={mintingState.tokenId} type={mintingState.type} />
    </div>
  );
}

MintProfilesPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout hideHeader={getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) ? true : false}>
      { page }
    </DefaultLayout>
  );
};