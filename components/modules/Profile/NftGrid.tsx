import { NFTCard } from 'components/elements/NFTCard';
import { Nft } from 'graphql/generated/types';
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

  return <div className={tw(
    'grid gap-y-2.5 w-full',
    'grid-cols-4 sm:grid-cols-2 md:grid-cols-3'
  )}>
    {props.nfts?.map((nft: PartialDeep<DetailedNft>) => (
      <div
        key={nft?.id + '-' + nft?.contract?.address}
        className={tw(
          'flex mb-10 items-center justify-center px-3',
          'sm:mb-2'
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
            if (getEnvBool(Doppler.NEXT_PUBLIC_NFT_DETAILS_ENABLED)) {
              router.push('/app/nft/' + nft?.contract + '/' + BigNumber.from(nft?.tokenId).toString());
            } else if (editMode) {
              toggleHidden(nft?.id, !nft?.hidden);
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
  </div>;
}