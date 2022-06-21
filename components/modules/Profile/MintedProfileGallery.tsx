import { Switch } from 'components/elements/Switch';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery, PROFILE_GALLERY_PAGE_SIZE } from './NftGallery';
import { ProfileEditContext } from './ProfileEditContext';

import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;
}

export function MintedProfileGallery(props: MintedProfileGalleryProps) {
  const {
    editMode,
    onShowAll,
    onHideAll,
    draftDisplayType,
    setDraftDisplayType,
    selectedCollection
  } = useContext(ProfileEditContext);
  
  const { data: account } = useAccount();
  const { profileData } = useProfileQuery(props.profileURI);
  const { totalItems: publicNFTCount } = useProfileNFTsQuery(
    profileData?.profile?.id,
    PROFILE_GALLERY_PAGE_SIZE
  );

  return (
    <div className={tw(
      'flex flex-col mt-8 align-items',
      isMobile ? 'px-2' : 'sm:px-2 md:px-12 lg:px-20 px-32'
    )}>
      {editMode && selectedCollection == null &&
        <div className="justify-between flex items-center w-full mb-12 px-8 text-white">
          <div>
            <Switch
              left=""
              right="Group by Collection"
              enabled={
                (
                  profileData?.profile?.displayType === ProfileDisplayType.Collection &&
                  draftDisplayType !== ProfileDisplayType.Nft
                ) || draftDisplayType === ProfileDisplayType.Collection
              }
              setEnabled={(enabled: boolean) => {
                setDraftDisplayType(enabled ? ProfileDisplayType.Collection : ProfileDisplayType.Nft);
              }}
            />
          </div>
          <GalleryToggleAllButtons
            publicNFTCount={publicNFTCount}
            onShowAll={() => {
              onShowAll();
              analytics.track('Show All NFTs', {
                ethereumAddress: account?.address,
                profile: props.profileURI
              });
            }}
            onHideAll={() => {
              onHideAll();
              analytics.track('Hide All NFTs', {
                ethereumAddress: account?.address,
                profile: props.profileURI
              });
            }}
          />
        </div>
      }
      {
        ((
          profileData?.profile?.displayType === ProfileDisplayType.Collection &&
          draftDisplayType !== ProfileDisplayType.Nft
        ) || draftDisplayType === ProfileDisplayType.Collection) ?
          <CollectionGallery profileURI={props.profileURI} /> :
          <NftGallery profileURI={props.profileURI} />
      }
    </div>
  );
}