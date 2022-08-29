import { Button, ButtonType } from 'components/elements/Button';
import { Maybe } from 'graphql/generated/types';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { ExternalProtocol } from 'types';
import { isNullOrEmpty, max } from 'utils/helpers';
import { multiplyBasisPoints } from 'utils/seaportHelpers';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useProvider, useSigner } from 'wagmi';

export function NFTListingsCartSummary() {
  const {
    toList,
    listAll,
    approveCollection,
    toggleCartSidebar,
    clear,
  } = useContext(NFTListingsContext);
  const provider = useProvider();
  const looksrareStrategy = useLooksrareStrategyContract(provider);
  const { data: signer } = useSigner();

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'ListingError' | 'ConnectionError'>>(null);

  const { data: looksrareProtocolFeeBps } = useSWR(
    'LooksrareProtocolFeeBps' + String(looksrareStrategy == null),
    async () => {
      return await looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const allListingsConfigured = useCallback(() => {
    const unconfigured = toList.find((listing: StagedListing) => {
      return listing.startingPrice == null || BigNumber.from(listing.startingPrice).eq(0) ||
              listing.nft == null ||
              listing.duration == null ||
              isNullOrEmpty(listing.currency) ||
              isNullOrEmpty(listing.targets) ||
              (listing.seaportParameters == null && listing.looksrareOrder == null);
    });
    return unconfigured == null;
  }, [toList]);

  const getMaxMarketplaceFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const feesByMarketplace = stagedListing.targets.map((protocol) => {
        if (protocol === ExternalProtocol.LooksRare) {
          // Looksrare fee is fetched from the smart contract.
          return BigNumber.from(looksrareProtocolFeeBps == null
            ? 0
            : multiplyBasisPoints(stagedListing?.startingPrice ?? 0, looksrareProtocolFeeBps));
        } else {
          // Seaport fee is hard-coded in our codebase and not expected to change.
          return BigNumber.from(multiplyBasisPoints(stagedListing?.startingPrice ?? 0, 250));
        }
      });
      return cartTotal.add(max(...feesByMarketplace) ?? 0);
    }, BigNumber.from(0));
  }, [toList, looksrareProtocolFeeBps]);
 
  const getMaxRoyaltyFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const royaltiesByMarketplace = stagedListing.targets.map((protocol) => {
        if (protocol === ExternalProtocol.LooksRare) {
          const minAskAmount = BigNumber.from(stagedListing?.looksrareOrder?.minPercentageToAsk ?? 0)
            .div(10000)
            .mul(BigNumber.from(stagedListing?.looksrareOrder?.price ?? 0));
          const marketplaceFeeAmount = BigNumber.from(looksrareProtocolFeeBps ?? 0)
            .div(10000)
            .mul(BigNumber.from(stagedListing?.looksrareOrder?.price ?? 0));
          return minAskAmount.sub(marketplaceFeeAmount);
        } else {
          return BigNumber.from(stagedListing?.seaportParameters?.consideration.length === 3 ?
            stagedListing?.seaportParameters?.consideration[2].startAmount :
            0);
        }
      });
      return cartTotal.add(max(...royaltiesByMarketplace) ?? 0);
    }, BigNumber.from(0));
  }, [looksrareProtocolFeeBps, toList]);

  const getTotalListings = useCallback(() => {
    return toList?.reduce((total, stagedListing) => {
      return total + stagedListing?.targets.length ?? 0;
    }, 0);
  }, [toList]);

  const getTotalProfit = useCallback(() => {
    const total = toList?.reduce((cartTotal, stagedListing) => {
      return BigNumber.from(stagedListing?.startingPrice ?? 0).add(cartTotal);
    }, BigNumber.from(0));

    return total.sub(getMaxMarketplaceFees()).sub(getMaxRoyaltyFees());
  } , [getMaxMarketplaceFees, getMaxRoyaltyFees, toList]);

  const getNeedsApprovals = useCallback(() => {
    return toList?.some(stagedListing =>
      (stagedListing.targets.includes(ExternalProtocol.LooksRare) && !stagedListing?.isApprovedForLooksrare) ||
      (stagedListing.targets.includes(ExternalProtocol.Seaport) && !stagedListing?.isApprovedForSeaport)
    );
  }, [toList]);

  return (
    <>
      {
        showProgressBar
          ? (
            <div className="mx-8">
              <VerticalProgressBar
                activeNodeIndex={
                  error === 'ConnectionError' ?
                    0 :
                    getNeedsApprovals() || error === 'ApprovalError' ? 1 : success ? 3 : 2
                }
                nodes={[
                  {
                    label: 'Initialize Wallet',
                    error: error === 'ConnectionError'
                  },
                  {
                    label: 'Approve Collections for Sale',
                    error: error === 'ApprovalError',
                    items: toList?.map((stagedListing) => {
                      return stagedListing.targets.map((protocol) => {
                        const approved = protocol === ExternalProtocol.LooksRare ?
                          stagedListing?.isApprovedForLooksrare :
                          stagedListing?.isApprovedForSeaport;
                        return {
                          label: 'Approve ' + stagedListing?.collectionName + ' for ' + protocol,
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
                <span>Max marketplace fees: {' '}</span>
                <span className='ml-2'>
                  {ethers.utils.formatEther(getMaxMarketplaceFees() ?? 0) + ' WETH'}
                </span>
              </div>
              <div className="mx-8 my-4 flex items-center">
                <span>Max royalties: </span>
                <span className='ml-2'>
                  {ethers.utils.formatEther(getMaxRoyaltyFees() ?? 0) + ' WETH'}
                </span>
              </div>
              <div className="mx-8 my-4 flex items-center">
                <span>Minimum profit: </span>
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
          disabled={!allListingsConfigured() || (showProgressBar && !error && !success)}
          label={success ? 'Finish' : error ? 'Try Again' : 'List Now'}
          onClick={async () => {
            if (success) {
              clear();
              setSuccess(false);
              toggleCartSidebar();
              setShowProgressBar(false);
              return;
            }

            if (signer == null) {
              setError('ConnectionError');
              return;
            }

            setShowProgressBar(true);
            setError(null);
            setSuccess(false);
            
            if (signer == null) {
              setError('ConnectionError');
              return;
            }

            if (getNeedsApprovals()) {
              for (let i = 0; i < toList.length; i++) {
                const stagedListing = toList[i];
                for (let j = 0; j < toList[i].targets.length; j++) {
                  const protocol = toList[i].targets[j];
                  const approved = protocol === ExternalProtocol.LooksRare ?
                    stagedListing?.isApprovedForLooksrare :
                    stagedListing?.isApprovedForSeaport;
                  if (!approved && protocol === ExternalProtocol.LooksRare) {
                    const result = await approveCollection(stagedListing, ExternalProtocol.LooksRare)
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
                  } else if (!approved && protocol === ExternalProtocol.Seaport) {
                    const result = await approveCollection(stagedListing, ExternalProtocol.Seaport)
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
            } else {
              setError('ListingError');
            }
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
    </>
  );
}