import { ProfileQuery } from 'graphql/generated/types';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

interface FeaturedProfileProps {
  profileOwner: ProfileQuery;
  gkId: number;
  pfpUrl: string;
}

export const FeaturedProfile = (props: FeaturedProfileProps) => {
  const genesisKeyMetadata = useGenesisKeyMetadata(props.gkId);

  const gkThumbnail = getGenesisKeyThumbnail(props.gkId);

  const gkImage = isNullOrEmpty(gkThumbnail) ?
    processIPFSURL(genesisKeyMetadata?.metadata?.image) :
    gkThumbnail;

  const image = processIPFSURL(props.profileOwner?.profile?.photoURL);

  return (
    <div className='pt-6 text-body text-secondary-txt-light leading-body font-header justify-center ...'>
      Featured Profile
      <RoundedCornerMedia
        extraClasses='pt-2 w-full'
        variant={RoundedCornerVariant.All}
        src={gkImage}
        overlayOptions={
          {
            profileOwner: props.profileOwner?.profile?.url,
            gkId: props?.gkId,
            pfp: image
          }}
      />
    </div>
  );
};