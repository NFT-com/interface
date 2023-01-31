import { ListingTarget, StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { StagedPurchase } from 'components/modules/Checkout/NFTPurchaseContext';
import { NULL_ADDRESS } from 'constants/addresses';
import { AuctionType, LooksrareProtocolData, NftcomProtocolData, SeaportProtocolData, TxActivity, X2Y2ProtocolData } from 'graphql/generated/types';
import { NFTSupportedCurrency } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';

import { filterDuplicates, sameAddress } from './helpers';
import { multiplyBasisPoints } from './seaportHelpers';

import { BigNumber, BigNumberish, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);
export type SaleDuration = '1 Hour' | '1 Day' | '7 Days' | '30 Days' | '60 Days' | '90 Days' | '180 Days' | '1 Year';

export const convertDurationToSec = (d: SaleDuration) => {
  const durationDays: {[s in SaleDuration]: number} = {
    '1 Hour': 1 / 24,
    '1 Day' : 1,
    '7 Days': 7,
    '30 Days': 30,
    '60 Days': 60,
    '90 Days': 3 * 30,
    '180 Days': 6 * 30,
    '1 Year': 7 * 4 * 12,
  };
  return 60 * 60 * 24 * durationDays[d];
};

export const convertDurationToSecForNumbersOnly = (d: number) => {
  return 60 * 60 * 24 * d;
};

export function needsApprovals(stagedPurchases: StagedPurchase[]): boolean {
  return filterDuplicates(
    stagedPurchases?.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
    (first, second) => first?.currency === second?.currency
  ).some(purchase => !purchase?.isApproved);
}

export function hasSufficientBalances(
  stagedPurchases: StagedPurchase[],
  balances: Map<string, BigNumberish>,
): boolean {
  const uniqueCurrencyPurchases = filterDuplicates(
    stagedPurchases,
    (first, second) => first?.currency === second?.currency
  );
  const remainingBalances = new Map<string, BigNumber>();
  for (let i = 0; i < uniqueCurrencyPurchases.length; i++) {
    const balance = balances.get(uniqueCurrencyPurchases[i]?.currency);
    remainingBalances.set(uniqueCurrencyPurchases[i]?.currency ?? 'unsupported', BigNumber.from(balance ?? 0));
  }
  for (let i = 0; i < stagedPurchases.length; i++) {
    const remainingBalance = remainingBalances.get(stagedPurchases[i].currency);
    const price = BigNumber.from(stagedPurchases[i].price);
    if (remainingBalance.lt(price)) {
      return false;
    }
    remainingBalances.set(stagedPurchases[i].currency, remainingBalance.sub(price));
  }
  return true;
}

export function getTotalFormattedPriceUSD(
  stagedPurchases: StagedPurchase[],
  getByContractAddress: (contract: string) => NFTSupportedCurrency
): string {
  return stagedPurchases?.reduce((acc, curr) => {
    const currencyData = getByContractAddress(curr.currency);
    const formattedPrice = Number(ethers.utils.formatUnits(curr.price, currencyData?.decimals ?? 18));
    return acc + currencyData?.usd(formattedPrice);
  }, 0).toFixed(2);
}

export function getTotalMarketplaceFeesUSD(
  stagedPurchases: StagedPurchase[],
  looksrareProtocolFeeBps: BigNumberish,
  getByContractAddress: (contract: string) => NFTSupportedCurrency
): number {
  return stagedPurchases?.reduce((cartTotal, stagedPurchase) => {
    if (stagedPurchase.protocol === ExternalProtocol.LooksRare) {
      const fee = BigNumber.from(
        looksrareProtocolFeeBps == null
          ? 0
          : multiplyBasisPoints(stagedPurchase?.price ?? 0, looksrareProtocolFeeBps)
      );
      const currencyData = getByContractAddress(stagedPurchase.currency);
      return cartTotal + currencyData?.usd(Number(ethers.utils.formatUnits(fee, currencyData?.decimals ?? 18)));
    } else {
      const fee = BigNumber.from(multiplyBasisPoints(stagedPurchase?.price ?? 0, 250));
      const currencyData = getByContractAddress(stagedPurchase.currency);
      return cartTotal + currencyData?.usd(Number(ethers.utils.formatUnits(fee, currencyData?.decimals ?? 18)));
    }
  }, 0);
}

export function getTotalRoyaltiesUSD(
  stagedPurchases: StagedPurchase[],
  looksrareProtocolFeeBps: BigNumberish,
  getByContractAddress: (contract: string) => NFTSupportedCurrency
): number {
  return stagedPurchases?.reduce((cartTotal, stagedPurchase) => {
    if (stagedPurchase.protocol === ExternalProtocol.LooksRare) {
      const protocolData = stagedPurchase?.protocolData as LooksrareProtocolData;
      const minAskAmount = BigNumber.from(protocolData?.minPercentageToAsk ?? 0)
        .mul(BigNumber.from(protocolData?.price ?? 0))
        .div(10000);
      const marketplaceFeeAmount = BigNumber.from(looksrareProtocolFeeBps ?? 0)
        .mul(BigNumber.from(protocolData?.price ?? 0))
        .div(10000);
      const royalty = minAskAmount.sub(marketplaceFeeAmount);
      const currencyData = getByContractAddress(stagedPurchase.currency);
      return cartTotal + currencyData?.usd(Number(ethers.utils.formatUnits(royalty, currencyData?.decimals ?? 18)));
    } else {
      const protocolData = stagedPurchase?.protocolData as SeaportProtocolData;
      const royalty = BigNumber.from(protocolData?.parameters?.consideration.length === 3 ?
        protocolData?.parameters?.consideration[2].startAmount :
        0);
      const currencyData = getByContractAddress(stagedPurchase.currency);
      return cartTotal + currencyData?.usd(Number(ethers.utils.formatUnits(royalty, currencyData?.decimals ?? 18)));
    }
  }, 0);
}

export function getMaxMarketplaceFeesUSD(
  stagedListings: StagedListing[],
  looksrareProtocolFeeBps: BigNumberish,
  getByContractAddress: (contract: string) => NFTSupportedCurrency,
  NFTCOMFee: number,
): number {
  return stagedListings?.reduce((cartTotal, stagedListing) => {
    const feesByMarketplace = stagedListing?.targets.map((target: ListingTarget) => {
      const currencyData = getByContractAddress(stagedListing.currency ?? target.currency);
      if (target.protocol === ExternalProtocol.LooksRare) {
        // Looksrare fee is fetched from the smart contract.
        const fee = BigNumber.from(looksrareProtocolFeeBps == null
          ? 0
          : multiplyBasisPoints((stagedListing.startingPrice ?? target?.startingPrice) ?? 0, looksrareProtocolFeeBps));
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          fee,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else if (target.protocol === ExternalProtocol.NFTCOM) {
        const fee = BigNumber.from(multiplyBasisPoints((stagedListing.startingPrice ?? target?.startingPrice) ?? 0, NFTCOMFee));
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          fee,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else {
        // Seaport fee is hard-coded in our codebase and not expected to change.
        const fee = BigNumber.from(multiplyBasisPoints((stagedListing.startingPrice ?? target?.startingPrice) ?? 0, 250));
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          fee,
          currencyData.decimals ?? 18
        ))) ?? 0;
      }
    });
    return cartTotal + Math.max(...feesByMarketplace || []);
  }, 0);
}

