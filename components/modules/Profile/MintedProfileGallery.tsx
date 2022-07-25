import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Modal } from 'components/elements/Modal';
import { Switch } from 'components/elements/Switch';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { Doppler,getEnv } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery, PROFILE_GALLERY_PAGE_SIZE } from './NftGallery';
import { ProfileEditContext } from './ProfileEditContext';
import { ProfileLayoutEditorModalContent } from './ProfileLayoutEditorModalContent';

import EditLayoutIcon from 'public/edit_layout.svg';
import EyeIcon from 'public/eye.svg';
import EyeOffIcon from 'public/eye_off.svg';
import GKBadgeIcon from 'public/gk_badge.svg';
import NftLabelIcon from 'public/label.svg';
import { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount, useNetwork } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;

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
    selectedCollection,
    draftGkIconVisible,
    setDraftGkIconVisible,
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible,
  } = useContext(ProfileEditContext);

  const [layoutEditorOpen, setLayoutEditorOpen] = useState(false);
  
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();

  const { profileData } = useProfileQuery(props.profileURI);
  const { totalItems: publicNFTCount } = useProfileNFTsQuery(
    profileData?.profile?.id,
    String(chain.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
    PROFILE_GALLERY_PAGE_SIZE
  );

  const isGroupedByCollection = (
    profileData?.profile?.displayType === ProfileDisplayType.Collection &&
    draftDisplayType !== ProfileDisplayType.Nft
  ) || draftDisplayType === ProfileDisplayType.Collection;

  const [groupByCollectionNotOwner, setGroupByCollectionNotOwner] = useState(isGroupedByCollection);

  return (
    <div className={tw(
      'flex flex-col mt-8 md:mt-0 align-items',
      isMobile ? 'px-2' : 'sm:px-2 px-8'
    )}>
      <Modal
        fullModal
        bgColor='transparent'
        transparentOverlay
        title={''}
        visible={layoutEditorOpen}
        loading={false}
        onClose={function (): void {
          setLayoutEditorOpen(false);
        } }
      >
        <ProfileLayoutEditorModalContent
          savedLayoutType={profileData?.profile?.layoutType}
          onClose={() => {
            setLayoutEditorOpen(false);
          }}
        />
      </Modal>
      {selectedCollection == null &&
        <div className={tw(
          'flex items-center w-full justify-between text-white',
          editMode ? '' : 'mb-3')}>
          <div className='mb-8' id="MintedProfileGalleryCollectionToggle">
            <Switch
              left=""
              right="Group by Collection"
              enabled={ editMode ? isGroupedByCollection : groupByCollectionNotOwner }
              setEnabled={(enabled: boolean) => {
                setGroupByCollectionNotOwner(!groupByCollectionNotOwner);
                editMode && setDraftDisplayType(enabled ? ProfileDisplayType.Collection : ProfileDisplayType.Nft);
              }}
            />
          </div>
          {editMode &&
          <div className="flex flex-row justify-end">
            {!isMobile && <GalleryToggleAllButtons
              publicNFTCount={publicNFTCount}
              onShowAll={() => {
                onShowAll();
                analytics.track('Show All NFTs', {
                  ethereumAddress: currentAddress,
                  profile: props.profileURI
                });
              }}
              onHideAll={() => {
                onHideAll();
                analytics.track('Hide All NFTs', {
                  ethereumAddress: currentAddress,
                  profile: props.profileURI
                });
              }}
            />}
            <DropdownPickerModal
              constrain
              selectedIndex={0}
              options={filterNulls([
                props.ownedGKTokens.length > 0 && {
                  label: `${(draftNftsDescriptionsVisible) ? 'Hide' : 'Show'} Descriptions`,
                  onSelect: () => setDraftNftsDescriptionsVisible(!draftNftsDescriptionsVisible),
                  icon: <NftLabelIcon className="w-5 h-5" alt="Description label" />,
                },
                {
                  label: `${(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? 'Hide' : 'Show'} GK Badge`,
                  onSelect: () => setDraftGkIconVisible(!draftGkIconVisible),
                  icon: <GKBadgeIcon className="w-5 h-5" alt="Description label" />,
                },
                isMobile && {
                  label: 'Show All',
                  onSelect: () => {
                    onShowAll();
                    analytics.track('Show All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI
                    });
                  },
                  icon: <EyeIcon className="w-5 h-5" alt="Show descriptions" />,
                },
                isMobile && {
                  label: 'Hide All',
                  onSelect:() => {
                    onHideAll();
                    analytics.track('Hide All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI
                    });
                  },
                  icon: <EyeOffIcon className="w-5 h-5" alt="Hide descriptions" />,
                },
                {
                  label: 'Edit Layouts',
                  onSelect: () => setLayoutEditorOpen(!layoutEditorOpen),
                  icon: <EditLayoutIcon className="w-5 h-5" alt="Hide descriptions" />,
                },
              ])}/>
          </div>}
        </div>
      }
      {
        (editMode ? isGroupedByCollection : groupByCollectionNotOwner) ?
          <CollectionGallery profileURI={props.profileURI} /> :
          <NftGallery
            profileURI={props.profileURI}
            savedLayoutType={profileData?.profile?.layoutType}/>
      }
    </div>
  );
}