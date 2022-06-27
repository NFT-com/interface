import { NFTCard } from 'components/elements/NFTCard';
import { Nft, ProfileLayoutType } from 'graphql/generated/types';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileEditContext } from './ProfileEditContext';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';

type DetailedNft = Nft & { hidden?: boolean };

export interface NftGridProps {
  nfts: PartialDeep<DetailedNft>[];
  profileURI: string;
  savedLayoutType?: ProfileLayoutType;
}

export function NftGrid(props: NftGridProps) {
  const {
    toggleHidden,
    editMode,
    draftToHide,
    draftToShow,
    draftNftsDescriptionsVisible,
  } = useContext(ProfileEditContext);
  const { tileBackgroundSecondary } = useThemeColors();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { draftLayoutType } = useContext(ProfileEditContext);

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

  return (props.savedLayoutType && <div className={tw(
    'grid w-full sm:grid-cols-2 md:grid-cols-3 gap-y-2.5 sm:grid-cols-1',
    (draftLayoutType ?? props.savedLayoutType) === 'Default' ? 'grid-cols-4' : '',
    (draftLayoutType ?? props.savedLayoutType) === 'Featured' ? 'grid-cols-6 md:grid-cols-4' : '',
    (draftLayoutType ?? props.savedLayoutType) === 'Mosaic' ? 'grid-cols-6 lg:grid-cols-4 md:grid-cols-3' : '',
    (draftLayoutType ?? props.savedLayoutType) === 'Spotlight' ? 'grid-cols-3' : '',
  )}
  data-testid={props.savedLayoutType+'-layout-option'}>
    {props.nfts?.map((nft: PartialDeep<DetailedNft>, index) => (
      <div
        key={nft?.id + '-' + nft?.contract?.address}
        className={tw(
          'flex justify-center px-3 sm:mb-2',
          (draftLayoutType ?? props.savedLayoutType) === 'Default' ? 'mb-10' : '',
          (draftLayoutType ?? props.savedLayoutType) === 'Featured' ? `${[1,2,3].includes((index+10)%9) ? [0,1].includes(index%10) ? 'col-span-2 md:col-span-2 ':'col-span-2 md:col-span-1': [0,1].includes(index%10) ? 'md:col-span-2' :''} mb-10` : '',
          (draftLayoutType ?? props.savedLayoutType) === 'Mosaic' && screenWidth > 1199 ? `${index % 7 === 0 ? 'row-span-3 col-span-3' : '' } ${(index-4) % 7 === 0? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? props.savedLayoutType) === 'Mosaic' && screenWidth > 900 && screenWidth <= 1199 ? `${mosaicArray2.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? props.savedLayoutType) === 'Mosaic' && screenWidth > 600 && screenWidth <= 899 ? `${ mosaicArray.includes(index) ? 'row-span-2 col-span-2' : '' }` : '',
          (draftLayoutType ?? props.savedLayoutType) === 'Spotlight' ? 'col-start-2 col-span-1 sm:col-start-2' : '',
        )}
      >
        <NFTCard
          title={nft?.metadata?.name}
          traits={[{ key: '', value: shortenAddress(nft?.contract?.address) }]}
          images={[nft?.metadata?.imageURL]}
          profileURI={props.profileURI}
          contractAddress={nft?.contract}
          tokenId={nft?.tokenId}
          // only show the eye icons to the owner in edit mode
          visible={editMode ?
            nft?.hidden ?
              draftToShow.has(nft?.id) :
              !draftToHide.has(nft?.id) :
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
            } else if (getEnvBool(Doppler.NEXT_PUBLIC_NFT_DETAILS_ENABLED)) {
              router.push('/app/nft/' + nft?.contract + '/' + BigNumber.from(nft?.tokenId).toString());
            } else {
              alert('coming soon');
            }
          }}
          customBackground={tileBackgroundSecondary}
          customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
          nftsDescriptionsVisible={draftNftsDescriptionsVisible}
        />
      </div>
    ))}
  </div>);
}