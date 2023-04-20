import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';

import { Modal } from 'components/elements/Modal';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { createNftOwnerMap } from 'utils/createNftOwnerMap';
import { tw } from 'utils/tw';

import { GalleryToggleAllButtons as StaticGalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGallery } from './NftGallery';
import { ProfileContext } from './ProfileContext';
import { ProfileLayoutEditorModalContent } from './ProfileLayoutEditorModalContent';

export interface MintedProfileGalleryProps {
  profileURI: string;
  ownedGKTokens?: number[];
}

const DynamicGalleryToggleAllButtons = dynamic<React.ComponentProps<typeof StaticGalleryToggleAllButtons>>(() =>
  import('./GalleryToggleAllButtons').then(mod => mod.GalleryToggleAllButtons)
);

export function MintedProfileGallery(props: MintedProfileGalleryProps) {
  const { editMode, publiclyVisibleNftCount, showNftIds, hideNftIds, allOwnerNfts } = useContext(ProfileContext);

  const [layoutEditorOpen, setLayoutEditorOpen] = useState(false);
  const { address: currentAddress } = useAccount();

  const { profileData } = useProfileQuery(props.profileURI);

  return (
    <div className={tw('align-items flex flex-col', 'minlg:px-16')}>
      <Modal
        fullModal
        bgColor='transparent'
        transparentOverlay
        title={''}
        visible={layoutEditorOpen}
        loading={false}
        onClose={function (): void {
          setLayoutEditorOpen(false);
        }}
      >
        <ProfileLayoutEditorModalContent
          savedLayoutType={profileData?.profile?.layoutType}
          onClose={() => {
            setLayoutEditorOpen(false);
          }}
        />
      </Modal>

      {editMode && (
        <div className='mb-3 flex w-full justify-end pr-1'>
          <DynamicGalleryToggleAllButtons
            publicNFTCount={publiclyVisibleNftCount}
            onShowAll={() => {
              showNftIds(
                allOwnerNfts?.map(nft => nft.id),
                true
              );
              gtag('event', 'Show All NFTs', {
                ethereumAddress: currentAddress,
                profile: props.profileURI,
                nftsByOwner: createNftOwnerMap(allOwnerNfts)
              });
            }}
            onHideAll={() => {
              hideNftIds(
                allOwnerNfts?.map(nft => nft.id),
                true
              );
              gtag('event', 'Hide All NFTs', {
                ethereumAddress: currentAddress,
                profile: props.profileURI,
                nftsByOwner: createNftOwnerMap(allOwnerNfts)
              });
            }}
          />
        </div>
      )}
      <NftGallery profileURI={props.profileURI} />
    </div>
  );
}
