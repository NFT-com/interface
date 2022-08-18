import { Button, ButtonType } from 'components/elements/Button';
import { Maybe } from 'graphql/generated/types';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { multiplyBasisPoints } from 'utils/seaportHelpers';

import { NFTListingsContext } from './NFTListingsContext';
import { VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber, BigNumberish, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useProvider } from 'wagmi';

export function NFTListingsCartSidebarSummary() {
  const {
    toList,
    listAll,
    approveCollection,
    toggleCartSidebar,
    clear
  } = useContext(NFTListingsContext);
  const provider = useProvider();
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'ListingError'>>(null);

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

  const getTotalListings = useCallback(() => {
    return toList?.reduce((total, stagedListing) => {
      return total + stagedListing?.targets.length ?? 0;
    }, 0);
  }, [toList]);

  const getTotalProfit = useCallback(() => {
    const total = toList?.reduce((cartTotal, stagedListing) => {
      const totalFees = stagedListing.targets.reduce((nftTotal, marketplace) => {
        let newFee: BigNumberish;
        if (marketplace === 'looksrare') {
          newFee = BigNumber.from(stagedListing?.looksrareOrder?.minPercentageToAsk ?? 0)
            .div(10000)
            .mul(BigNumber.from(stagedListing?.looksrareOrder?.price ?? 0));
        } else {
          newFee = stagedListing?.seaportParameters?.consideration[0].startAmount;
        }
        return BigNumber.from(nftTotal).add(newFee);
      }, BigNumber.from(0));
      return totalFees.add(cartTotal);
    }, BigNumber.from(0));

    return total;
  } , [toList]);

  const getNeedsApprovals = useCallback(() => {
    return toList?.some(stagedListing =>
      (stagedListing.targets.includes('looksrare') && !stagedListing?.isApprovedForLooksrare) ||
      (stagedListing.targets.includes('seaport') && !stagedListing?.isApprovedForSeaport)
    );
  }, [toList]);

  return (
    <>
      {
        showProgressBar
          ? (
            <div className="mx-8">
              <VerticalProgressBar
                activeNodeIndex={getNeedsApprovals() || error === 'ApprovalError' ? 1 : success ? 3 : 2}
                nodes={[
                  {
                    label: 'Initialize Wallet',
                  },
                  {
                    label: 'Approve Collections for Sale',
                    error: error === 'ApprovalError',
                    items: toList?.map((stagedListing) => {
                      return stagedListing.targets.map((marketplace) => {
                        const approved = marketplace === 'looksrare' ?
                          stagedListing?.isApprovedForLooksrare :
                          stagedListing?.isApprovedForSeaport;
                        return {
                          label: 'Approve ' + stagedListing?.collectionName + ' for ' + marketplace,
                          icon: approved ?
                            <CheckCircle size={16} className="text-green-500" /> :
                            error === 'ApprovalError' ?
                              <X size={16} className="text-red-400" /> :
                              <SpinnerGap size={16} className="text-yellow-500 animate-spin" />,
                        };
                      });
                    }).flat()
                  },
                  {
                    label: `Confirm ${getTotalListings()} Listings`,
                    error: error === 'ListingError',
                  }
                ]}
              />
            </div>
          )
          : (
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
              <div className="mx-8 my-4 flex items-center">
                <span>Total profit: </span>
                <span className='ml-2'>
                  {ethers.utils.formatEther(getTotalProfit() ?? 0) + ' WETH'}
                </span>
              </div>
            </>
          )
      }
      <div className="mx-8 my-4 flex">
        <Button
          stretch
          loading={showProgressBar && !error && !success}
          disabled={showProgressBar && !error && !success}
          label={success ? 'Finish' : 'List Now'}
          onClick={async () => {
            if (success) {
              clear();
              setSuccess(false);
              toggleCartSidebar();
            }

            setShowProgressBar(true);
            setError(null);
            setSuccess(false);

            if (getNeedsApprovals()) {
              for (let i = 0; i < toList.length; i++) {
                const stagedListing = toList[i];
                for (let j = 0; j < toList[i].targets.length; j++) {
                  const marketplace = toList[i].targets[j];
                  const approved = marketplace === 'looksrare' ?
                    stagedListing?.isApprovedForLooksrare :
                    stagedListing?.isApprovedForSeaport;
                  if (!approved && marketplace === 'looksrare') {
                    const result = await approveCollection(stagedListing, 'looksrare')
                      .then(result => {
                        if (!result) {
                          setError('ApprovalError');
                          return false;
                        }
                        return true;
                      })
                      .catch(() => {
                        setError('ApprovalError');
                        return false;
                      });
                    stagedListing.isApprovedForLooksrare = result;
                    if (!result) {
                      break;
                    }
                  } else if (!approved && marketplace === 'seaport') {
                    const result = await approveCollection(stagedListing, 'seaport')
                      .then(result => {
                        if (!result) {
                          setError('ApprovalError');
                          return false;
                        }
                        return true;
                      })
                      .catch(() => {
                        setError('ApprovalError');
                        return false;
                      });
                    stagedListing.isApprovedForSeaport = result;
                    if (!result) {
                      break;
                    }
                  }
                }
              }
            }

            const result = await listAll();
            if (result) {
              setSuccess(true);
            }
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
    </>
  );
}