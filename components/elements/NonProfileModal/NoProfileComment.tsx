import { useNonProfileModal } from 'hooks/state/useNonProfileModal';

import Image from 'next/image';
import preview from 'public/comment-preview-image.png';
import React from 'react';

export default function NoProfileComment(){
  const { likeData: { likedType } } = useNonProfileModal();

  return (
    <>
      <h2 className="mb-14 font-medium">Create your <span className="textColorGradient">NFT.com</span> Profile<br/> so you add {likedType} comments</h2>
      <Image src={preview} className={'w-full mb-12'} alt={`${likedType} Preview Image`} />
    </>
  );
}
