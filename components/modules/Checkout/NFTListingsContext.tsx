import { Nft } from 'graphql/generated/types';
import { useListNFTMutations } from 'graphql/hooks/useListNFTMutation';
import { TransferProxyTarget } from 'hooks/balances/useNftCollectionAllowance';
import { get721Contract } from 'hooks/contracts/get721Contract';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { SupportedCurrency, useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol, Fee, SeaportOrderParameters } from 'types';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { getLooksrareNonce, getOpenseaCollection } from 'utils/marketplaceHelpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';

import { CartSidebarTab, NFTCartSidebar } from './NFTCartSidebar';
import { NFTPurchasesContext } from './NFTPurchaseContext';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumber, BigNumberish } from 'ethers';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useProvider, useSigner } from 'wagmi';

export type ListingTarget = {
  protocol: ExternalProtocol,
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // these are set when finalizing, before triggering the wallet requests
  looksrareOrder: MakerOrder; // looksrare
  seaportParameters: SeaportOrderParameters; // seaport
}

export type StagedListing = {
  // this is the minimum required field
  nft: PartialDeep<Nft>;
  collectionName: string;
  // these are set in configuration page
  targets: PartialDeep<ListingTarget>[],
  // top-level configs which will apply to all targets, if there is no target-specific value
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // approval-related data
  isApprovedForSeaport: boolean;
  isApprovedForLooksrare: boolean;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: PartialDeep<StagedListing>) => void;
  stageListings: (listings: PartialDeep<StagedListing[]>) => void;
  clear: () => void;
  listAll: () => Promise<boolean>;
  prepareListings: () => Promise<void>;
  
  submitting: boolean;
  toggleCartSidebar: (selectedTab?: CartSidebarTab) => void;
  toggleTargetMarketplace: (marketplace: ExternalProtocol, listing?: PartialDeep<StagedListing>) => void;
  setDuration: (duration: SaleDuration) => void;
  setPrice: (listing: PartialDeep<StagedListing>, price: BigNumberish, targetProtocol?: ExternalProtocol) => void;
  setCurrency: (listing: PartialDeep<StagedListing>, currency: SupportedCurrency, targetProtocol?: ExternalProtocol) => void;
  removeListing: (nft: PartialDeep<Nft>) => void;
  approveCollection: (listing: PartialDeep<StagedListing>, target: ExternalProtocol) => Promise<boolean>;
  allListingsConfigured: () => boolean;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  stageListing: () => null,
  stageListings: () => null,
  clear: () => null,
  listAll: () => null,
  prepareListings: () => null,
  submitting: false,
  toggleCartSidebar: () => null,
  toggleTargetMarketplace: () => null,
  setDuration: () => null,
  setPrice: () => null,
  setCurrency: () => null,
  removeListing: () => null,
  approveCollection: () => null,
  allListingsConfigured: () => false,
});

/**
 * This context provides state management and helper functions for the NFT listings cart.
 */
