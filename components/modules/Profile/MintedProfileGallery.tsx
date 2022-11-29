import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Modal } from 'components/elements/Modal';
import { Switch } from 'components/elements/Switch';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { createNftOwnerMap } from 'utils/createNftOwnerMap';
import { Doppler, getEnvBool } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons as StaticGalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery } from './NftGallery';
import { ProfileContext } from './ProfileContext';
import { ProfileLayoutEditorModalContent } from './ProfileLayoutEditorModalContent';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { CircleWavy, Gear, Layout, Tag, Wrench } from 'phosphor-react';
import EyeIcon from 'public/eye.svg';
import EyeOffIcon from 'public/eye_off.svg';
import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;
  ownedGKTokens?: number[];
}

const DynamicGalleryToggleAllButtons = dynamic<React.ComponentProps<typeof StaticGalleryToggleAllButtons>>(() => import('./GalleryToggleAllButtons').then(mod => mod.GalleryToggleAllButtons));

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
  const router = useRouter();
  const { address: currentAddress } = useAccount();

  const { profileData } = useProfileQuery(props.profileURI);

  const isGroupedByCollection = draftDisplayType === ProfileDisplayType.Collection;

  const [groupByCollectionNotOwner, setGroupByCollectionNotOwner] = useState(isGroupedByCollection);

  useEffect(() => {
    setGroupByCollectionNotOwner(false);
  }, [editMode]);

  return (
    <div className={tw(
      'flex flex-col align-items',
      getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'minlg:px-16' : isMobile ? 'px-2 mt-0 minlg:mt-16' : 'px-2 minmd:px-8 mb-10 mt-0 minlg:mt-16'
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
      {selectedCollection == null && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) &&
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
            {!isMobile && <DynamicGalleryToggleAllButtons
              publicNFTCount={publiclyVisibleNftCount}
              onShowAll={() => {
                showNftIds(allOwnerNfts?.map(nft => nft.id), true);
                analytics.track('Show All NFTs', {
                  ethereumAddress: currentAddress,
                  profile: props.profileURI,
                  nftsByOwner: createNftOwnerMap(allOwnerNfts)
                });
              }}
              onHideAll={() => {
                hideNftIds(allOwnerNfts?.map(nft => nft.id), true);
                analytics.track('Hide All NFTs', {
                  ethereumAddress: currentAddress,
                  profile: props.profileURI,
                  nftsByOwner: createNftOwnerMap(allOwnerNfts)
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
                  icon: <Tag className="mr-1" weight="bold" color="black" alt="Description label"/>,
                },
                {
                  label: `${(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? 'Hide' : 'Show'} GK Badge`,
                  onSelect: () => setDraftGkIconVisible(!draftGkIconVisible),
                  icon: <CircleWavy className="mr-1" color="black" weight="bold" alt="Description label" />,
                },
                isMobile && {
                  label: 'Show All',
                  onSelect: () => {
                    showNftIds(allOwnerNfts?.map(nft => nft.id), true);
                    analytics.track('Show All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI,
                      nftsByOwner: createNftOwnerMap(allOwnerNfts)
                    });
                  },
                  icon: <EyeIcon alt="Show all nfts" stroke="black" fill="black" />,
                },
                isMobile && {
                  label: 'Hide All',
                  onSelect:() => {
                    hideNftIds(allOwnerNfts?.map(nft => nft.id), true);
                    analytics.track('Hide All NFTs', {
                      ethereumAddress: currentAddress,
                      profile: props.profileURI,
                      nftsByOwner: createNftOwnerMap(allOwnerNfts)
                    });
                  },
                  icon: <EyeOffIcon alt="Hide all nfts" stroke="black" fill="black" />,
                },
                {
                  label: 'Edit Layouts',
                  onSelect: () => setLayoutEditorOpen(!layoutEditorOpen),
                  icon: <Layout weight='bold' className="mr-1" color="black" alt="Hide descriptions" />,
                },
                {
                  label: `${(draftDeployedContractsVisible) ? 'Hide' : 'Show'} Created Collections`,
                  onSelect: () => setDraftDeployedContractsVisible(!draftDeployedContractsVisible),
                  icon: <Layout weight='bold' className="mr-1" color="black" alt="Collections toggle" />,
                },
                {
                  label: 'Advanced Settings',
                  onSelect: () => {
                    router.push('/app/settings');
                  },
                  icon: <Wrench weight="bold" className='mr-1' color="black" alt="settings link" />
                }
              ])}>
              <Gear className="w-8 h-8 shrink-0 aspect-square" alt='Edit Menu'/>
            </DropdownPickerModal>
          </div>}
        </div>
      }

      {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && editMode &&
        <div className='flex w-full justify-end mb-3 pr-1'>
          <DynamicGalleryToggleAllButtons
            publicNFTCount={publiclyVisibleNftCount}
            onShowAll={() => {
              showNftIds(allOwnerNfts?.map(nft => nft.id), true);
              analytics.track('Show All NFTs', {
                ethereumAddress: currentAddress,
                profile: props.profileURI,
                nftsByOwner: createNftOwnerMap(allOwnerNfts)
              });
            }}
            onHideAll={() => {
              hideNftIds(allOwnerNfts?.map(nft => nft.id), true);
              analytics.track('Hide All NFTs', {
                ethereumAddress: currentAddress,
                profile: props.profileURI,
                nftsByOwner: createNftOwnerMap(allOwnerNfts)
              });
            }}
          />
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