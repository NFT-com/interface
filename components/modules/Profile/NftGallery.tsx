import { useContext, useState } from 'react';
import useSWR from 'swr';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader/Loader';
import { GridContextProvider } from 'components/modules/Draggable/GridContext';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useScrollToBottom } from 'graphql/hooks/useScrollToBottom';
import { tw } from 'utils/tw';

import { NftGrid } from './NftGrid';
import { ProfileContext } from './ProfileContext';

export interface NftGalleryProps {
  profileURI: string;
}

export function NftGallery(props: NftGalleryProps) {
  const { profileURI } = props;

  const [spotlightIndex, setSpotLightIndex] = useState<number>(0);

  const { profileData } = useProfileQuery(profileURI);
  const {
    editMode,
    editModeNfts,
    saving,
    allOwnerNfts,
    publiclyVisibleNftsNoEdit,
    loading,
    loadingAllOwnerNfts,
    loadMoreNfts,
    loadMoreNftsEditMode,
    draftLayoutType
  } = useContext(ProfileContext);
  const { closeToBottom, currentScrollPosition } = useScrollToBottom();

  useSWR(closeToBottom.toString() + currentScrollPosition, async () => {
    if (!editMode && closeToBottom && publiclyVisibleNftsNoEdit?.length > 0 && !loading) {
      loadMoreNfts();
    }

    if (editMode && closeToBottom && editModeNfts?.length > 0 && !loadingAllOwnerNfts) {
      loadMoreNftsEditMode();
    }
  });

  const savedLayoutType = 'Default';

  if (allOwnerNfts == null || publiclyVisibleNftsNoEdit == null || profileData == null || saving) {
    return (
      <div className='customHeight flex w-full items-center justify-center'>
        <div className='flex flex-col items-center text-white'>
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && editModeNfts?.length === 0 && !loadingAllOwnerNfts) {
    return (
      <div className='customHeight flex w-full items-center justify-center'>
        <div className='flex flex-col items-center text-primary-txt dark:text-primary-txt-dk'>
          <div className=''>No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const nftsToShow = editMode ? editModeNfts : publiclyVisibleNftsNoEdit ?? [];

  const displayNFTs = (draftLayoutType ?? savedLayoutType) !== 'Spotlight' ? nftsToShow : [nftsToShow[spotlightIndex]];

  const setNFTs = displayNFTs.filter((obj, index, self) => self.findIndex(t => t.id === obj.id) === index);

  return (
    <>
      <GridContextProvider items={setNFTs} key={JSON.stringify(setNFTs)}>
        <NftGrid profileURI={profileURI} />
      </GridContextProvider>
      {(draftLayoutType ?? savedLayoutType) === 'Spotlight' && (
        <div className={tw('col-start-2 my-16 flex w-full items-center justify-around')}>
          <div className='w-1/2 pr-2'>
            <Button
              stretch
              size={ButtonSize.LARGE}
              label={'Back'}
              onClick={() => {
                setSpotLightIndex(spotlightIndex === 0 ? nftsToShow.length - 1 : spotlightIndex - 1);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
          <div className='w-1/2 pl-2'>
            <Button
              stretch
              size={ButtonSize.LARGE}
              label={'Next'}
              onClick={() => {
                setSpotLightIndex(spotlightIndex + 1 > nftsToShow.length - 1 ? 0 : spotlightIndex + 1);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      )}
      {(loading || loadingAllOwnerNfts) && (
        <div className='flex min-h-[25rem] flex-col items-center justify-center text-primary-txt minmd:min-h-[20rem]'>
          <div className='mb-2'>Loading...</div>
          <Loader />
        </div>
      )}
    </>
  );
}
