import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { sliceString } from 'utils/format';

import Image from 'next/image';
import previewCollection from 'public/collection-preview-image.webp';
import likeButton from 'public/icons/like-button.svg?svgr';
import previewNft from 'public/nft-preview-image.webp';
import previewProfile from 'public/profile-preview-image.webp';
import React from 'react';

export default function NoProfileLike(){
  const { likeData: { likedType, profileName } } = useNonProfileModal();

  const preview = () => {
    const type = likedType.toLowerCase();
    switch (type) {
    case 'nft': return previewNft;
    case 'collection': return previewCollection;
    case 'profile': return previewProfile;
    default: return previewNft;
    }
  };

  const checkWidth = () => {
    const type = likedType.toLowerCase();
    if(type === 'nft' || type === 'profile') {
      return 'w-[216px]';
    }else {
      return 'w-[311px]';
    }
  };

  return (
    <>
      <h2 className="mb-9 font-medium">Create your <span className="textColorGradient">NFT.com</span> Profile<br/> so you can like this {likedType}</h2>
      <Image src={preview()} className={`${checkWidth()} mb-4`} alt={`${likedType} Preview Image`} />
      {likedType.toLowerCase() === 'profile'
        ? (
          <div className='text-[44px] flex items-center justify-between -mt-[3rem] mb-10'>
            <span className='text-[#FAC213]'>/</span>{sliceString(profileName, 14, false)}
            <Image src={likeButton} className='w-[40px] ml-4' alt={`${likedType} Preview Image`} />
          </div>
        )
        : null}
    </>
  );
}
