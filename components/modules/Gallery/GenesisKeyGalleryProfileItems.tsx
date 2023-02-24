import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { OwnedProfileGalleryCard } from 'components/modules/Gallery/OwnedProfileGalleryCard';
import { ProfileCard } from 'components/modules/Profile/ProfileCard';
import { Maybe, Profile } from 'graphql/generated/types';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useGallery } from 'hooks/state/useGallery';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { usePaginator } from 'hooks/usePaginator';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect,useState } from 'react';
import { PartialDeep } from 'type-fest';

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
  const [allLoadedProfiles, setAllLoadedProfiles] = useState<PartialDeep<Profile>[]>([]);
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
      <div className='flex w-full flex-wrap items-center justify-center'>
        {filterNulls(profileTokens)
          .map((profileToken, index) => {
            return (
              <Link
                href={'/' + profileToken?.tokenUri?.raw?.split('/').pop()}
                key={profileToken.id.tokenId ?? index}
                passHref
              >
                <a
                  key={profileToken.id.tokenId ?? index}
                  className={tw(
                    'flex items-center justify-center p-4',
                    'minxl:w-1/5 minlg:w-1/4 minmd:w-1/3 w-2/5'
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
      </div>
    );
  } else {
    return (
      <div className='flex w-full flex-wrap items-center justify-center'>
        {
          filterNulls(allLoadedProfiles ?? [])
            .filter(element => {
              const isDuplicate = uniqueIds.has(element.id);
              uniqueIds.add(element.id);
              return !isDuplicate;
            })
            .map((profile, index) => {
              return (
                <div className='m-4 ProfileGalleryCardContainer' key={index}>
                  <ProfileCard profile={profile} />
                </div>
              );
            })
        }
        { (totalProfileSupply?.toNumber() > PROFILE_LOAD_COUNT
              || (showMyStuff && profileTokens?.length > PROFILE_LOAD_COUNT))
              &&
              <div className="w-full flex justify-center pb-32 mt-12">
                <Button
                  size={ButtonSize.LARGE}
                  label={'Load More'}
                  onClick={loadMoreProfiles}
                  type={ButtonType.PRIMARY}
                />
              </div>
        }
      </div>
    );
  }
}