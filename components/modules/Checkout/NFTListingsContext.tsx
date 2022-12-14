import { Maybe, Nft, NftType } from 'graphql/generated/types';
import { useListNFTMutations } from 'graphql/hooks/useListNFTMutation';
import { TransferProxyTarget } from 'hooks/balances/useNftCollectionAllowance';
import { get721Contract } from 'hooks/contracts/get721Contract';
import { useLooksrareRoyaltyFeeManagerContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeManagerContract';
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
import { createX2Y2ParametersForNFTListing } from 'utils/X2Y2Helpers';

import { CartSidebarTab, NFTCartSidebar } from './NFTCartSidebar';
import { NFTPurchasesContext } from './NFTPurchaseContext';

import { MakerOrder } from '@looksrare/sdk';
import { X2Y2Order } from '@x2y2-io/sdk/dist/types';
import { BigNumber, BigNumberish } from 'ethers';
import moment from 'moment';
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
  X2Y2Order: X2Y2Order; // X2Y2
}

export type StagedListing = {
  // these are the minimum required fields to add to the staging cart
  nft: PartialDeep<Nft>;
  collectionName: string;
  // these are set in configuration page
  targets: PartialDeep<ListingTarget>[],
  // top-level configs which will apply to all targets, if it exists.
  // if it doesn't, then each target must have a configuration for the listing to be valid.
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // approval-related data
  isApprovedForSeaport: boolean;
  isApprovedForLooksrare: boolean;
  isApprovedForX2Y2: boolean;
}

export enum ListAllResult {
  Success = 0,
  SignatureRejected = 1,
  ApiError = 2,
}

export interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: PartialDeep<StagedListing>) => void;
  stageListings: (listings: PartialDeep<StagedListing[]>) => void;
  clear: () => void;
  listAll: () => Promise<ListAllResult>;
  prepareListings: (nonceOverride?: number) => Promise<void>;
  
  submitting: boolean;
  toggleCartSidebar: (selectedTab?: CartSidebarTab) => void;
  toggleTargetMarketplace: (marketplace: ExternalProtocol, listing?: PartialDeep<StagedListing>) => void;
  setDuration: (duration: SaleDuration) => void;
  setPrice: (listing: PartialDeep<StagedListing>, price: BigNumberish, targetProtocol?: ExternalProtocol) => void;
  setCurrency: (listing: PartialDeep<StagedListing>, currency: SupportedCurrency, targetProtocol?: ExternalProtocol) => void;
  removeListing: (nft: PartialDeep<Nft>) => void;
  approveCollection: (listing: PartialDeep<StagedListing>, target: ExternalProtocol) => Promise<boolean>;
  allListingsConfigured: () => boolean;
  clearGeneralConfig: (listing: PartialDeep<StagedListing>) => void;
  getTarget: (listing: PartialDeep<StagedListing>, protocol: ExternalProtocol) => Maybe<PartialDeep<ListingTarget>>;
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
  clearGeneralConfig: () => null,
  getTarget: () => null
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
  const looksrareRoyaltyFeeManager = useLooksrareRoyaltyFeeManagerContractContract(provider);

  const seaportCounter = useSeaportCounter(currentAddress);
  const signOrderForSeaport = useSignSeaportOrder();
  const { listNftSeaport, listNftLooksrare, listNftX2Y2 } = useListNFTMutations();

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
      if (stagedNft?.nft == null || isNullOrEmpty(stagedNft?.targets)) {
        return true; // no targets or NFT to list?
      }
      const hasGeneralConfig = stagedNft.startingPrice != null &&
        !BigNumber.from(stagedNft.startingPrice).eq(0) &&
        stagedNft.duration != null &&
        !isNullOrEmpty(stagedNft.currency);
      if (hasGeneralConfig) {
        return false; // this listing is valid.
      }
      const unconfiguredTarget = stagedNft.targets.find((target: ListingTarget) => {
        return target.startingPrice == null || BigNumber.from(target.startingPrice).eq(0) ||
          (target.duration ?? stagedNft.duration) == null ||
          isNullOrEmpty(target.currency);
      });
      // At this point, we need all targets to have valid individual configurations.
      return unconfiguredTarget != null;
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
              [
                ...stagedNft.targets,
                {
                  protocol: targetMarketplace,
                  duration: stagedNft.duration ,
                  currency: stagedNft.currency ?? targetMarketplace === ExternalProtocol.X2Y2 ? supportedCurrencyData['ETH'].contract : supportedCurrencyData['WETH'].contract
                }
              ]
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
            [
              ...stagedNft.targets ?? [],
              {
                protocol: targetMarketplace,
                duration: stagedNft.duration ,
                currency: stagedNft.currency ?? targetMarketplace === ExternalProtocol.X2Y2 ? supportedCurrencyData['ETH'].contract : supportedCurrencyData['WETH'].contract
              }
            ],
        };
      }));
    }
  }, [supportedCurrencyData, toList]);

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

  const setPrice = useCallback((
    listing: PartialDeep<StagedListing>,
    price: Maybe<BigNumberish>,
    targetProtocol?: ExternalProtocol
  ) => {
    setToList(toList.slice().map(stagedNft => {
      if (listing?.nft?.id === stagedNft.nft?.id) {
        return {
          ...stagedNft,
          startingPrice: targetProtocol == null ? price : stagedNft.startingPrice,
          currency: targetProtocol == null ? (stagedNft.currency ?? supportedCurrencyData['WETH'].contract) : null,
          targets: stagedNft.targets.slice().map(target => {
            if (targetProtocol === target.protocol) {
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
          currency: targetProtocol == null ? supportedCurrencyData[currency].contract : null,
          targets: stagedNft.targets.slice().map(target => {
            if (targetProtocol === target.protocol) {
              return {
                ...target,
                currency: supportedCurrencyData[currency].contract,
              };
            } else {
              return {
                ...target,
                currency: target.currency ?? supportedCurrencyData['WETH'].contract
              };
            }
          })
        };
      }
      return stagedNft;
    }));
  }, [supportedCurrencyData, toList]);

  const clearGeneralConfig = useCallback((
    listing: PartialDeep<StagedListing>,
  ) => {
    setToList(toList.slice().map(stagedNft => {
      if (listing?.nft?.id === stagedNft?.nft?.id) {
        return {
          ...stagedNft,
          startingPrice: null,
          currency: null,
        };
      }
      return stagedNft;
    }));
  }, [toList]);

  const getTarget = useCallback((listing: PartialDeep<StagedListing>, protocol: ExternalProtocol) => {
    return toList?.find(l => l.nft.id === listing.nft.id)?.targets?.find(target => target.protocol === protocol);
  }, [toList]);

  const prepareListings = useCallback(async (nonceOverride?: number) => {
    let nonce: number = nonceOverride;
    if (nonce == null) {
      nonce = await getLooksrareNonce(currentAddress);
    }
    const preparedListings = await Promise.all(toList.map(async (stagedNft) => {
      const preparedTargets: ListingTarget[] = await Promise.all(stagedNft.targets?.map(async (target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          const order: MakerOrder = await createLooksrareParametersForNFTListing(
            currentAddress, // offerer
            stagedNft.nft,
            stagedNft.startingPrice ?? target.startingPrice,
            supportedCurrencyData['WETH'].contract,
            Number(defaultChainId),
            nonce,
            looksrareStrategy,
            looksrareRoyaltyFeeRegistry,
            target.duration ?? stagedNft.duration,
            looksrareRoyaltyFeeManager
            // listing.takerAddress
          );
          nonce++;
          return {
            ...target,
            looksrareOrder: order,
          };
        } else if (target.protocol === ExternalProtocol.X2Y2) {
          return target;
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
            stagedNft.startingPrice ?? target.startingPrice,
            (stagedNft?.endingPrice ?? target.endingPrice) ?? (stagedNft.startingPrice ?? target.startingPrice),
            stagedNft.currency ?? target.currency,
            stagedNft.duration ?? target.duration,
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
  }, [toList, currentAddress, supportedCurrencyData, defaultChainId, looksrareStrategy, looksrareRoyaltyFeeRegistry, looksrareRoyaltyFeeManager]);

  const listAll: () => Promise<ListAllResult> = useCallback(async () => {
    setSubmitting(true);
    const results = await Promise.all(toList.map(async (listing: StagedListing) => {
      const results = await Promise.all(listing.targets?.map(async (target: ListingTarget) => {
        if (target.protocol === ExternalProtocol.LooksRare) {
          const signature = await signOrderForLooksrare(target.looksrareOrder).catch(() => null);
          if (isNullOrEmpty(signature)) {
            return ListAllResult.SignatureRejected;
          }
          const result = await listNftLooksrare({ ...target.looksrareOrder, signature });
          if (!result) {
            return ListAllResult.ApiError;
          }
          return ListAllResult.Success;
        } else if (target.protocol === ExternalProtocol.X2Y2) {
          const order: X2Y2Order = await createX2Y2ParametersForNFTListing(
            'mainnet',
            signer,
            listing.nft.contract,
            listing.nft.tokenId,
            listing.nft.type === NftType.Erc1155 ? 'erc1155' : 'erc721',
            listing.startingPrice.toString() ?? target.startingPrice.toString(),
            moment().unix() + Number(listing.duration) ?? moment().unix() + Number(target.duration)
          );
          if (!order) {
            return ListAllResult.SignatureRejected;
          }
          const result = await listNftX2Y2(
            { ...order },
            listing.nft.tokenId,
            listing.nft.contract,
            currentAddress
          );
          if (!result) {
            return ListAllResult.ApiError;
          }
          return ListAllResult.Success;
        } else {
          const signature = await signOrderForSeaport(target.seaportParameters, seaportCounter).catch(() => null);
          if (isNullOrEmpty(signature)) {
            return ListAllResult.SignatureRejected;
          }
          const result = await listNftSeaport(signature , { ...target.seaportParameters, counter: seaportCounter });
          if (!result) {
            return ListAllResult.ApiError;
          }
          return ListAllResult.Success;
        }
      }));
      return results.includes(ListAllResult.SignatureRejected) ?
        ListAllResult.SignatureRejected :
        results.includes(ListAllResult.ApiError) ?
          ListAllResult.ApiError :
          ListAllResult.Success;
    }));
    setSubmitting(false);
    return results.includes(ListAllResult.SignatureRejected) ?
      ListAllResult.SignatureRejected :
      results.includes(ListAllResult.ApiError) ?
        ListAllResult.ApiError :
        ListAllResult.Success;
  }, [toList, signOrderForLooksrare, listNftLooksrare, signer, listNftX2Y2, currentAddress, signOrderForSeaport, seaportCounter, listNftSeaport]);

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
      .setApprovalForAll(target === ExternalProtocol.LooksRare ? TransferProxyTarget.LooksRare : target === ExternalProtocol.X2Y2 ? TransferProxyTarget.X2Y2 : TransferProxyTarget.Opensea, true);
    if (tx) {
      return await tx.wait(1).then(() => {
        const newToList = toList.slice().map(l => {
          if (listing?.nft?.id === l.nft?.id) {
            return {
              ...listing,
              ...(target === ExternalProtocol.LooksRare ? { isApprovedForLooksrare: true } : {}),
              ...(target === ExternalProtocol.Seaport ? { isApprovedForSeaport: true } : {}),
              ...(target === ExternalProtocol.X2Y2 ? { isApprovedForX2Y2: true } : {}),
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
    allListingsConfigured,
    clearGeneralConfig,
    getTarget
  }}>

    {
      sidebarVisible &&
      <NFTCartSidebar selectedTab={selectedTab} onChangeTab={setSelectedTab} />
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
