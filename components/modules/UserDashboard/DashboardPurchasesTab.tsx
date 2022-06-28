import { DropdownPicker } from 'components/elements/DropdownPicker';
import { LoadingRow } from 'components/elements/LoadingRow';
import { MarketplaceMultiAssetCard } from 'components/elements/MarketplaceMultiAssetCard';
import { MarketSwap } from 'graphql/generated/types';
import { useFetchSwaps } from 'graphql/hooks/useFetchSwaps';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import useLazyLoad from 'hooks/useLazyLoad';
import { getEtherscanLink, shorten } from 'utils/helpers';

import { DashboardTabTitle } from './DashboardTabTitle';

import { useCallback, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export function DashboardPurchasesTab() {
  const triggerRef = useRef(null);
  const [selectedSwaps, setSelectedSwaps] = useState<PartialDeep<MarketSwap>[]>([]);
  const [nextCursor, setNextCursor] = useState('start');
  const [sortBy, setSortBy] = useState(0);

  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { fetchSwaps } = useFetchSwaps();
  const { setWalletSlideOpen } = useWalletSlide();

  const onGrabData = useCallback(() => {
    // when we reach the end of the list
    if (nextCursor == null) {
      return [];
    }
    return fetchSwaps(
      account?.address,
      {
        first: 12, // num per page
        afterCursor: nextCursor === 'start' ? null : nextCursor
      }).then((result) => {
      setNextCursor(result?.pageInfo?.lastCursor);
      return result?.items ?? [];
    });
  }, [account?.address, fetchSwaps, nextCursor]);

  const { data: swaps, loading } = useLazyLoad({ triggerRef, onGrabData });

  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <div className='w-full flex flex-row mt-8'>
        <div className='w-1/2 deprecated_sm:w-full'>
          <DashboardTabTitle title='My Transactions' />
        </div>
        <div className='w-1/2 flex flex-row-reverse space-x-4 space-x-reverse deprecated_sm:hidden'>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'Sort By'}
              selectedIndex={sortBy}
              options={[
                {
                  label: 'Date Purchased',
                  onSelect: () => setSortBy(0),
                },
                {
                  label: 'Auction Type',
                  onSelect: () => setSortBy(1)
                }
              ]}/>
          </div>
        </div>
      </div>
      <div className="pt-10 flex flex-wrap justify-around">
        {(swaps ?? []).map((swap: PartialDeep<MarketSwap>) => {
          return (
            <a target="_blank" rel="noreferrer"
              href={getEtherscanLink(
                activeChain?.id,
                swap.txHash,
                'transaction'
              )}
              key={swap?.txHash} className="flex w-1/5 mx-1 shrink-0 deprecated_sm:w-full deprecated_sm:px-8 deprecated_sm:mb-2">
              
              <MarketplaceMultiAssetCard
                assets={[...swap.marketAsk.makeAsset, ...swap.marketAsk.takeAsset]}
                subtitle={'TX: #' + shorten(swap.txHash, isMobile)}
                type={'Swap'}
                onSelectToggle={(selected: boolean) => {
                  if (selected) {
                    setSelectedSwaps([...selectedSwaps, swap]);
                  } else {
                    setSelectedSwaps(
                      selectedSwaps.filter((included) => included.txHash === swap.txHash));
                  }
                }}
                onClick={() => {
                  setWalletSlideOpen(false);
                }}
              />
            </a>
          );
        })}
        {nextCursor != null && <div ref={triggerRef} className={`${loading ? 'trigger': ''}`}>
          <LoadingRow />
        </div>}
      </div>
    </div>
  );
}