import GalleryCard from 'components/elements/GalleryCard';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { formatID, getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { BigNumber, BigNumberish } from 'ethers';
import React from 'react';

export interface GenesisKeyGalleryCardProps {
  id: BigNumberish;
  onClick: () => void;
}

function GenesisKeyGalleryCard(props: GenesisKeyGalleryCardProps) {
  const genesisKeyMetadata = useGenesisKeyMetadata(props.id);

  const thumbnail = getGenesisKeyThumbnail(props.id);
  const gkImage = isNullOrEmpty(thumbnail) ?
    processIPFSURL(genesisKeyMetadata?.metadata?.image) :
    thumbnail;

  return <GalleryCard
    onClick={props.onClick}
    imageURL={gkImage}
    label={formatID(BigNumber.from(props.id))}
    animate
  />;
}

const GenesisKeyGalleryCardMemo = React.memo(
  GenesisKeyGalleryCard,
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  }
);

GenesisKeyGalleryCardMemo.displayName = 'GenesisKeyGalleryCard';

export default GenesisKeyGalleryCardMemo;