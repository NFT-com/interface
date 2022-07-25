import { Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import { Nft } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';

export type DetailedNft = Nft & { hidden?: boolean };

export interface NftGridProps {
  nfts: PartialDeep<DetailedNft>[];
  profileURI: string;
}

export function NftGrid(props: NftGridProps) {
  const {
    toggleHidden,
    editMode,
    draftNftsDescriptionsVisible,
    draftLayoutType
  } = useContext(ProfileContext);
  const { profileData } = useProfileQuery(props.profileURI);

  const { tileBackgroundSecondary } = useThemeColors();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const [spotlightIndex, setSpotLightIndex] = useState<number>(0);

  const mosaicArray = [0];
  let seq = 0;
  for(let i = 0; i < props.nfts.length; i++) {
    seq = i % 2 === 0 ? seq + 4: seq + 2;
    mosaicArray.push(seq);
  }

  const mosaicArray2 = [0];
  let seq2 = 0;
  for(let i = 0; i < props.nfts.length; i++) {
    seq2 = i % 2 === 0 ? seq2 + 7: seq2 + 3;
    mosaicArray2.push(seq2);
  }

  const savedLayoutType = profileData?.profile?.layoutType;
  const displayNFTs = (draftLayoutType ?? savedLayoutType) !== 'Spotlight' ?
    props.nfts :
    [props.nfts[spotlightIndex]];

  return <div className={tw(
    'grid w-full sm:grid-cols-2 md:grid-cols-3 gap-y-2.5 sm:grid-cols-1',
    (draftLayoutType ?? savedLayoutType) === 'Default' ? 'grid-cols-4' : '',
    (draftLayoutType ?? savedLayoutType) === 'Featured' ? 'grid-cols-6 md:grid-cols-4' : '',
    (draftLayoutType ?? savedLayoutType) === 'Mosaic' ? 'grid-cols-6 lg:grid-cols-4 md:grid-cols-3' : '',
    (draftLayoutType ?? savedLayoutType) === 'Spotlight' ? 'grid-cols-3' : '',
  )}
  data-testid={savedLayoutType+'-layout-option'}>
    {displayNFTs?.map((nft: PartialDeep<DetailedNft>, index) => (
      <div
        key={nft?.id + '-' + nft?.tokenId + '-' + nft?.contract}
        className={tw(
          'NFTCardContainer',
          'flex justify-center px-3 sm:mb-2',
          (draftLayoutType ?? savedLayoutType) === 'Default' ? 'mb-10' : '',
          (draftLayoutType ?? savedLayoutType) === 'Featured' ? `${[1,2,3].includes((index+10)%9) ? [0,1].includes(index%10) ? 'col-span-2 md:col-span-2 ':'col-span-2 md:col-span-1': [0,1].includes(index%10) ? 'md:col-span-2' :''} mb-10` : '',
          (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 1199 ? `${index % 7 === 0 ? 'row-span-3 col-span-3' : '' } ${(index-4) % 7 === 0? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 900 && screenWidth <= 1199 ? `${mosaicArray2.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? savedLayoutType) === 'Mosaic' && screenWidth > 600 && screenWidth <= 899 ? `${ mosaicArray.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? savedLayoutType) === 'Spotlight' ? 'col-start-2 col-span-1 sm:col-start-2 mb-4' : '',
        )}
      >
        <NFTCard
          title={nft?.metadata?.name}
          traits={[{ key: '', value: shortenAddress(nft?.contract) }]}
          images={[nft?.metadata?.imageURL]}
          profileURI={props.profileURI}
          contractAddress={nft?.contract}
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
            } else {
              router.push('/app/nft/' + nft?.contract + '/' + BigNumber.from(nft?.tokenId).toString());
            }
          }}
          customBackground={tileBackgroundSecondary}
          customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
          nftsDescriptionsVisible={draftNftsDescriptionsVisible}
        />
      </div>
    ))}
    {
      (draftLayoutType ?? savedLayoutType) === 'Spotlight' && <div className={tw(
        'w-full flex items-center col-start-2 justify-around mb-16'
      )}>
        <div className='pr-2 w-1/2'>
          <Button
            stretch
            color="white"
            label={'Back'}
            onClick={() => {
              setSpotLightIndex(spotlightIndex === 0 ? props.nfts.length - 1 : spotlightIndex - 1);
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
              setSpotLightIndex(spotlightIndex + 1 > props.nfts.length - 1 ? 0 : spotlightIndex + 1);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    }
  </div>;
}