import { Nft } from 'graphql/generated/types';
import { useListNFTMutations } from 'graphql/hooks/useListNFTMutation';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { Fee, SeaportOrderParameters } from 'types';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls, getChainIdString } from 'utils/helpers';
import { getLooksrareNonce, getOpenseaCollection } from 'utils/listings';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';

import { NFTListingsCartSidebar } from './NFTListingsCartSidebar';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumberish } from 'ethers';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export type TargetMarketplace = 'looksrare' | 'seaport';

export type StagedListing = {
  // this is the minimum required field
  nft: PartialDeep<Nft>;
  // these are set in configuration page
  targets: TargetMarketplace[],
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // these are set when finalizing, before triggering the wallet requests
  looksrareOrder: MakerOrder; // looksrare
  seaportParameters: SeaportOrderParameters; // seaport
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: PartialDeep<StagedListing>) => void;
  clear: () => void;
  listAll: () => void;
  prepareListings: () => void;
  submitting: boolean;
  toggleCartSidebar: () => void;
  toggleTargetMarketplace: (marketplace: TargetMarketplace) => void;
  setDuration: (duration: SaleDuration) => void;
  setPrice: (listing: PartialDeep<StagedListing>, price: BigNumberish) => void;
  removeListing: (nft: PartialDeep<Nft>) => void;
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

  const { data: supportedCurrencyData } = useSupportedCurrencies();

  useEffect(() => {
    if (window != null) {
      setToList(JSON.parse(localStorage.getItem('stagedNftListings')) ?? []);
    }
  }, []);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

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

  const toggleCartSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible);
  }, [sidebarVisible]);

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
    await Promise.all(toList.map(async (listing: StagedListing) => {
      await Promise.all(listing.targets?.map(async (target: TargetMarketplace) => {
        if (target === 'looksrare') {
          const signature = await signOrderForLooksrare(listing.looksrareOrder);
          await listNftLooksrare({ ...listing.looksrareOrder, signature });
          // todo: check success/failure and maybe mutate external listings query.
        } else {
          const signature = await signOrderForSeaport(listing.seaportParameters, seaportCounter);
          await listNftSeaport(signature , { ...listing.seaportParameters, counter: seaportCounter });
          // todo: check success/failure and maybe mutate external listings query.
          localStorage.setItem('stagedNftListings', null);
        }
      }));
    }));
    setSubmitting(false);
    clear();
  }, [
    listNftSeaport,
    listNftLooksrare,
    seaportCounter,
    signOrderForLooksrare,
    signOrderForSeaport,
    toList,
    clear
  ]);

  const removeListing = useCallback((nft: PartialDeep<Nft>) => {
    const newToList = toList.slice().filter(l => l.nft?.id !== nft?.id);
    setToList(newToList);
    localStorage.setItem('stagedNftListings', JSON.stringify(newToList));
  }, [toList]);
  
  return <NFTListingsContext.Provider value={{
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
      toList.length > 0 &&
      sidebarVisible &&
      <NFTListingsCartSidebar />
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
