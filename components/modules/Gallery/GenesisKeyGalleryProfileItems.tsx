import { Button, ButtonType } from 'components/Button/Button';
import GalleryCard from 'components/Card/GalleryCard';
import { OwnedProfileGalleryCard } from 'components/Card/OwnedProfileGalleryCard';
import { Maybe } from 'graphql/generated/types';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { usePaginator } from 'hooks/usePaginator';
import { useGalleryShowMyStuff } from 'state/application/hooks';
import { tw } from 'utils/tw';
import helpers from 'utils/utils';

import { BigNumber } from 'ethers';
import { useCallback, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface GenesisKeyGalleryProfileItemsProps {
  showMyStuff: boolean;
}

const PROFILE_LOAD_COUNT = 20;

export function GenesisKeyGalleryProfileItems(props: GenesisKeyGalleryProfileItemsProps) {
  const navigate = useNavigate();
  const showMyStuff = useGalleryShowMyStuff();
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
        ...helpers.filterNulls(loadedProfilesNextPage?.latestProfiles?.items)
      ]);
      setLastAddedPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor);
      setTotalCount(loadedProfilesNextPage?.latestProfiles?.totalItems);
    }
  }, [allLoadedProfiles, lastAddedPage, loadedProfilesNextPage, setTotalCount]);

  if (props.showMyStuff) {
    return (
      <>
        {helpers.filterNulls(profileTokens)
          .map((profileToken, index) => {
            return (
              <div
                key={profileToken.id ?? index}
                className={tw(
                  'flex mb-4 items-center justify-center px-4',
                  'w-1/5 deprecated_lg:w-1/4 deprecated_md:w-1/3 deprecated_sm:w-2/5'
                )}
              >
                <OwnedProfileGalleryCard
                  token={profileToken}
                  onClick={() => {
                    navigate('/' + profileToken.uri.split('/').pop());
                  }}
                />
              </div>
            );
          })}
      </>
    );
  } else {
    return (
      <>
        {
          helpers.filterNulls(allLoadedProfiles ?? [])
            .filter(element => {
              const isDuplicate = uniqueIds.has(element.id);
              uniqueIds.add(element.id);
              return !isDuplicate;
            })
            .map((profile, index) => {
              const image = helpers.isNullOrEmpty(profile?.photoURL)
                ? 'https://cdn.nft.com/profile-image-default.svg'
                : helpers.processIPFSURL(
                  profile?.photoURL
                );
              return (
                <div
                  key={profile.id ?? index}
                  className={tw(
                    'flex mb-4 items-center justify-center px-4',
                    'w-1/5 deprecated_lg:w-1/4 deprecated_md:w-1/3 deprecated_sm:w-2/5'
                  )}
                >
                  <GalleryCard
                    size='small'
                    animate={false}
                    label={''}
                    imageURL={image}
                    onClick={() => {
                      navigate('/' + profile?.url);
                    }}
                  />
                </div>
              );
            })
        }
        { (totalProfileSupply?.toNumber() > PROFILE_LOAD_COUNT
              || (showMyStuff && profileTokens?.length > PROFILE_LOAD_COUNT))
              &&
              <div className="w-full flex justify-center my-16 pb-8">
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