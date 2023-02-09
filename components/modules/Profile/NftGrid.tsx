import { NFTCard } from 'components/elements/NFTCard';
import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import DraggableGridItem from 'components/modules/Draggable/DraggableGridItem';
import { GridContext } from 'components/modules/Draggable/GridContext';
import { Nft } from 'graphql/generated/types';
import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUser } from 'hooks/state/useUser';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ClaimProfileCard } from './ClaimProfileCard';
import { ProfileContext } from './ProfileContext';

import { BigNumber } from 'ethers';
import { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';

export type DetailedNft = Nft & { hidden?: boolean };

export interface NftGridProps {
  profileURI: string;
  draggable?: boolean;
}

export function NftGrid(props: NftGridProps) {
  const {
    toggleHidden,
    editMode,
    draftNftsDescriptionsVisible,
    draftLayoutType,
    currentNftsDescriptionsVisible
  } = useContext(ProfileContext);
  const { items, moveItem } = useContext(GridContext);
  const { user } = useUser();
  const { profileData } = useProfileQuery(props.profileURI);
  const defaultChainId = useDefaultChainId();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, defaultChainId.toString());
  const { tileBackgroundSecondary } = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();

  const mosaicArray = [0];
  let seq = 0;
  for(let i = 0; i < items.length; i++) {
    seq = i % 2 === 0 ? seq + 4: seq + 2;
    mosaicArray.push(seq);
  }

  const mosaicArray2 = [0];
  let seq2 = 0;
  for(let i = 0; i < items.length; i++) {
    seq2 = i % 2 === 0 ? seq2 + 7: seq2 + 3;
    mosaicArray2.push(seq2);
  }

  const savedLayoutType = 'Default';

  const mosaicCardType = (layoutType, index) => {
    if (layoutType === 'Mosaic') {
      if (screenWidth > 1199) {
        if (index % 7 === 0 )
          return 'LargeMosaicLargeCard';
        if ((index-4) % 7 === 0)
          return 'LargeMosaicMediumCard';
        if (index % 7 !== 0 && (index-4) % 7 !== 0)
          return 'LargeMosaicSmallCard';
      } else if (screenWidth > 900 && screenWidth <= 1199) {
        return mosaicArray2.includes(index) ? 'MediumMosaicMediumCard' : 'MediumMosaicSmallCard';
      } else if(screenWidth > 600 && screenWidth <= 899) {
        return mosaicArray.includes(index) ? 'SmallMosaicMediumCard' : 'SmallMosaicSmallCard';
      }
    }

    return '';
  };

  return <div
    className={tw(
      'grid w-full',
      'gap-4 mt-4 minlg:mt-0',
      (draftLayoutType ?? savedLayoutType) === 'Default' ? 'grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-5 minxxl:grid-cols-6' : '',
      (draftLayoutType ?? savedLayoutType) === 'Mosaic' ? 'grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-6' : '',
      (draftLayoutType ?? savedLayoutType) === 'Featured' ? 'grid-cols-2 minmd:grid-cols-4 minlg:grid-cols-6' : '',
      (draftLayoutType ?? savedLayoutType) === 'Spotlight' ? 'grid-cols-4 minlg:grid-cols-8' : '',
    )}
    data-testid={savedLayoutType+'-layout-option'}
  >
    {getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED) && user?.currentProfileUrl === props.profileURI && profileCustomizationStatus && !profileCustomizationStatus?.isProfileCustomized &&
      <div className='hidden minlg:block'>
        <ClaimProfileCard />
      </div>
    }
    {items?.map((nft: PartialDeep<DetailedNft>, index) => (
      <DraggableGridItem
        key={`${nft?.contract}-${nft?.tokenId}`}
        item={{ id: nft?.id, hidden: nft?.hidden, draggable: props.draggable ?? true }}
        onMoveItem={nft?.hidden ? null : moveItem}
      >
        <div
          className={tw(
            'NFTCardContainer',
            'flex justify-center mb-2 minmd:mb-0',
            (draftLayoutType ?? savedLayoutType) === 'Default' ? 'mb-10' : '',
            (draftLayoutType ?? savedLayoutType) === 'Featured' ? `${[0,1,2].includes(index) ? 'col-span-2 row-span-2':'col-span-1'} mb-10` : '',
            (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 1199 ? `${index % 7 === 0 ? 'row-span-3 col-span-3' : '' } ${(index-4) % 7 === 0? 'row-span-2 col-span-2' : '' }` : '',
            (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 900 && screenWidth <= 1199 ? `${mosaicArray2.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
            (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 600 && screenWidth <= 899 ? `${ mosaicArray.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
            (draftLayoutType ?? savedLayoutType) === 'Spotlight' ? 'col-start-2 minlg:col-start-3 col-span-2 minlg:col-span-4 mb-4' : '',
          )}
        >
          <NftCard
            name={nft?.metadata?.name}
            images={[nft?.previewLink || nft?.metadata?.imageURL]}
            collectionName={nft?.collection?.name}
            isOwnedByMe={nft?.isOwnedByMe}
            listings={nft?.listings?.items || []}
            nft={nft}
            fallbackImage={nft?.metadata?.imageURL}
            contractAddr={nft?.contract}
            tokenId={nft?.tokenId}
            // only show the eye icons to the owner in edit mode
            visible={editMode ?
              !nft?.hidden :
              null
            }
            onVisibleToggle={() => {
              if (editMode) {
                toggleHidden(nft?.id, !nft?.hidden);
              }
            }}
            onClick={() => {
              if (editMode) {
                toggleHidden(nft?.id, !nft?.hidden);
              }
            }}
            redirectTo={!editMode && ('/app/nft/' + nft?.contract + '/' + BigNumber.from(nft?.tokenId).toString())}
            customBackground={tileBackgroundSecondary}
            nftsDescriptionsVisible={draftNftsDescriptionsVisible}
            preventDefault={editMode}
            profileId={profileData.profile.id}
          />
        </div>
      </DraggableGridItem>
    ))}

  </div>;
}
