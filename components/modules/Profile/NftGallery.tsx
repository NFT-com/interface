import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { ProfileLayoutType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';

import { NftGrid } from './NftGrid';
import { ProfileContext } from './ProfileContext';

import { useContext } from 'react';
export interface NftGalleryProps {
  profileURI: string;
  savedLayoutType: ProfileLayoutType;
}

export function NftGallery(props: NftGalleryProps) {
  const { profileURI } = props;

  const { profileData } = useProfileQuery(profileURI);
  const {
    editMode,
    saving,
    allOwnerNfts,
    allOwnerNftCount,
    publiclyVisibleNfts,
    publiclyVisibleNftCount,
    loadMoreNfts
  } = useContext(ProfileContext);

  if (allOwnerNfts == null || publiclyVisibleNfts == null || profileData == null || saving) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && allOwnerNftCount === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const nftsToShow = editMode ?
    [
      ...publiclyVisibleNfts.map(nft => ({ ...nft, hidden: false })),
      ...allOwnerNfts.filter(nft => publiclyVisibleNfts.find(nft2 => nft2.id === nft.id) == null).map(nft => ({ ...nft, hidden: true }))
    ] :
    (publiclyVisibleNfts ?? []);

  return (
    <>
      <NftGrid nfts={nftsToShow} profileURI={profileURI} />
      {
        (editMode ? allOwnerNftCount > nftsToShow.length : publiclyVisibleNftCount > nftsToShow.length) &&
          <div className="mx-auto w-full min3xl:w-3/5 flex justify-center pb-8 font-medium">
            <Button
              color={'white'}
              accent={AccentType.SCALE}
              stretch={true}
              label={'Load More'}
              onClick={loadMoreNfts}
              type={ButtonType.PRIMARY}
            />
          </div>
      }
    </>
  );
}