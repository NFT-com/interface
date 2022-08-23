import { Nft } from 'graphql/generated/types';
import { useListNFTMutations } from 'graphql/hooks/useListNFTMutation';
import { TransferProxyTarget } from 'hooks/balances/useNftCollectionAllowance';
import { get721Contract } from 'hooks/contracts/get721Contract';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { Fee, SeaportOrderParameters } from 'types';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls, getChainIdString } from 'utils/helpers';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { getLooksrareNonce, getOpenseaCollection } from 'utils/marketplaceHelpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';

import { CartSidebarTab, NFTCartSidebar } from './NFTCartSidebar';
import { NFTPurchasesContext } from './NFTPurchaseContext';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumberish } from 'ethers';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

export type TargetMarketplace = 'looksrare' | 'seaport';

export type StagedListing = {
  // this is the minimum required field
  nft: PartialDeep<Nft>;
  collectionName: string;
  // these are set in configuration page
  targets: TargetMarketplace[],
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // these are set when finalizing, before triggering the wallet requests
  looksrareOrder: MakerOrder; // looksrare
  seaportParameters: SeaportOrderParameters; // seaport
  // approval-related data
  isApprovedForSeaport: boolean;
  isApprovedForLooksrare: boolean;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: PartialDeep<StagedListing>) => void;
  clear: () => void;
  listAll: () => Promise<boolean>;
  prepareListings: () => Promise<void>;
  
  submitting: boolean;
  toggleCartSidebar: (selectedTab?: CartSidebarTab) => void;
  toggleTargetMarketplace: (marketplace: TargetMarketplace) => void;
  setDuration: (duration: SaleDuration) => void;
  setPrice: (listing: PartialDeep<StagedListing>, price: BigNumberish) => void;
  removeListing: (nft: PartialDeep<Nft>) => void;
  approveCollection: (listing: PartialDeep<StagedListing>, target: TargetMarketplace) => Promise<boolean>;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  stageListing: () => null,
  clear: () => null,
  listAll: () => null,
  prepareListings: () => null,
  submitting: false,
  toggleCartSidebar: () => null,
  toggleTargetMarketplace: () => null,
  setDuration: () => null,
  setPrice: () => null,
  removeListing: () => null,
  approveCollection: () => null,
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
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [selectedTab, setSelectedTab] = useState<CartSidebarTab>('buy');

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

  const clear = useCallback(() => {
    setToList([]);
    localStorage.setItem('stagedNftListings', null);
  }, []);
  
  const toggleCartSidebar = useCallback((selectedTab?: 'buy' | 'sell') => {
    setSidebarVisible(!sidebarVisible);
    setSelectedTab(selectedTab ?? (toBuy?.length > 0 ? 'buy' : 'sell'));
  }, [sidebarVisible, toBuy]);

  const toggleTargetMarketplace = useCallback((targetMarketplace: TargetMarketplace) => {
    const targetFullyEnabled = toList.find(listing => listing.targets?.includes(targetMarketplace)) != null;
    if (targetFullyEnabled) {
      // removing the target marketplace from all nfts
      setToList(toList.slice().map(listing => {
        return {
          ...listing,
          targets: listing.targets?.filter(t => t !== targetMarketplace) ?? [],
        };
      }));
    } else {
      // adding a new marketplace to any nft that doesn't have it.
      setToList(toList.slice().map(listing => {
        return {
          ...listing,
          targets: listing.targets?.includes(targetMarketplace) ? listing.targets : [...listing.targets ?? [], targetMarketplace],
        };
      }));
    }
  }, [toList]);

  const setDuration = useCallback((duration: SaleDuration) => {
    setToList(toList.slice().map(listing => {
      return {
        ...listing,
        duration: convertDurationToSec(duration),
      };
    }));
  }, [toList]);

  const setPrice = useCallback((listing: PartialDeep<StagedListing>, price: BigNumberish) => {
    setToList(toList.slice().map(l => {
      if (listing?.nft?.id === l.nft?.id) {
        return {
          ...l,
          startingPrice: price,
          currency: supportedCurrencyData['WETH'].contract
        };
      }
      return l;
    }));
  }, [supportedCurrencyData, toList]);

  const prepareListings = useCallback(async () => {
    let nonce: number = await getLooksrareNonce(currentAddress);
    const preparedListings = await Promise.all(toList.map(async (listing) => {
      const listingsPerMarketplace: StagedListing[] = await Promise.all(listing.targets?.map(async (target: TargetMarketplace) => {
        if (target === 'looksrare') {
          const order: MakerOrder = await createLooksrareParametersForNFTListing(
            currentAddress, // offerer
            listing.nft,
            listing.startingPrice,
            listing.currency,
            chain?.id,
            nonce,
            looksrareStrategy,
            looksrareRoyaltyFeeRegistry,
            listing.duration,
            // listing.takerAddress
          );
          nonce++;
          return {
            ...listing,
            looksrareOrder: order,
          };
        } else {
          const contract = await getOpenseaCollection(listing?.nft?.contract);
          const collectionFee: Fee = contract?.['payout_address'] && contract?.['dev_seller_fee_basis_points']
            ? {
              recipient: contract?.['payout_address'],
              basisPoints: contract?.['dev_seller_fee_basis_points'],
            }
            : null;
          const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
            currentAddress,
            listing.nft,
            listing.startingPrice,
            listing.endingPrice ?? listing.startingPrice,
            listing.currency,
            listing.duration,
            collectionFee,
            getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
            // listing.takerAddress
          );
          return {
            ...listing,
            seaportParameters: parameters,
          };
        }
      }));
      return listingsPerMarketplace.reduce((acc, curr) => ({ ...acc, ...curr }), listing);
    }));
    setToList(preparedListings);
  }, [chain?.id, currentAddress, looksrareRoyaltyFeeRegistry, looksrareStrategy, toList]);

  const listAll = useCallback(async () => {
    setSubmitting(true);
    const results = await Promise.all(toList.map(async (listing: StagedListing) => {
      const results = await Promise.all(listing.targets?.map(async (target: TargetMarketplace) => {
        if (target === 'looksrare') {
          const signature = await signOrderForLooksrare(listing.looksrareOrder).catch(() => null);
          if (signature == null) {
            return false;
          }
          const result = await listNftLooksrare({ ...listing.looksrareOrder, signature });
          return result;
        } else {
          const signature = await signOrderForSeaport(listing.seaportParameters, seaportCounter).catch(() => null);
          if (signature == null) {
            return false;
          }
          const result = await listNftSeaport(signature , { ...listing.seaportParameters, counter: seaportCounter });
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

  const approveCollection = useCallback(async (listing: StagedListing, target: TargetMarketplace) => {
    const collection = get721Contract(listing?.nft?.contract, provider);
    if (collection == null) {
      return false;
    }
    const tx = await collection
      .connect(signer)
      .setApprovalForAll(target === 'looksrare' ? TransferProxyTarget.LooksRare : TransferProxyTarget.Opensea, true);
    if (tx) {
      return await tx.wait(1).then(() => {
        const newToList = toList.slice().map(l => {
          if (listing?.nft?.id === l.nft?.id) {
            return {
              ...listing,
              ...(target === 'looksrare' ? { isApprovedForLooksrare: true } : {}),
              ...(target === 'seaport' ? { isApprovedForSeaport: true } : {}),
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
    clear,
    listAll,
    prepareListings,
    submitting,
    toggleCartSidebar,
    toggleTargetMarketplace,
    setDuration,
    setPrice
  }}>

    {
      [...(toList ?? []), ...(toBuy ?? [])].length > 0 &&
      sidebarVisible &&
      <NFTCartSidebar selectedTab={selectedTab} onChangeTab={setSelectedTab} />
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
