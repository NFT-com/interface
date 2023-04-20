import React from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import router from 'next/router';

import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { sliceString } from 'utils/format';

import previewCollection from 'public/collection-preview-image.webp';
import likeButton from 'public/icons/like-button.svg?svgr';
import previewNft from 'public/nft-preview-image.webp';
import previewProfile from 'public/profile-preview-image.webp';

import { Button, ButtonSize, ButtonType } from './Button';
import { Modal } from './Modal';

export default function NonAuthLikeModal() {
  const {
    isOpen,
    likeData: { likedType, profileName },
    setLikeData
  } = useNonProfileModal();
  const { openConnectModal } = useConnectModal();

  const preview = () => {
    const type = likedType.toLowerCase();
    switch (type) {
      case 'nft':
        return previewNft;
      case 'collection':
        return previewCollection;
      case 'profile':
        return previewProfile;
      default:
        return previewNft;
    }
  };

  const checkWidth = () => {
    const type = likedType.toLowerCase();
    if (type === 'nft' || type === 'profile') {
      return 'w-[216px]';
    }
    return 'w-[311px]';
  };

  return (
    <Modal
      dark={false}
      pure
      closeBtnNoPaddings={true}
      visible={isOpen}
      loading={false}
      title={''}
      onClose={() => setLikeData(false)}
    >
      <div className='flex flex-col items-center p-20 font-noi-grotesk text-4xl'>
        <h2 className='mb-9 font-medium'>
          Create your <span className='textColorGradient'>NFT.com</span> Profile
          <br /> so you can like this {likedType}
        </h2>
        <Image src={preview()} className={`${checkWidth()} mb-4`} alt={`${likedType} Preview Image`} />
        {likedType.toLowerCase() === 'profile' ? (
          <div className='-mt-[3rem] mb-10 flex items-center justify-between text-[44px]'>
            <span className='text-[#FAC213]'>/</span>
            {sliceString(profileName, 14, false)}
            <Image src={likeButton} className='ml-4 w-[40px]' alt={`${likedType} Preview Image`} />
          </div>
        ) : null}
        <Button
          size={ButtonSize.XLARGE}
          stretch
          label={'Create profile'}
          type={ButtonType.PRIMARY}
          onClick={() => {
            setLikeData(false);
            router.push('/app/mint-profiles');
          }}
        />
        <div className='mt-4 text-xl	text-[#6A6A6A]'>
          Already have an account?
          <span
            onClick={() => {
              openConnectModal();
              setLikeData(false);
            }}
          >
            <a className='cursor-pointer font-medium text-black hover:text-[#6A6A6A]'> Sign in</a>
          </span>
        </div>
      </div>
    </Modal>
  );
}