export function getMaxRoyaltyFeesUSD(
  stagedListings: StagedListing[],
  looksrareProtocolFeeBps: BigNumberish,
  getByContractAddress: (contract: string) => NFTSupportedCurrency,
  NFTCOMRoyaltyFees: [string, BigNumber] & { owner: string; percent: BigNumber; }
): number {
  return stagedListings?.reduce((cartTotal, stagedListing) => {
    const royaltiesByMarketplace = stagedListing?.targets.map((target: ListingTarget) => {
      const currencyData = getByContractAddress(stagedListing.currency ?? target.currency);
      if (target.protocol === ExternalProtocol.LooksRare) {
        const minAskAmount = BigNumber.from(target?.looksrareOrder?.minPercentageToAsk ?? 0)
          .div(10000)
          .mul(BigNumber.from(target?.looksrareOrder?.price ?? 0));
        const marketplaceFeeAmount = BigNumber.from(looksrareProtocolFeeBps ?? 0)
          .div(10000)
          .mul(BigNumber.from(target?.looksrareOrder?.price ?? 0));
        const royalty = minAskAmount.sub(marketplaceFeeAmount);
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          royalty,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else if (target.protocol === ExternalProtocol.Seaport) {
        const royalty = BigNumber.from(target?.seaportParameters?.consideration.length === 3 ?
          target?.seaportParameters?.consideration[2].startAmount :
          0);
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          royalty,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else if (target.protocol === ExternalProtocol.NFTCOM) {
        const royalty = Number(NFTCOMRoyaltyFees ? NFTCOMRoyaltyFees[1] : 0);
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          royalty,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else if (target.protocol === ExternalProtocol.X2Y2) {
        // TODO: lucas -> maybe re-use existing x2y2 order data, listingTarget -> x2y2 doesn't have royalty however
        const royalty = 0; // BigNumber.from(target?.X2Y2Order?.royalty_fee || 0);
        return currencyData?.usd(Number(ethers.utils.formatUnits(
          royalty,
          currencyData.decimals ?? 18
        ))) ?? 0;
      } else {
        // TODO: handle
      }
    });
    return cartTotal + Math.max(...royaltiesByMarketplace || []);
  }, 0);
}

export function filterValidListings(listings: PartialDeep<TxActivity>[]): PartialDeep<TxActivity>[] {
  return listings?.filter(listing => {
    const seaportValid = (listing.order?.protocolData as SeaportProtocolData)?.parameters &&
      (listing.order?.protocolData as SeaportProtocolData)?.signature != null && (listing.order?.protocolData as SeaportProtocolData)?.parameters?.consideration?.length;
    const looksrareValid = (listing.order?.protocolData as LooksrareProtocolData)?.price != null;
    const X2Y2Valid = (listing.order?.protocolData as X2Y2ProtocolData)?.price != null;
    const NFTCOMValid = (listing.order?.protocolData as NftcomProtocolData)?.takeAsset &&
    (listing.order?.protocolData as NftcomProtocolData)?.takeAsset[0]?.value != null;
    return listing.order?.protocolData != null && (looksrareValid || seaportValid || X2Y2Valid || NFTCOMValid);
  }) ?? [];
}

export function getProtocolDisplayName(protocolName: ExternalProtocol): string {
  if(protocolName === ExternalProtocol.NFTCOM){
    return 'NFT.com';
  }
  if(protocolName === ExternalProtocol.Seaport){
    return 'Opensea';
  }
  return protocolName;
}

export function getAuctionTypeDisplayName(auctionType: AuctionType): string {
  switch(auctionType) {
  case AuctionType.FixedPrice:
    return 'Fixed Price';
  case AuctionType.Decreasing:
    return 'Decreasing Price';
  case AuctionType.English:
    return 'English Auction';
  }
}