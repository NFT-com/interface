import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { Maybe, NftType } from 'graphql/generated/types';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { filterDuplicates, isNullOrEmpty } from 'utils/helpers';
import { getMaxMarketplaceFeesUSD, getMaxRoyaltyFeesUSD, getProtocolDisplayName } from 'utils/marketplaceUtils';

import { CheckoutSuccessView, SuccessType } from './CheckoutSuccessView';
import { ListAllResult, ListingTarget, NFTListingsContext } from './NFTListingsContext';
import { ProgressBarItem, VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import NFTLogo from 'public/nft_logo_yellow.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useProvider, useSigner } from 'wagmi';

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
  const { address: currentAddress } = useAccount();
  const { getByContractAddress } = useSupportedCurrencies();
  const { marketplace } = useAllContracts();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Maybe<
  'ApprovalError' | 'ListingSignatureRejected' | 'ListingUnknownError' | 'ConnectionError'
  >>(null);

  const { data: looksrareProtocolFeeBps } = useSWR(
    'LooksrareProtocolFeeBps' + String(looksrareStrategy == null),
    async () => {
      return await looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const { data: NFTCOMProtocolFee } = useSWR(
    'NFTCOMProtocolFee' + currentAddress,
    async () => {
      return await marketplace.protocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const { data: NFTCOMProfileFee } = useSWR(
    'NFTCOMProfileFee' + currentAddress,
    async () => {
      return await marketplace.profileFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const getMaxMarketplaceFees: () => number = useCallback(() => {
    return getMaxMarketplaceFeesUSD(toList, looksrareProtocolFeeBps, getByContractAddress, myOwnedProfileTokens?.length ? NFTCOMProfileFee : Number(NFTCOMProtocolFee));
  }, [toList, looksrareProtocolFeeBps, getByContractAddress, myOwnedProfileTokens?.length, NFTCOMProfileFee, NFTCOMProtocolFee]);

  const getMaxRoyaltyFees: () => number = useCallback(() => {
    return getMaxRoyaltyFeesUSD(toList, looksrareProtocolFeeBps, getByContractAddress);
  }, [toList, looksrareProtocolFeeBps, getByContractAddress]);

  const getTotalListings = useCallback(() => {
    return toList?.reduce((total, stagedListing) => {
      return total + stagedListing?.targets.length ?? 0;
    }, 0);
  }, [toList]);

  const getTotalMinimumProfitUSD: () => number = useCallback(() => {
    const total = toList?.reduce((cartTotal, stagedListing) => {
      const targetValues = stagedListing?.targets.map((target) => {
        const currencyData = getByContractAddress(stagedListing.currency ?? target.currency);
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          BigNumber.from(stagedListing.startingPrice ?? target.startingPrice ?? 0),
          currencyData?.decimals ?? 18
        ))) ?? 0;
      });
      return cartTotal + Math.min(...targetValues || []);
    }, 0);

    return total - getMaxMarketplaceFees() - getMaxRoyaltyFees();
  } , [getByContractAddress, getMaxMarketplaceFees, getMaxRoyaltyFees, toList]);

  const getNeedsApprovals = useCallback(() => {
    return toList?.some(stagedListing =>
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.LooksRare) != null &&
        (stagedListing?.nft?.type == NftType.Erc721 ?
          !stagedListing?.isApprovedForLooksrare :
          !stagedListing?.isApprovedForLooksrare1155)) ||
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.Seaport) != null && !stagedListing?.isApprovedForSeaport) ||
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.X2Y2) != null &&
        (stagedListing?.nft?.type == NftType.Erc721 ?
          !stagedListing?.isApprovedForX2Y2 :
          !stagedListing?.isApprovedForX2Y21155)) ||
      (stagedListing.targets.find(target => target.protocol === ExternalProtocol.NFTCOM) != null && !stagedListing?.isApprovedForNFTCOM)
    );
  }, [toList]);

  const getSummaryContent = useCallback(() => {
    if (success) {
      return <CheckoutSuccessView userAddress={currentAddress} type={SuccessType.Listing} subtitle="You have successfully listed your items!" />;
    } else if (!isNullOrEmpty(error)) {
      return <div className='flex flex-col w-full'>
        <div className="text-3xl mx-4 font-bold">
          {error === 'ApprovalError' ? 'Approval' : 'Listing'} Failed
          <div className='w-full my-8'>
            <span className='font-medium text-[#6F6F6F] text-base'>
              {error === 'ConnectionError' && 'Your wallet is not connected. Please connect your wallet and try again.'}
              {error === 'ListingSignatureRejected' && 'You must sign the listing data to proceed.'}
              {error === 'ListingUnknownError' && 'Your signature was valid, but we encountered an unexpected issue. Please try again later.'}
            </span>
          </div>
        </div>.
      </div>;
    } else if (showProgressBar) {
      return (
        <div className="">
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
                items: filterDuplicates(
                  toList,
                  (first, second) => first.nft?.contract === second.nft?.contract
                )?.map((stagedListing) => {
                  return stagedListing.targets.map((target: ListingTarget) => {
                    const approved = target.protocol === ExternalProtocol.LooksRare ?
                      stagedListing?.nft?.type == NftType.Erc721 ?
                        stagedListing?.isApprovedForLooksrare :
                        stagedListing?.isApprovedForLooksrare1155 :
                      target.protocol === ExternalProtocol.X2Y2 ?
                        stagedListing?.nft?.type == NftType.Erc721 ?
                          stagedListing?.isApprovedForX2Y2 :
                          stagedListing?.isApprovedForX2Y21155 :
                        target.protocol === ExternalProtocol.NFTCOM
                          ? stagedListing?.isApprovedForNFTCOM :
                          stagedListing?.isApprovedForSeaport;
                    return {
                      label: 'Approve ' + (!isNullOrEmpty(stagedListing?.collectionName) ? stagedListing?.collectionName : 'Collection') + ' for ' + getProtocolDisplayName(target.protocol),
                      startIcon: target.protocol === ExternalProtocol.Seaport ?
                        <OpenseaIcon
                          className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                          alt="Opensea logo"
                          layout="fill"
                        /> :
                        target.protocol === ExternalProtocol.LooksRare ?
                          <LooksrareIcon
                            className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                            alt="Looksrare logo"
                            layout="fill"
                          /> :

                          target.protocol === ExternalProtocol.NFTCOM ?
                            <NFTLogo
                              className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                              alt="NFT.com logo"
                              layout="fill"
                            /> :
                            <X2Y2Icon
                              className={'h-8 w-8 shrink-0 grow-0 aspect-square'}
                              alt="Looksrare logo"
                              layout="fill"
                            />
                      ,
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
                error: error === 'ListingSignatureRejected' || error === 'ListingUnknownError',
              }
            ]}
          />
        </div>
      );
    } else {
      // fee summary, default state.
      return (
        <>
          <p className="text-3xl font-noi-grotesk mx-4">
            Listing Fees
          </p>
          <p className='text-2xl text-[#6F6F6F] mx-4 font-bold'>
            {toList?.length ?? 0} NFT{toList?.length > 1 && 's'}
          </p>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className='font-semibold'>Max Marketplace Fees</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col align-end">
              <span className='font-semibold'>{'$' + (getMaxMarketplaceFees()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? 0) }</span>
            </div>
          </div>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className='flex flex-col'>
              <span className='font-semibold'>Max Royalties</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col justify-end">
              <span className="font-semibold">{'$' + (getMaxRoyaltyFees()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? 0)}</span>
            </div>
          </div>
          <div className='px-8 border-t border-[#D5D5D5] w-full'/>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className='flex flex-col'>
              <span className='font-semibold'>Minimum Profit</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
              Estimated Value
              </span>
            </div>
            <div className='flex flex-col justify-end'>
              <span className='font-semibold'>{'$' + (getTotalMinimumProfitUSD()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? 0)}</span>
            </div>
          </div>
        </>
      );
    }
  }, [
    currentAddress,
    error,
    getMaxMarketplaceFees,
    getMaxRoyaltyFees,
    getNeedsApprovals,
    getTotalListings,
    getTotalMinimumProfitUSD,
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
      <div className={`max-w-full overflow-hidden ${success ? myOwnedProfileTokens?.length == 0 ? 'minlg:max-w-[458px]' : 'minlg:max-w-[700px]' : 'minlg:max-w-[458px] px-4 py-5'} h-screen minlg:h-max maxlg:h-max bg-white text-left rounded-none minlg:rounded-[20px] minlg:mt-24 minlg:m-auto`}>
        <div className={`font-noi-grotesk ${success ? myOwnedProfileTokens?.length == 0 ? 'lg:max-w-md max-w-lg' : 'lg:w-full' : 'pt-3 lg:max-w-md max-w-lg'} m-auto minlg:relative`}>
          <X onClick={() => {
            if (success) {
              clear();
              toggleCartSidebar();
            }
            setSuccess(false);
            setShowProgressBar(false);
            setError(null);
            props.onClose();
          }} className='absolute top-3 z-50 right-3 hover:cursor-pointer closeButton' size={32} color="black" weight="fill" />
          {getSummaryContent()}
          {!success && <div className="my-4 mt-8 flex">
            <Button
              stretch
              loading={showProgressBar && !error && !success}
              disabled={!allListingsConfigured() || (showProgressBar && !error && !success)}
              label={success ? 'Finish' : error ? 'Try Again' : 'Proceed to list'}
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
                  const uniqueCollections = filterDuplicates(
                    toList,
                    (first, second) => first.nft?.contract === second.nft?.contract
                  );
                  for (let i = 0; i < uniqueCollections.length; i++) {
                    const stagedListing = uniqueCollections[i];
                    for (let j = 0; j < uniqueCollections[i].targets.length; j++) {
                      const protocol = uniqueCollections[i].targets[j].protocol;
                      const approved = protocol === ExternalProtocol.LooksRare ?
                        stagedListing?.nft.type === NftType.Erc721 ?
                          stagedListing?.isApprovedForLooksrare :
                          stagedListing?.isApprovedForLooksrare1155 :
                        protocol === ExternalProtocol.X2Y2 ?
                          stagedListing?.nft?.type === NftType.Erc721 ?
                            stagedListing?.isApprovedForX2Y2 :
                            stagedListing?.isApprovedForX2Y21155 :
                          protocol === ExternalProtocol.NFTCOM
                            ? stagedListing?.isApprovedForNFTCOM :
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
                      } else if (!approved && protocol === ExternalProtocol.X2Y2) {
                        const result = await approveCollection(stagedListing, ExternalProtocol.X2Y2)
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
                        stagedListing.isApprovedForX2Y2 = result;
                        if (!result) {
                          return;
                        }
                      } else if (!approved && protocol === ExternalProtocol.NFTCOM) {
                        const result = await approveCollection(stagedListing, ExternalProtocol.NFTCOM)
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
                        stagedListing.isApprovedForNFTCOM = result;
                        if (!result) {
                          return;
                        }
                      }
                    }
                  }
                }

                const result: ListAllResult = await listAll();
                if (result === ListAllResult.Success) {
                  setSuccess(true);
                } else {
                  setError(
                    result === ListAllResult.SignatureRejected ?
                      'ListingSignatureRejected' :
                      'ListingUnknownError'
                  );
                }
              }}
              type={ButtonType.PRIMARY}
            />
          </div>}
          {
            !isNullOrEmpty(error) &&
            <div className='w-full mt-4'>
              <Button
                stretch
                label={'Cancel'}
                onClick={() => {
                  setSuccess(false);
                  setShowProgressBar(false);
                  setError(null);
                  props.onClose();
                }}
                type={ButtonType.SECONDARY}
              />
            </div>
          }
        </div>
      </div>
    </Modal>
  );
}