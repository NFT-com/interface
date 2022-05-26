import { DropdownPicker } from 'components/elements/DropdownPicker';
import { LoadingRow } from 'components/elements/LoadingRow';
import { NFTCard } from 'components/elements/NFTCard';
import { Nft } from 'graphql/generated/types';
import { useFetchMyNFTs } from 'graphql/hooks/useFetchMyNFTs';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import useLazyLoad from 'hooks/useLazyLoad';

import { DashboardTabTitle } from './DashboardTabTitle';

import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import { PartialDeep } from 'type-fest';

const NUM_PER_PAGE = 8;

export function DashboardAssetsTab() {
  const triggerRef = useRef(null);
  const { fetchMyNFTs } = useFetchMyNFTs();
  const [nextCursor, setNextCursor] = useState('start');
  const [sortBy, setSortBy] = useState(0);
  const [itemTypes, setItemTypes] = useState(0);

  const onGrabData = useCallback((currentPage) => {
    // when we reach the end of the list
    if (nextCursor == null) {
      return [];
    }
    return fetchMyNFTs({
      first: NUM_PER_PAGE,
      afterCursor: nextCursor === 'start' ? null : nextCursor
    }).then((result) => {
      setNextCursor(result?.pageInfo?.lastCursor);
      return result?.items ?? [];
    });
  }, [fetchMyNFTs, nextCursor]);

  const { data, loading } = useLazyLoad({ triggerRef, onGrabData });
  const router = useRouter();
  const { setWalletSlideOpen } = useWalletSlide();

  const [selectedNFTs, setSelectedNFTs] = useState<PartialDeep<Nft>[]>([]);

  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <div className='w-full flex flex-row mt-8'>
        <div className='w-1/2'>
          <DashboardTabTitle title="My Assets" />
        </div>
        {/* todo: if we're keeping sorting/filtering, make it mobile friendly. */}
        <div className='w-1/2 flex flex-row-reverse space-x-4 space-x-reverse deprecated_sm:hidden'>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'All Items'}
              selectedIndex={itemTypes}
              options={[
                {
                  label: 'NFTs',
                  onSelect: () => setItemTypes(0),
                },
                {
                  label: 'Domains',
                  onSelect: () => setItemTypes(1)
                }
              ]}/>
          </div>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'Sort By'}
              selectedIndex={sortBy}
              options={[
                {
                  label: 'Price',
                  onSelect: () => setSortBy(0),
                },
                {
                  label: 'Rarity',
                  onSelect: () => setSortBy(1),
                },
                {
                  label: 'Recently Acquired',
                  onSelect: () => setSortBy(2),
                },
                {
                  label: 'Collection Type',
                  onSelect: () => setSortBy(3),
                },
              ]}/>
          </div>
        </div>
      </div>
      <div className='pt-10 flex flex-wrap justify-around'>
        {(data ?? [])?.map((nft) => {
          return <div key={nft?.id} className="flex w-1/5 mx-1 shrink-0 deprecated_sm:w-full deprecated_sm:px-8 deprecated_sm:mb-2">
            <NFTCard
              header={{ key: 'Type: ', value: 'NFT' }}
              title={nft?.metadata?.name}
              subtitle={'#' + nft?.tokenId}
              images={[nft?.metadata?.imageURL]}
              onSelectToggle={(selected: boolean) => {
                if (selected) {
                  setSelectedNFTs([...selectedNFTs, nft]);
                } else {
                  setSelectedNFTs(selectedNFTs.filter((included) => included.id === nft.id));
                }
              }}
              onClick={() => {
                setWalletSlideOpen(false);
                router.push(`/app/nft/${nft?.contract}/${nft?.tokenId}`);
              }}
            />
          </div>;
        })}
        {nextCursor != null && <div ref={triggerRef} className={`${loading ? 'trigger': ''}`}>
          <LoadingRow />
        </div>}
      </div>
    </div>
  );
}