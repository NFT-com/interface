import ClientOnly from 'components/elements/ClientOnly';
import DefaultLayout from 'components/layouts/DefaultLayout';
import MintGKProfileCard from 'components/modules/ProfileFactory/MintGKProfileCard';
import MintPaidProfileCard from 'components/modules/ProfileFactory/MintPaidProfileCard';
import { useHasGk } from 'hooks/useHasGk';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowCircleLeft } from 'phosphor-react';
import NFTLogo from 'public/nft_logo.svg?svgr';
import NFTLogoSmall from 'public/nft_logo_small.svg?svgr';
import ProfileClickIcon from 'public/profile-click-icon.svg?svgr';
import ProfileIcon from 'public/profile-icon.svg?svgr';
import ProfileKeyIcon from 'public/profile-key-icon.svg?svgr';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const mintProfileTabs = {
  0: {
    displayName: 'Paid',
    tabName: 'paid'
  },
  1: {
    displayName: 'Genesis Key',
    tabName: 'gk'
  }
};
export default function MintProfilesPage() {
  const { openConnectModal } = useConnectModal();
  const { address: currentAddress } = useAccount();
  const [mintType, setMintType] = useState('paid');
  const hasGk = useHasGk();

  useMaybeCreateUser();

  useEffect(() => {
    if(!currentAddress && openConnectModal) {
      openConnectModal();
    }
  }, [currentAddress, openConnectModal]);

  return (
    <div
      className={tw(
        'flex flex-col relative w-full items-center bg-black',
        'overflow-y-auto -mb-20 pb-20 min-h-screen justify-between'
      )}
    >
      {/* Header */}
      <div
        className='bg-black h-max w-full overflow-hidden relative'
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
          <ClientOnly>
            {currentAddress && <ConnectButton />}
          </ClientOnly>
        </div>

        <div className='w-full max-w-nftcom mx-auto relative mt-10 minmd:mt-4 z-50'>
          <Link href='/'>
            <NFTLogoSmall className='mx-auto block minmd:hidden hover:cursor-pointer' />
          </Link>
          <div className='absolute bottom-2 minmd:top-2 left-6 minlg:right-1 hover:cursor-pointer w-7 h-7 bg-black rounded-full'></div>
          <Link href='/'>
            <ArrowCircleLeft className='absolute bottom-0 minmd:top-0 left-5 hover:cursor-pointer' size={45} color="white" weight="fill" />
          </Link>

          <Link href='/'>
            <NFTLogo className='mx-auto hidden minmd:block hover:cursor-pointer' />
          </Link>
          <div className=' justify-end mt-10 mr-5 flex minmd:hidden'>
            <ClientOnly>
              {currentAddress && <ConnectButton />}
            </ClientOnly>
          </div>

        </div>
        {/* Mint Card Component */}

        <div className='relative mt-16 minlg:mt-12 z-50 px-5'>
          <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
            <>
              <h2 className='text-[32px] font-medium'>{mintType === 'gk' ? 'Claim your free NFT Profile' : <p>Create Your <span className='font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBC214] to-[#FF9C38]'>NFT.com</span> Profile</p>}</h2>
              {hasGk && <div className='justify-start items-center flex mt-5'>
                <Tab.Group onChange={(index) => {setMintType(mintProfileTabs[index].tabName);}}>
                  <Tab.List className="w-full flex rounded-3xl z-10 bg-[#F6F6F6]">
                    {Object.keys(mintProfileTabs).map((chartType, index) => (
                      <Tab
                        key={chartType}
                        className={({ selected }) =>
                          tw(
                            'w-1/2 rounded-3xl font-medium py-2.5 md:px-5 px-8 font-noi-grotesk text-[16px] leading-5 text-[#6A6A6A]',
                            selected && 'bg-black text-[#FFFFFF]'
                          )
                        }
                      >
                        {mintProfileTabs[index].displayName}
                      </Tab>
                    ))}
                  </Tab.List>
                </Tab.Group>
              </div>
              }
              {mintType === 'paid' ? <MintPaidProfileCard type='mint' /> : <MintGKProfileCard />}
            </>
          </div>
        </div>

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
