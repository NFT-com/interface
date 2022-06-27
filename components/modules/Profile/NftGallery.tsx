import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { ProfileLayoutType } from 'graphql/generated/types';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';

import { NftGrid } from './NftGrid';
import { ProfileEditContext } from './ProfileEditContext';

import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
export interface NftGalleryProps {
  profileURI: string;
  savedLayoutType: ProfileLayoutType;
}

export const PROFILE_GALLERY_PAGE_SIZE = 20;

export function NftGallery(props: NftGalleryProps) {
  const { profileURI } = props;

  // todo: proper pagination to avoid overfetching here.
  const [loadedCount, setLoadedCount] = useState(PROFILE_GALLERY_PAGE_SIZE);

  const { data: account } = useAccount();
  const { profileData } = useProfileQuery(profileURI);
  const isAdmin = profileData?.profile?.owner?.address?.toLowerCase() === account?.address?.toLowerCase();
  const { data: allOwnerNFTs, totalItems: ownerNFTCount } = useMyNFTsQuery(loadedCount);
  const { nfts: profileNFTs, totalItems: publicNFTCount, mutate: mutateProfileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    loadedCount
  );
  const { editMode, saving } = useContext(ProfileEditContext);

  useEffect(() => {
    mutateProfileNFTs();
  }, [editMode, mutateProfileNFTs, saving]);

  if (allOwnerNFTs == null || profileNFTs == null || profileData == null || saving) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && (allOwnerNFTs.length ?? 0) === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const detailedOwnerNFTs = allOwnerNFTs.map(nft => {
    if (profileNFTs.find(nft2 => nft2.id === nft.id)) {
      return {
        ...nft,
        hidden: false
      };
    } else {
      return {
        ...nft,
        hidden: true
      };
    }
  });

  const nftsToShow = editMode ?
    (detailedOwnerNFTs ?? []) :
    (profileNFTs ?? []);

  return (
    <>
      <NftGrid nfts={nftsToShow} profileURI={profileURI} savedLayoutType={profileData?.profile?.layoutType}/>
      {(!isAdmin || editMode) &&
      (editMode ? ownerNFTCount > nftsToShow.length : publicNFTCount > nftsToShow.length) &&
        <div className="mx-auto w-full min3xl:w-3/5 flex justify-center pb-8 font-medium text-always-white">
          <Button
            color={'text-always-white'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Load More'}
            onClick={() => {
              setLoadedCount(loadedCount + PROFILE_GALLERY_PAGE_SIZE);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      }
    </>
  );
}