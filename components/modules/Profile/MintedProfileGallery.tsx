import { Modal } from 'components/elements/Modal';
import { ProfileDisplayType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { createNftOwnerMap } from 'utils/createNftOwnerMap';
import { tw } from 'utils/tw';

import { CollectionGallery } from './CollectionGallery';
import { GalleryToggleAllButtons as StaticGalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery } from './NftGallery';
import { ProfileContext } from './ProfileContext';
import { ProfileLayoutEditorModalContent } from './ProfileLayoutEditorModalContent';

import dynamic from 'next/dynamic';
import { useContext, useEffect, useRef, useState } from 'react';
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
    publiclyVisibleNftCount,
    showNftIds,
    hideNftIds,
    allOwnerNfts
  } = useContext(ProfileContext);

  const [layoutEditorOpen, setLayoutEditorOpen] = useState(false);
  const { address: currentAddress } = useAccount();

  const { profileData } = useProfileQuery(props.profileURI);

  const isGroupedByCollection = draftDisplayType === ProfileDisplayType.Collection;

  const [groupByCollectionNotOwner, setGroupByCollectionNotOwner] = useState(isGroupedByCollection);
  const parentRef = useRef(null);

  useEffect(() => {
    setGroupByCollectionNotOwner(false);
  }, [editMode]);

  return (
    <div ref={parentRef} className={tw(
      'flex flex-col align-items',
      'minlg:px-16',
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

      {editMode &&
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
          <NftGallery profileURI={props.profileURI} parentRef={parentRef}/>
      }
    </div>
  );
}