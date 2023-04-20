import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowCircleLeft } from 'phosphor-react';
import { useAccount } from 'wagmi';

import ClientOnly from 'components/elements/ClientOnly';
import { Tabs } from 'components/elements/Tabs';
import DefaultLayout from 'components/layouts/DefaultLayout';
import MintGKProfileCard from 'components/modules/ProfileFactory/MintGKProfileCard';
import MintPaidProfileCard from 'components/modules/ProfileFactory/MintPaidProfileCard';
import { useHasGk } from 'hooks/useHasGk';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { tw } from 'utils/tw';

import NFTLogo from 'public/icons/nft_logo.svg?svgr';
import NFTLogoSmall from 'public/icons/nft_logo_small.svg?svgr';
import ProfileClickIcon from 'public/icons/profile-click-icon.svg?svgr';
import ProfileIcon from 'public/icons/profile-icon.svg?svgr';
import ProfileKeyIcon from 'public/icons/profile-key-icon.svg?svgr';

export default function MintProfilesPage() {
  const { openConnectModal } = useConnectModal();
  const { address: currentAddress } = useAccount();
  const [mintType, setMintType] = useState('paid');
  const hasGk = useHasGk();

  useMaybeCreateUser();

  useEffect(() => {
    if (!currentAddress && openConnectModal) {
      openConnectModal();
    }
  }, [currentAddress, openConnectModal]);

  const tabs = [
    {
      label: 'Paid',
      content: <MintPaidProfileCard type='mint' />
    },
    {
      label: 'Genesis Key',
      content: <MintGKProfileCard />
    }
  ];

  return (
    <div
      className={tw(
        'relative flex w-full flex-col items-center bg-black',
        '-mb-20 min-h-screen justify-between overflow-y-auto pb-20'
      )}
    >
      {/* Header */}
      <div className='relative h-max w-full overflow-hidden bg-black'>
        <Player
          autoplay
          loop
          src='/anim/cycle.json'
          style={{ width: '100%' }}
          className='absolute mx-auto opacity-60'
        ></Player>
        <div className='mr-5 mt-10 hidden justify-end minmd:flex'>
          <ClientOnly>{currentAddress && <ConnectButton />}</ClientOnly>
        </div>

        <div className='relative z-50 mx-auto mt-10 w-full max-w-nftcom minmd:mt-4'>
          <Link href='/'>
            <NFTLogoSmall className='mx-auto block hover:cursor-pointer minmd:hidden' />
          </Link>
          <div className='absolute bottom-2 left-6 h-7 w-7 rounded-full bg-black hover:cursor-pointer minmd:top-2 minlg:right-1'></div>
          <Link href='/'>
            <ArrowCircleLeft
              className='absolute bottom-0 left-5 hover:cursor-pointer minmd:top-0'
              size={45}
              color='white'
              weight='fill'
            />
          </Link>

          <Link href='/'>
            <NFTLogo className='mx-auto hidden hover:cursor-pointer minmd:block' />
          </Link>
          <div className=' mr-5 mt-10 flex justify-end minmd:hidden'>
            <ClientOnly>{currentAddress && <ConnectButton />}</ClientOnly>
          </div>
        </div>
        {/* Mint Card Component */}

        <div className='relative z-50 mt-16 px-5 minlg:mt-12'>
          <div className='mx-auto max-w-[600px] rounded-[20px] bg-white px-4 pb-10 pt-6 font-medium minmd:px-12 minmd:pt-[64px] minlg:px-[76px]'>
            <>
              <h2 className='mb-5 text-[32px] font-medium'>
                {mintType === 'Genesis Key' ? (
                  'Claim your free NFT Profile'
                ) : (
                  <p>
                    Create Your{' '}
                    <span className='bg-gradient-to-r from-[#FBC214] to-[#FF9C38] bg-clip-text font-bold text-transparent'>
                      NFT.com
                    </span>{' '}
                    Profile
                  </p>
                )}
              </h2>
              {hasGk ? <Tabs tabOptions={tabs} onTabChange={setMintType} /> : <MintPaidProfileCard type='mint' />}
            </>
          </div>
        </div>

        <span className='absolute bottom-0 left-0 h-[460px] w-full bg-img-shadow'></span>
      </div>

      {/* 3 Col Component */}
      <div className='mx-auto grid w-full max-w-nftcom grid-cols-1 gap-6 bg-black px-5 py-16 text-white minlg:grid-cols-3 minlg:gap-24 minlg:py-[100px]'>
        <div className='pt-[14px]'>
          <ProfileIcon />
          <h3 className='mt-3 text-[28px]'>Create your NFT Profile</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>
            Create a unique profile that is itself an NFT. It&apos;s your profile, you should own it.
          </p>
        </div>
        <div>
          <ProfileClickIcon />
          <h3 className='mt-3 text-[28px]'>Promote Your Collection</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>
            Connect any address or NFT collection to your NFT Profile to show off your work.
          </p>
        </div>
        <div>
          <ProfileKeyIcon />
          <h3 className='mt-3 text-[28px]'>Trade NFTs</h3>
          <p className='mt-3 text-lg text-[#9C9C9C]'>
            Buy and sell NFTs across marketplaces with the built in marketplace aggregator.
          </p>
        </div>
      </div>
    </div>
  );
}

MintProfilesPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout hideSearch hideHeader={true}>
      {page}
    </DefaultLayout>
  );
};
