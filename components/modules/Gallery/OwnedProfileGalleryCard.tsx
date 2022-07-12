import GalleryCard from 'components/elements/GalleryCard';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { AlchemyOwnedNFT } from 'types';

export interface OwnedProfileGalleryCardProps {
  token: AlchemyOwnedNFT;
  onClick: () => void;
}

export function OwnedProfileGalleryCard(props: OwnedProfileGalleryCardProps) {
  const { profileData } = useProfileQuery(props.token?.tokenUri?.raw?.split('/').pop());
  const image = isNullOrEmpty(profileData?.profile?.photoURL)
    ? 'https://cdn.nft.com/nullPhoto.png'
    : processIPFSURL(profileData?.profile?.photoURL);

  return <GalleryCard
    size='small'
    animate={false}
    label={''}
    imageURL={image}
    onClick={props.onClick}
  />;
}