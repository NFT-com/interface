import { BidStatusIcon } from 'components/elements/BidStatusIcon';
import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import MintProfileModal from 'components/modules/ProfileFactory/MintProfileModal';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowCircleLeft } from 'phosphor-react';
import NFTLogo from 'public/nft_logo.svg';
import NFTLogoSmall from 'public/nft_logo_small.svg';
import ProfileClickIcon from 'public/profile-click-icon.svg';
import ProfileIcon from 'public/profile-icon.svg';
import ProfileKeyIcon from 'public/profile-key-icon.svg';
import { useCallback, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useAccount } from 'wagmi';

export default function MintProfilesPage() {
  const { address: currentAddress } = useAccount();
  const [currentURI, setCurrentURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [claimableIndex, setClaimableIndex] = useState(0);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [nextTokenIdWithClaimable, setNextTokenIdWithClaimable] = useState(null);
  const {
    profileTokenId,
    loading: loadingTokenId
  } = useProfileTokenQuery(currentURI);
  const { blocked: currentURIBlocked } = useProfileBlocked(currentURI, true);
  const { profileTokens } = useMyNftProfileTokens();
  const {
    claimable,
  } = useClaimableProfileCount(currentAddress);

  const closeModal = () => {
    setMintModalOpen(false);
    setMinting(false);
  };

  useEffect(() => {
    const allClaimableIds = (claimable ?? [])
      .filter(maybeClaimable => maybeClaimable?.claimable > 0)
      .map(maybeClaimable => maybeClaimable.tokenId)
      .sort();
    const nextClaimableToken = claimableIndex < allClaimableIds?.length ?
      allClaimableIds[claimableIndex] :
      allClaimableIds[0];
    setNextTokenIdWithClaimable(nextClaimableToken);
    if (claimableIndex >= allClaimableIds?.length) {
      setClaimableIndex(0);
    }
  }, [claimable, claimableIndex]);

  const getProfileStatus = useCallback(() => {
    if (isNullOrEmpty(currentURI)) {
      return null;
    }
    if (currentURIBlocked) {
      return ProfileStatus.Owned;
    }
    return profileTokenId == null ? ProfileStatus.Available : ProfileStatus.Owned;
  }, [currentURI, currentURIBlocked, profileTokenId]);

  const isProfileUnavailable = useCallback(() => {
    if (currentURIBlocked) {
      return true;
    }
    const status = getProfileStatus();
    return status != null && status === ProfileStatus.Owned;
  }, [currentURIBlocked, getProfileStatus]);

  const getProfileStatusText = useCallback((profileStatus, isOwner) => {
    switch (profileStatus) {
    case ProfileStatus.Available:
      return (
        <p className='text-[#2AAE47]'>Great! Profile name is available :)</p>
      );
    case ProfileStatus.Pending:
      return (
        <p>Pending Claim</p>
      );
    case ProfileStatus.Owned:
      return isOwner
        ? (
          <p className='text-[#2AAE47]'>You are the owner!</p>
        )
        : (
          <p className='text-[#F02D21]'>Sorry, profile name unavailable</p>
        );
    default:
      return null;
    }
  }, []);

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
        <div className='relative mt-28 minlg:mt-12 z-50 px-5'>
          <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
            <h2 className='text-[32px] w-5/6'>Claim your free NFT Profile</h2>
            <p className='mt-6 text-xl w-5/6'>Every wallet receives one <span className='text-secondary-yellow'>free mint!</span></p>
            <p className='mt-4 text-[#707070]'>Create your NFT Profile to build your social identity</p>

            <div className="relative w-full flex items-center  mt-6">
              <div className={tw(
                'left-0 pl-4 flex font-bold text-black',
                'rounded-l-lg bg-white py-3 text-lg',
                'bg-[#F8F8F8]'
              )}>
                NFT.com/
              </div>
              <input
                className={tw(
                  'text-lg min-w-0 ProfileNameInput',
                  'text-left px-3 py-3 w-full rounded-r-lg font-medium',
                  'bg-[#F8F8F8]'
                )}
                placeholder="Enter Profile Name"
                autoFocus={true}
                value={currentURI ?? ''}
                spellCheck={false}
                onChange={async e => {
                  if (minting) {
                    e.preventDefault();
                    return;
                  }
                  const validReg = /^[a-z0-9_]*$/;
                  if (
                    validReg.test(e.target.value.toLowerCase()) &&
                          e.target.value?.length <= PROFILE_URI_LENGTH_LIMIT
                  ) {
                    setCurrentURI(e.target.value.toLowerCase());
                  } else {
                    e.preventDefault();
                  }
                }}
              />
              <div className='absolute right-0 flex pointer-events-none pr-4 deprecated_sm:right-8'>
                {loadingTokenId
                  ? <Loader />
                  : <BidStatusIcon
                    whiteBackgroundOverride
                    status={getProfileStatus()}
                    isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI)}
                  />}
              </div>
            </div>
            <div className='mt-3'>
              {getProfileStatusText(getProfileStatus(), profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI))}
            </div>
            <button
              type="button"
              className={tw(
                'inline-flex w-full justify-center',
                'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                'px-4 py-4 text-lg font-medium text-black',
                'focus:outline-none focus-visible:bg-[#E4BA18] mt-12 minlg:mt-[59px]',
                'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
              )}
              disabled={
                isProfileUnavailable() ||
                isNullOrEmpty(currentURI)}
              onClick={async () => {
                if (
                  minting ||
                  isProfileUnavailable() ||
                  isNullOrEmpty(currentURI) ||
                  loadingTokenId
                ) {
                  return;
                }
                if (nextTokenIdWithClaimable == null || isNullOrEmpty(currentURI)) {
                  return;
                }
                setMinting(true);
                setMintModalOpen(true);
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your NFT profile</span>}
            </button>
            <p className='text-[#727272] text-left minlg:text-center mt-4 text-xl minlg:text-base font-normal'>
                Already have an account? <span className='text-black block minlg:inline font-medium'>Sign in</span>
            </p>
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