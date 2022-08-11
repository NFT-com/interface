import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Modal } from 'components/elements/Modal';
import { Switch } from 'components/elements/Switch';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery } from './NftGallery';
import { ProfileContext } from './ProfileContext';
import { ProfileLayoutEditorModalContent } from './ProfileLayoutEditorModalContent';

import { Gear } from 'phosphor-react';
import EditLayoutIcon from 'public/edit_layout.svg';
import EyeIcon from 'public/eye.svg';
import EyeOffIcon from 'public/eye_off.svg';
import GKBadgeIcon from 'public/gk_badge.svg';
import NftLabelIcon from 'public/label.svg';
import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;
  ownedGKTokens?: number[];
}

export function MintedProfileGallery(props: MintedProfileGalleryProps) {
  const {
    editMode,
    draftDisplayType,
    setDraftDisplayType,
    selectedCollection,
    draftGkIconVisible,
    setDraftGkIconVisible,
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible,
    publiclyVisibleNftCount,
    showNftIds,
    hideNftIds,
    allOwnerNfts,
    draftDeployedContractsVisible,
    setDraftDeployedContractsVisible
  } = useContext(ProfileContext);

  const [layoutEditorOpen, setLayoutEditorOpen] = useState(false);
  
  const { address: currentAddress } = useAccount();

  const { profileData } = useProfileQuery(props.profileURI);

  const isGroupedByCollection = draftDisplayType === ProfileDisplayType.Collection;

  const [groupByCollectionNotOwner, setGroupByCollectionNotOwner] = useState(isGroupedByCollection);

  useEffect(() => {
    setGroupByCollectionNotOwner(false);
  }, [editMode]);

  return (
    <div className={tw(
      'flex flex-col mt-0 minlg:mt-14 align-items',
      isMobile ? 'px-2' : 'px-2 minmd:px-8'
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
          <div id="MintedProfileGalleryCollectionToggle">
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
              publicNFTCount={publiclyVisibleNftCount}
              onShowAll={() => {
                showNftIds(allOwnerNfts?.map(nft => nft.id));
                analytics.track('Show All NFTs', {
                  ethereumAddress: currentAddress,
                  profile: props.profileURI
                });
              }}
              onHideAll={() => {
                hideNftIds(allOwnerNfts?.map(nft => nft.id));
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
                props.ownedGKTokens?.length > 0 && {
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
                    showNftIds(allOwnerNfts?.map(nft => nft.id));
                    analytics.track('Show All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI
                    });
                  },
                  icon: <EyeIcon alt="Show all nfts" />,
                },
                isMobile && {
                  label: 'Hide All',
                  onSelect:() => {
                    hideNftIds(allOwnerNfts?.map(nft => nft.id));
                    analytics.track('Hide All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI
                    });
                  },
                  icon: <EyeOffIcon alt="Hide all nfts" />,
                },
                {
                  label: 'Edit Layouts',
                  onSelect: () => setLayoutEditorOpen(!layoutEditorOpen),
                  icon: <EditLayoutIcon className="w-5 h-5" alt="Hide descriptions" />,
                },
                {
                  label: `${(draftDeployedContractsVisible) ? 'Hide' : 'Show'} Created Collections`,
                  onSelect: () => setDraftDeployedContractsVisible(!draftDeployedContractsVisible),
                  icon: <EditLayoutIcon className="" alt="Collections toggle" />,
                }
              ])}>
              <Gear className="w-8 h-8 shrink-0 aspect-square" alt='Edit Menu'/>
            </DropdownPickerModal>
          </div>}
        </div>
      }
      {
        (editMode ? isGroupedByCollection : groupByCollectionNotOwner) ?
          <CollectionGallery profileURI={props.profileURI} /> :
          <NftGallery profileURI={props.profileURI} />
      }
    </div>
  );
}