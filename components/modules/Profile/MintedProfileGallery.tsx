import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Switch } from 'components/elements/Switch';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery, PROFILE_GALLERY_PAGE_SIZE } from './NftGallery';
import { ProfileEditContext } from './ProfileEditContext';

import EditLayoutIcon from 'public/edit_layout.svg';
import EyeIcon from 'public/eye.svg';
import EyeOffIcon from 'public/eye_off.svg';
import GKBadgeIcon from 'public/gk_badge.svg';
import NftLabelIcon from 'public/label.svg';
import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;
  draftGkIconVisible: boolean;
  setDraftGkIconVisible?: (val: boolean) => void;
  draftNftsDescriptionsVisible: boolean;
  setDraftNftsDescriptionsVisible?: (val: boolean) => void;
  ownedGKTokens?: number[];
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
      isMobile ? 'px-2' : 'sm:px-2 md:px-8 lg:px-16 px-20'
    )}>
      {editMode && selectedCollection == null &&
        <div className='flex items-center w-full mb-12 px-8 justify-between text-white'>
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
          <div className="flex flex-row justify-end">
            {!isMobile && <GalleryToggleAllButtons
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
            />}
            <DropdownPickerModal
              constrain
              selectedIndex={0}
              options={[
                props.ownedGKTokens.length > 0 && {
                  label: `${(props.draftNftsDescriptionsVisible ?? profileData?.profile?.nftsDescriptionsVisible) ? 'Hide' : 'Show'} Descriptions`,
                  onSelect: () => props.setDraftNftsDescriptionsVisible(!props.draftNftsDescriptionsVisible),
                  icon: NftLabelIcon,
                },
                {
                  label: `${(props.draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? 'Hide' : 'Show'} GK Badge`,
                  onSelect: () => props.setDraftGkIconVisible(!props.draftGkIconVisible),
                  icon: GKBadgeIcon,
                },
                isMobile && {
                  label: 'Show All',
                  onSelect: () => {
                    onShowAll();
                    analytics.track('Show All NFTs', {
                      ethereumAddress: account?.address,
                      profile: props.profileURI
                    });
                  },
                  icon: EyeIcon,
                },
                isMobile && {
                  label: 'Hide All',
                  onSelect:() => {
                    onHideAll();
                    analytics.track('Hide All NFTs', {
                      ethereumAddress: account?.address,
                      profile: props.profileURI
                    });
                  },
                  icon: EyeOffIcon,
                },
                {
                  label: 'Edit Layouts',
                  onSelect: () => null,
                  icon: EditLayoutIcon,
                },
              ]}/>
          </div>
        </div>
      }
      {
        (
          profileData?.profile?.displayType === ProfileDisplayType.Collection &&
          draftDisplayType !== ProfileDisplayType.Nft
        ) || draftDisplayType === ProfileDisplayType.Collection ?
          <CollectionGallery profileURI={props.profileURI} /> :
          <NftGallery
            profileURI={props.profileURI}
            nftsDescriptionsVisible={props.draftNftsDescriptionsVisible ?? profileData?.profile?.nftsDescriptionsVisible}/>
      }
    </div>
  );
}