export function NFTListingsContextProvider(
  props: PropsWithChildren<any>
) {
  const [toList, setToList] = useState<Array<StagedListing>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { toBuy } = useContext(NFTPurchasesContext);

  const { data: supportedCurrencyData } = useSupportedCurrencies();

  useEffect(() => {
    if (window != null) {
      const initialValue = JSON.parse(localStorage.getItem('stagedNftListings')) ?? [];
      setToList(initialValue);
    }
  }, []);

  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [selectedTab, setSelectedTab] = useState<CartSidebarTab>('Buy');

  const signOrderForLooksrare = useSignLooksrareOrder();
  const looksrareRoyaltyFeeRegistry = useLooksrareRoyaltyFeeRegistryContractContract(provider);
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const seaportCounter = useSeaportCounter(currentAddress);
  const signOrderForSeaport = useSignSeaportOrder();
  const { listNftSeaport, listNftLooksrare } = useListNFTMutations();

  const stageListing = useCallback((
    listing: StagedListing
  ) => {
    if (toList.find(l => l.nft.id === listing.nft.id)) {
      setSidebarVisible(true);
      return;
    }
    setToList([...toList, listing]);
    localStorage.setItem('stagedNftListings', JSON.stringify(filterNulls([...toList, listing])));
  }, [toList]);

  const stageListings = useCallback((
    listings: StagedListing[]
  ) => {
    const filterListings = listings?.filter(a => !toList?.some(b => b.nft.id === a.nft.id));
    setToList([...toList, ...filterListings]);
    
    localStorage.setItem('stagedNftListings', JSON.stringify(filterNulls([...toList, ...listings])));
  }, [toList]);

  const clear = useCallback(() => {
    setToList([]);
    localStorage.setItem('stagedNftListings', null);
  }, []);
  
  const toggleCartSidebar = useCallback((selectedTab?: 'Buy' | 'Sell') => {
    setSidebarVisible(!sidebarVisible);
    setSelectedTab(selectedTab ?? (toBuy?.length > 0 ? 'Buy' : 'Sell'));
  }, [sidebarVisible, toBuy]);

  const allListingsConfigured = useCallback(() => {
    const unconfiguredNft = toList.find((stagedNft: StagedListing) => {
      const unconfiguredTarget = stagedNft.targets.find((target: ListingTarget) => {
        return target.startingPrice == null || BigNumber.from(target.startingPrice).eq(0) ||
          target.duration == null ||
          isNullOrEmpty(target.currency);
      });
      const hasFallbackConfig = stagedNft.startingPrice != null &&
        !BigNumber.from(stagedNft.startingPrice).eq(0) &&
        stagedNft.duration != null &&
        !isNullOrEmpty(stagedNft.currency);
      return (unconfiguredTarget != null && !hasFallbackConfig) || stagedNft.nft == null || isNullOrEmpty(stagedNft.targets);
    });
    return unconfiguredNft == null;
  }, [toList]);

  const toggleTargetMarketplace = useCallback((targetMarketplace: ExternalProtocol, toggleListing?: PartialDeep<StagedListing>) => {
    const targetFullyEnabled = toList.find(nft => {
      const hasTarget = nft.targets?.find(target => target.protocol === targetMarketplace) != null;
      return !hasTarget; // return true if missing the desired target.
    }) == null; // target is fully enabled if we didn't find an NFT that was missing it.
    if (toggleListing) {
      // toggle the marketplace for a specific listing.
      setToList(toList.slice().map(stagedNft => {
        if (toggleListing?.nft?.id === stagedNft?.nft?.id) {
          return {
            ...stagedNft,
            targets: stagedNft.targets.find(target => target.protocol === targetMarketplace) != null ?
              stagedNft.targets.filter(target => target.protocol !== targetMarketplace) :
              [...stagedNft.targets, { protocol: targetMarketplace }]
          };
        }
        return stagedNft;
      }));
    } else if (targetFullyEnabled) {
      // removing the target marketplace from all nfts
      setToList(toList.slice().map(stagedNft => {
        return {
          ...stagedNft,
          targets: stagedNft.targets?.filter(t => t.protocol !== targetMarketplace) ?? [],
        };
      }));
    } else {
      // adding a new marketplace to any nft that doesn't have it.
      setToList(toList.slice().map(stagedNft => {
        return {
          ...stagedNft,
          targets: stagedNft.targets?.find(target => target.protocol === targetMarketplace) != null ?
            stagedNft.targets :
            [...stagedNft.targets ?? [], { protocol: targetMarketplace }],
        };
      }));
    }
  }, [toList]);

  const setDuration = useCallback((duration: SaleDuration) => {
    setToList(toList.slice().map(stagedNft => {
      return {
        ...stagedNft,
        duration: convertDurationToSec(duration),
        targets: stagedNft.targets.slice().map(target => {
          return {
            ...target,
            duration: convertDurationToSec(duration),
          };
        })
      };
    }));
  }, [toList]);

  const setPrice = useCallback((listing: PartialDeep<StagedListing>, price: BigNumberish, targetProtocol?: ExternalProtocol) => {
    setToList(toList.slice().map(stagedNft => {
      if (listing?.nft?.id === stagedNft.nft?.id) {
        return {
          ...stagedNft,
          startingPrice: targetProtocol == null ? price : null,
          currency: targetProtocol == null ? (stagedNft.currency ?? supportedCurrencyData['WETH'].contract) : null,
          targets: stagedNft.targets.slice().map(target => {
            if (targetProtocol == null) {
              return {
                ...target,
                startingPrice: price,
                currency: target.currency ?? supportedCurrencyData['WETH'].contract
              };
            } else if (targetProtocol === target.protocol) {
              return {
                ...target,
                startingPrice: price,
                currency: target.currency ?? supportedCurrencyData['WETH'].contract
              };
            } else {
              return target;
            }
          })
        };
      }
      return stagedNft;
    }));
  }, [supportedCurrencyData, toList]);

  const setCurrency = useCallback((
    listing: PartialDeep<StagedListing>,
    currency: SupportedCurrency,
    targetProtocol?: ExternalProtocol
  ) => {
    setToList(toList.slice().map(stagedNft => {
      if (listing?.nft?.id === stagedNft.nft?.id) {
        return {
          ...stagedNft,
          currency: targetProtocol == null ? supportedCurrencyData['WETH'].contract : null,
          targets: stagedNft.targets.slice().map(target => {
            if (targetProtocol == null) {
              return {
                ...target,
                currency: supportedCurrencyData['WETH'].contract
              };
            } else if (targetProtocol === target.protocol) {
              return {
                ...target,
                currency: supportedCurrencyData[currency].contract
              };
            } else {
              return target;
            }
          })
        };
      }
      return stagedNft;
    }));
  }, [supportedCurrencyData, toList]);

  const prepareListings = useCallback(async () => {
    let nonce: number = await getLooksrareNonce(currentAddress);
    const preparedListings = await Promise.all(toList.map(async (stagedNft) => {
      const preparedTargets: ListingTarget[] = await Promise.all(stagedNft.targets?.map(async (target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          const order: MakerOrder = await createLooksrareParametersForNFTListing(
            currentAddress, // offerer
            stagedNft.nft,
            target.startingPrice ?? stagedNft.startingPrice,
            target.currency ?? stagedNft.currency,
            Number(defaultChainId),
            nonce,
            looksrareStrategy,
            looksrareRoyaltyFeeRegistry,
            target.duration ?? stagedNft.duration,
            // listing.takerAddress
          );
          nonce++;
          return {
            ...target,
            looksrareOrder: order,
          };
        } else {
          const contract = await getOpenseaCollection(stagedNft?.nft?.contract);
          const collectionFee: Fee = contract?.['payout_address'] && contract?.['dev_seller_fee_basis_points']
            ? {
              recipient: contract?.['payout_address'],
              basisPoints: contract?.['dev_seller_fee_basis_points'],
            }
            : null;
          const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
            currentAddress,
            stagedNft.nft,
            target.startingPrice ?? stagedNft.startingPrice,
            (target.endingPrice ?? stagedNft.endingPrice) ?? (target.startingPrice ?? stagedNft.startingPrice),
            target.currency ?? stagedNft.currency,
            target.duration ?? stagedNft.duration,
            collectionFee,
            defaultChainId,
            // listing.takerAddress
          );
          return {
            ...target,
            seaportParameters: parameters,
          };
        }
      }));
      return {
        ...stagedNft,
        targets: preparedTargets
      };
    }));
    setToList(preparedListings);
  }, [defaultChainId, currentAddress, looksrareRoyaltyFeeRegistry, looksrareStrategy, toList]);

  const listAll = useCallback(async () => {
    setSubmitting(true);
    const results = await Promise.all(toList.map(async (listing: StagedListing) => {
      const results = await Promise.all(listing.targets?.map(async (target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          const signature = await signOrderForLooksrare(target.looksrareOrder).catch(() => null);
          if (signature == null) {
            return false;
          }
          const result = await listNftLooksrare({ ...target.looksrareOrder, signature });
          return result;
        } else {
          const signature = await signOrderForSeaport(target.seaportParameters, seaportCounter).catch(() => null);
          if (signature == null) {
            return false;
          }
          const result = await listNftSeaport(signature , { ...target.seaportParameters, counter: seaportCounter });
          return result;
        }
      }));
      return results.every(r => r);
    }));
    setSubmitting(false);
    return results.every(r => r);
  }, [listNftSeaport, listNftLooksrare, seaportCounter, signOrderForLooksrare, signOrderForSeaport, toList]);

  const removeListing = useCallback((nft: PartialDeep<Nft>) => {
    const newToList = toList.slice().filter(l => l.nft?.id !== nft?.id);
    setToList(newToList);
    localStorage.setItem('stagedNftListings', JSON.stringify(newToList));
  }, [toList]);

  const approveCollection = useCallback(async (listing: StagedListing, target: ExternalProtocol) => {
    const collection = get721Contract(listing?.nft?.contract, provider);
    if (collection == null) {
      return false;
    }
    const tx = await collection
      .connect(signer)
      .setApprovalForAll(target === ExternalProtocol.LooksRare ? TransferProxyTarget.LooksRare : TransferProxyTarget.Opensea, true);
    if (tx) {
      return await tx.wait(1).then(() => {
        const newToList = toList.slice().map(l => {
          if (listing?.nft?.id === l.nft?.id) {
            return {
              ...listing,
              ...(target === ExternalProtocol.LooksRare ? { isApprovedForLooksrare: true } : {}),
              ...(target === ExternalProtocol.Seaport ? { isApprovedForSeaport: true } : {}),
            };
          }
          return l;
        });
        setToList(newToList);
        localStorage.setItem('stagedNftListings', JSON.stringify(newToList));
        return true;
      });
    }
    return false;
  }, [provider, signer, toList]);

  return <NFTListingsContext.Provider value={{
    approveCollection,
    removeListing,
    toList,
    stageListing,
    stageListings,
    clear,
    listAll,
    prepareListings,
    submitting,
    toggleCartSidebar,
    toggleTargetMarketplace,
    setDuration,
    setPrice,
    setCurrency,
    allListingsConfigured
  }}>

    {
      [...(toList ?? []), ...(toBuy ?? [])].length > 0 &&
      sidebarVisible &&
      <NFTCartSidebar selectedTab={selectedTab} onChangeTab={setSelectedTab} />
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
