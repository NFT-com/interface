import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { GridContextProvider } from 'components/modules/Draggable/GridContext';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useScrollY } from 'graphql/hooks/useScrollY';
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
    loadMoreNfts,
    draftLayoutType
  } = useContext(ProfileContext);
  
  const { scrollDir, yScroll } = useScrollY();

  useSWR(scrollDir + yScroll, async () => {
    if (scrollDir === 'DOWN' && yScroll > 500) {
      if (editMode ? allOwnerNftCount > editModeNfts?.length : publiclyVisibleNftCount > publiclyVisibleNfts?.length) loadMoreNfts();
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

  if (editMode && allOwnerNftCount === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const nftsToShow = editMode ?
    editModeNfts :
    (publiclyVisibleNfts ?? []);

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
    </>
  );
}