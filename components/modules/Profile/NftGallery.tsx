import { Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { GridContextProvider } from 'components/modules/Draggable/GridContext';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useScrollToBottom } from 'graphql/hooks/useScrollToBottom';
import useDebounce from 'hooks/useDebounce';
import { tw } from 'utils/tw';

import { NftGrid } from './NftGrid';
import { ProfileContext } from './ProfileContext';

import { useContext, useState } from 'react';
import useSWR from 'swr';
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
    allOwnerNftCount,
    publiclyVisibleNfts,
    publiclyVisibleNftCount,
    loading,
    loadingAllOwnerNfts,
    loadMoreNfts,
    loadMoreNftsEditMode,
    draftLayoutType,
    searchQuery,
    searchVisibleNfts,
    searchNfts
  } = useContext(ProfileContext);
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const { closeToBottom, currentScrollPosition } = useScrollToBottom();

  useSWR(closeToBottom.toString() + currentScrollPosition, async () => {
    if (!editMode && closeToBottom && publiclyVisibleNfts?.length > 0 && !loading) {
      if (publiclyVisibleNftCount > publiclyVisibleNfts?.length) {
        loadMoreNfts();
      }
    }
    
    if (editMode && closeToBottom && allOwnerNftCount > nftsToShow?.length) {
      loadMoreNftsEditMode();
    }
  });

  const savedLayoutType = profileData?.profile?.layoutType;

  if (allOwnerNfts == null || publiclyVisibleNfts == null || profileData == null || saving) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && allOwnerNftCount === 0 && !loadingAllOwnerNfts) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const nftsToShow = editMode ?
    !debouncedSearch ? editModeNfts : (searchNfts ?? []) :
    !debouncedSearch ? (publiclyVisibleNfts ?? []) : (searchVisibleNfts ?? []);

  const displayNFTs = (draftLayoutType ?? savedLayoutType) !== 'Spotlight' ?
    nftsToShow :
    [nftsToShow[spotlightIndex]];

  return (
    <>
      <GridContextProvider items={displayNFTs} key={JSON.stringify(displayNFTs)}>
        <NftGrid profileURI={profileURI} />
      </GridContextProvider>
      {
        (draftLayoutType ?? savedLayoutType) === 'Spotlight' && <div className={tw(
          'w-full flex items-center col-start-2 justify-around my-16'
        )}>
          <div className='pr-2 w-1/2'>
            <Button
              stretch
              color="white"
              label={'Back'}
              onClick={() => {
                setSpotLightIndex(spotlightIndex === 0 ? nftsToShow.length - 1 : spotlightIndex - 1);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
          <div className="pl-2 w-1/2">
            <Button
              stretch
              color="white"
              label={'Next'}
              onClick={() => {
                setSpotLightIndex(spotlightIndex + 1 > nftsToShow.length - 1 ? 0 : spotlightIndex + 1);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      }
      {(loading || loadingAllOwnerNfts) &&
      <div className= 'min-h-[25rem] minmd:min-h-[20rem] text-primary-txt flex flex-col items-center justify-center'>
        <div className="mb-2">Loading...</div>
        <Loader />
      </div>}
    </>
  );
}