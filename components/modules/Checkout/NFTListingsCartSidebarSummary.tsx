import { Button, ButtonType } from 'components/elements/Button';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { multiplyBasisPoints } from 'utils/seaportHelpers';

import { NFTListingsContext } from './NFTListingsContext';

import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useProvider } from 'wagmi';

export function NFTListingsCartSidebarSummary() {
  const {
    toList,
    listAll
  } = useContext(NFTListingsContext);
  const provider = useProvider();
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const [showProgressBar, setShowProgressBar] = useState(false);

  const { data: looksrareProtocolFeeBps } = useSWR(
    'LooksrareProtocolFeeBps' + String(looksrareStrategy == null),
    async () => {
      return await looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });

  const getTotalMarketplaceFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const totalFees = stagedListing.targets.reduce((nftTotal, marketplace) => {
        let newFee: BigNumberish;
        if (marketplace === 'looksrare') {
          // Looksrare fee is fetched from the smart contract.
          newFee = looksrareProtocolFeeBps == null
            ? 0
            : multiplyBasisPoints(stagedListing?.startingPrice ?? 0, looksrareProtocolFeeBps);
        } else {
          // Seaport fee is hard-coded in our codebase and not expected to change.
          newFee = multiplyBasisPoints(stagedListing?.startingPrice ?? 0, 250);
        }
        return BigNumber.from(nftTotal).add(newFee);
      }, BigNumber.from(0));
      return totalFees.add(cartTotal);
    }, BigNumber.from(0));
  }, [toList, looksrareProtocolFeeBps]);
 
  const getTotalRoyaltyFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const totalFees = stagedListing.targets.reduce((nftTotal, marketplace) => {
        let newFee: BigNumberish;
        if (marketplace === 'looksrare') {
          const minAskAmount = BigNumber.from(stagedListing?.looksrareOrder?.minPercentageToAsk ?? 0)
            .div(10000)
            .mul(BigNumber.from(stagedListing?.looksrareOrder?.price ?? 0));
          const marketplaceFeeAmount = BigNumber.from(looksrareProtocolFeeBps ?? 0)
            .div(10000)
            .mul(BigNumber.from(stagedListing?.looksrareOrder?.price ?? 0));
          newFee = minAskAmount.sub(marketplaceFeeAmount);
        } else {
          newFee = stagedListing?.seaportParameters?.consideration.length === 3 ?
            stagedListing?.seaportParameters?.consideration[2].startAmount :
            0;
        }
        return BigNumber.from(nftTotal).add(newFee);
      }, BigNumber.from(0));
      return totalFees.add(cartTotal);
    }, BigNumber.from(0));
  }, [looksrareProtocolFeeBps, toList]);

  return (
    <>
      <div className="mx-8 my-4 flex items-center">
        <span>Total marketplace fees: {' '}</span>
        <span className='ml-2'>
          {ethers.utils.formatEther(getTotalMarketplaceFees() ?? 0) + ' WETH'}
        </span>
      </div>
      <div className="mx-8 my-4 flex items-center">
        <span>Total royalties: </span>
        <span className='ml-2'>
          {ethers.utils.formatEther(getTotalRoyaltyFees() ?? 0) + ' WETH'}
        </span>
      </div>
      <div className="mx-8 my-4 flex">
        <Button
          stretch
          loading={showProgressBar}
          disabled={showProgressBar}
          label={'List Now'}
          onClick={() => {
            setShowProgressBar(true);
            listAll();
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
    </>
  );
}