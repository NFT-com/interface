import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { NFTCard } from 'components/elements/NFTCard';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileEditContext } from './ProfileEditContext';

import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';
export interface NftGalleryProps {
  profileURI: string;
}

export const PROFILE_GALLERY_PAGE_SIZE = 20;

export function NftGallery(props: NftGalleryProps) {
  const { profileURI } = props;

  // todo: proper pagination to avoid overfetching here.
  const [loadedCount, setLoadedCount] = useState(PROFILE_GALLERY_PAGE_SIZE);

  const { data: account } = useAccount();
  const router = useRouter();
  const { profileData } = useProfileQuery(profileURI);
  const isAdmin = profileData?.profile?.owner?.address?.toLowerCase() === account?.address?.toLowerCase();
  const { data: allOwnerNFTs, totalItems: ownerNFTCount } = useMyNFTsQuery({
    first: loadedCount
  });
  const { nfts: profileNFTs, totalItems: publicNFTCount, mutate: mutateProfileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    { first: loadedCount }
  );
  const {
    toggleHidden,
    editMode,
    draftToHide,
    draftHideAll,
    draftToShow,
    draftShowAll,
    saving
  } = useContext(ProfileEditContext);
  const { tileBackgroundSecondary } = useThemeColors();

  useEffect(() => {
    mutateProfileNFTs();
  }, [editMode, mutateProfileNFTs, saving]);

  if (allOwnerNFTs == null || profileNFTs == null || profileData == null || saving) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && (allOwnerNFTs.length ?? 0) === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  const detailedOwnerNFTs = allOwnerNFTs.map(nft => {
    if (profileNFTs.find(nft2 => nft2.id === nft.id)) {
      return {
        ...nft,
        hidden: true
      };
    } else {
      return {
        ...nft,
        hidden: false
      };
    }
  });

  const nftsToShow = editMode ?
    (detailedOwnerNFTs ?? []) :
    (profileNFTs ?? []);

  return (
    <>
      <div
        className={'profile-page-grid w-full'}>
        {nftsToShow.map((nft: PartialDeep<any>) => (
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
              profileURI={profileURI}
              contractAddress={nft?.contract}
              tokenId={nft?.tokenId}
              // only show the eye icons to the owner in edit mode
              visible={editMode ?
                nft?.hidden ?
                  (!draftToHide.has(nft?.id) && !draftHideAll) :
                  (draftToShow.has(nft?.id) || draftShowAll) :
                null
              }
              onVisibleToggle={() => {
                toggleHidden(nft?.id, nft?.hidden);
              }}
              onClick={() => {
                if (getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)) {
                  router.push('/app/nft/' + nft?.contract?.address + '/' + nft?.id);
                } else if (editMode) {
                  toggleHidden(nft?.id, nft?.hidden);
                } else {
                  alert('coming soon');
                }
              }}
              customBackground={tileBackgroundSecondary}
              customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
            />
          </div>
        ))}
      </div>
      {(!isAdmin || editMode) &&
      (editMode ? ownerNFTCount > nftsToShow.length : publicNFTCount > nftsToShow.length) &&
        <div className="mx-auto w-full min3xl:w-3/5 flex justify-center pb-8 font-medium text-always-white">
          <Button
            color={'text-always-white'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Load More'}
            onClick={() => {
              setLoadedCount(loadedCount + PROFILE_GALLERY_PAGE_SIZE);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      }
    </>
  );
}
