import { Button, ButtonType } from 'components/elements/Button';
import GalleryCard from 'components/elements/GalleryCard';
import { OwnedProfileGalleryCard } from 'components/modules/Gallery/OwnedProfileGalleryCard';
import { Maybe } from 'graphql/generated/types';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useGallery } from 'hooks/state/useGallery';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { usePaginator } from 'hooks/usePaginator';
import { filterNulls, isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect,useState } from 'react';

export interface GenesisKeyGalleryProfileItemsProps {
  showMyStuff: boolean;
}

const PROFILE_LOAD_COUNT = 20;

export function GenesisKeyGalleryProfileItems(props: GenesisKeyGalleryProfileItemsProps) {
  const router = useRouter();
  const { galleryShowMyStuff: showMyStuff } = useGallery();
  const { profileTokens } = useMyNftProfileTokens();
  const { nftProfile } = useAllContracts();

  const uniqueIds = new Set();

  const [lastAddedPage, setLastAddedPage] = useState('');
  const [allLoadedProfiles, setAllLoadedProfiles] = useState([]);
  const [totalProfileSupply, setTotalProfileSupply] = useState<Maybe<BigNumber>>(null);

  const {
    nextPage,
    afterCursor,
    setTotalCount
  } = usePaginator(PROFILE_LOAD_COUNT);

  const { data: loadedProfilesNextPage } = useRecentProfilesQuery({
    first: PROFILE_LOAD_COUNT,
    afterCursor
  });

  const loadMoreProfiles = useCallback(() => {
    nextPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor);
  }, [loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor, nextPage]);

  useEffect(() => {
    (async () => {
      const totalSupply = await nftProfile.totalSupply();
      setTotalProfileSupply(totalSupply);
    })();
  }, [nftProfile]);

  useEffect(() => {
    if (
      loadedProfilesNextPage?.latestProfiles?.items?.length > 0 &&
      lastAddedPage !== loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor
    ) {
      setAllLoadedProfiles([
        ...allLoadedProfiles,
        ...filterNulls(loadedProfilesNextPage?.latestProfiles?.items)
      ]);
      setLastAddedPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor);
      setTotalCount(loadedProfilesNextPage?.latestProfiles?.totalItems);
    }
  }, [allLoadedProfiles, lastAddedPage, loadedProfilesNextPage, setTotalCount]);

  if (props.showMyStuff) {
    return (
      <>
        {filterNulls(profileTokens)
          .map((profileToken, index) => {
            return (
              <Link href={'/' + profileToken?.tokenUri?.raw?.split('/').pop()} key={profileToken.id.tokenId ?? index} passHref>
                <a
                  key={profileToken.id.tokenId ?? index}
                  className={tw(
                    'flex mb-4 items-center justify-center px-4',
                    'w-1/5 lg:w-1/4 md:w-1/3 sm:w-2/5'
                  )}
                >
                  <OwnedProfileGalleryCard
                    token={profileToken}
                    onClick={() => {
                      router.push('/' + profileToken?.tokenUri?.raw?.split('/').pop());
                    }}
                  />
                </a>
              </Link>
            );
          })}
      </>
    );
  } else {
    return (
      <>
        {
          filterNulls(allLoadedProfiles ?? [])
            .filter(element => {
              const isDuplicate = uniqueIds.has(element.id);
              uniqueIds.add(element.id);
              return !isDuplicate;
            })
            .map((profile, index) => {
              const image = isNullOrEmpty(profile?.photoURL)
                ? 'https://cdn.nft.com/profile-image-default.svg'
                : processIPFSURL(
                  profile?.photoURL
                );
              return (
                <Link href={'/' + profile?.url} key={profile.id ?? index} passHref>
                  <a
                    key={profile.id ?? index}
                    className={tw(
                      'flex mb-4 items-center justify-center ml-6',
                      'w-1/5 lg:w-1/4 md:w-1/3 sm:w-2/5'
                    )}
                  >
                    <GalleryCard
                      size='small'
                      animate={false}
                      label={''}
                      imageURL={image}
                      onClick={() => {
                        router.push('/' + profile?.url);
                      }}
                    />
                  </a>
                </Link>
              );
            })
        }
        { (totalProfileSupply?.toNumber() > PROFILE_LOAD_COUNT
              || (showMyStuff && profileTokens?.length > PROFILE_LOAD_COUNT))
              &&
              <div className="w-full flex justify-center pb-32">
                <Button
                  label={'Load More'}
                  onClick={loadMoreProfiles}
                  type={ButtonType.PRIMARY}
                />
              </div>
        }
      </>
    );
  }
}