import DefaultLayout from 'components/layouts/DefaultLayout';
import MintProfileInputCard from 'components/modules/ProfileFactory/MintProfileInputCard';
import MintProfileModal from 'components/modules/ProfileFactory/MintProfileModal';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowCircleLeft } from 'phosphor-react';
import NFTLogo from 'public/nft_logo.svg';
import NFTLogoSmall from 'public/nft_logo_small.svg';
import ProfileClickIcon from 'public/profile-click-icon.svg';
import ProfileIcon from 'public/profile-icon.svg';
import ProfileKeyIcon from 'public/profile-key-icon.svg';
import { useState } from 'react';

export default function MintProfilesPage() {
  const [currentURI, setCurrentURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintModalOpen, setMintModalOpen] = useState(false);

  const closeModal = () => {
    setMintModalOpen(false);
    setMinting(false);
  };

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
        <div className='flex justify-end mt-10 mr-5'>
          <ConnectButton />
        </div>
        <div className='w-full max-w-nftcom mx-auto relative mt-4'>
          <div className='absolute top-2 left-6 minlg:right-1 hover:cursor-pointer w-7 h-7 bg-black rounded-full'></div>
          <Link href='/'>
            <ArrowCircleLeft className='absolute top-0 left-5 hover:cursor-pointer' size={45} color="white" weight="fill" />
          </Link>
          <NFTLogo className='mx-auto hidden minmd:block' />
          <NFTLogoSmall className='mx-auto block minmd:hidden' />
        </div>

        {/* Input Card Component */}
        <MintProfileInputCard currentURI={currentURI} setCurrentURI={setCurrentURI} setMintModalOpen={setMintModalOpen} minting={minting} setMinting={setMinting} />
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
      <MintProfileModal isOpen={mintModalOpen} setIsOpen={closeModal} currentURI={currentURI} />
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