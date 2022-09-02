import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { Maybe } from 'graphql/generated/types';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { ExternalProtocol } from 'types';
import { max, min } from 'utils/helpers';
import { multiplyBasisPoints } from 'utils/seaportHelpers';

import { CheckoutSuccessView } from './CheckoutSuccessView';
import { ListingTarget, NFTListingsContext } from './NFTListingsContext';
import { ProgressBarItem, VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X, XCircle } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useProvider, useSigner } from 'wagmi';

export interface NFTListingsCartSummaryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NFTListingsCartSummaryModal(props: NFTListingsCartSummaryModalProps) {
  const {
    toList,
    listAll,
    approveCollection,
    toggleCartSidebar,
    clear,
    allListingsConfigured
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

  const getMaxMarketplaceFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const feesByMarketplace = stagedListing.targets.map((target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          // Looksrare fee is fetched from the smart contract.
          return BigNumber.from(looksrareProtocolFeeBps == null
            ? 0
            : multiplyBasisPoints(target?.startingPrice ?? 0, looksrareProtocolFeeBps));
        } else {
          // Seaport fee is hard-coded in our codebase and not expected to change.
          return BigNumber.from(multiplyBasisPoints(target?.startingPrice ?? 0, 250));
        }
      });
      return cartTotal.add(max(...feesByMarketplace) ?? 0);
    }, BigNumber.from(0));
  }, [toList, looksrareProtocolFeeBps]);
 
  const getMaxRoyaltyFees = useCallback(() => {
    return toList?.reduce((cartTotal, stagedListing) => {
      const royaltiesByMarketplace = stagedListing.targets.map((target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          const minAskAmount = BigNumber.from(target?.looksrareOrder?.minPercentageToAsk ?? 0)
            .div(10000)
            .mul(BigNumber.from(target?.looksrareOrder?.price ?? 0));
          const marketplaceFeeAmount = BigNumber.from(looksrareProtocolFeeBps ?? 0)
            .div(10000)
            .mul(BigNumber.from(target?.looksrareOrder?.price ?? 0));
          return minAskAmount.sub(marketplaceFeeAmount);
        } else {
          return BigNumber.from(target?.seaportParameters?.consideration.length === 3 ?
            target?.seaportParameters?.consideration[2].startAmount :
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

  const getTotalMinimumProfit = useCallback(() => {
    const total = toList?.reduce((cartTotal, stagedListing) => {
      const targetValues = stagedListing.targets.map((target) => {
        return BigNumber.from(target?.startingPrice ?? stagedListing?.startingPrice ?? 0);
      });
      return cartTotal.add(min(...targetValues) ?? 0);
    }, BigNumber.from(0));

    return total.sub(getMaxMarketplaceFees()).sub(getMaxRoyaltyFees());
  } , [getMaxMarketplaceFees, getMaxRoyaltyFees, toList]);

  const getNeedsApprovals = useCallback(() => {
    return toList?.some(stagedListing =>
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.LooksRare) != null && !stagedListing?.isApprovedForLooksrare) ||
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.Seaport) != null && !stagedListing?.isApprovedForSeaport)
    );
  }, [toList]);

  const getSummaryContent = useCallback(() => {
    if (success) {
      return <div className='my-8'>
        <CheckoutSuccessView subtitle="You have successfully listed your items!" />
      </div>;
    } else if (showProgressBar) {
      return (
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
                  return stagedListing.targets.map((target: ListingTarget) => {
                    const approved = target.protocol === ExternalProtocol.LooksRare ?
                      stagedListing?.isApprovedForLooksrare :
                      stagedListing?.isApprovedForSeaport;
                    return {
                      label: 'Approve ' + stagedListing?.collectionName + ' for ' + target.protocol,
                      startIcon: target.protocol === ExternalProtocol.Seaport ?
                        <OpenseaIcon
                          className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                          alt="Opensea logo"
                          layout="fill"
                        /> :
                        <LooksrareIcon
                          className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                          alt="Looksrare logo"
                          layout="fill"
                        />,
                      endIcon: approved ?
                        <CheckCircle size={16} className="text-green-500 ml-2" /> :
                        error === 'ApprovalError' ?
                          <X size={16} className="text-red-400 ml-2" /> :
                          <SpinnerGap size={16} className="text-yellow-500 animate-spin ml-2" />,
                    } as ProgressBarItem;
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
      );
    } else {
      // fee summary, default state.
      return (
        <>
          <p className="text-xl font-bold">
            Summary and fees for {toList?.length ?? 0} NFT{toList?.length > 1 && 's'}
          </p>
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
              {ethers.utils.formatEther(getTotalMinimumProfit() ?? 0) + ' WETH'}
            </span>
          </div>
        </>
      );
    }
  }, [
    error,
    getMaxMarketplaceFees,
    getMaxRoyaltyFees,
    getNeedsApprovals,
    getTotalListings,
    getTotalMinimumProfit,
    showProgressBar,
    success,
    toList
  ]);

  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={''}
      onClose={() => {
        setSuccess(false);
        setShowProgressBar(false);
        setError(null);
        props.onClose();
      }}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 pb-10 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='pt-20 font-grotesk lg:max-w-md max-w-lg m-auto minlg:relative'>
          <div className='absolute top-4 right-4 minlg:right-1 hover:cursor-pointer w-6 h-6 bg-[#f9d963] rounded-full'></div>
          <XCircle onClick={() => {
            setSuccess(false);
            setShowProgressBar(false);
            setError(null);
            props.onClose();
          }} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer' size={32} color="black" weight="fill" />
          {getSummaryContent()}
          {toList.length > 0 && <div className="mx-8 my-4 flex">
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
                      const protocol = toList[i].targets[j].protocol;
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
                          return;
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
                          return;
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
          </div>}
        </div>
      </div>
    </Modal>
  );
}