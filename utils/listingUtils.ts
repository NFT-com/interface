import { NULL_ADDRESS } from 'constants/addresses';
import { LooksrareProtocolData, SeaportProtocolData, TxActivity } from 'graphql/generated/types';
import { ExternalProtocol } from 'types';

import { sameAddress } from './helpers';
import { getAddress } from './httpHooks';

import { BigNumber, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export const getListingPrice = (listing: PartialDeep<TxActivity>) => {
  switch(listing?.order?.protocol) {
  case (ExternalProtocol.LooksRare): {
    const order = listing?.order?.protocolData as LooksrareProtocolData;
    return BigNumber.from(order?.price ?? 0);
  }
  case (ExternalProtocol.Seaport): {
    const order = listing?.order?.protocolData as SeaportProtocolData;
    return order?.parameters?.consideration
      ?.reduce((total, consideration) => total.add(BigNumber.from(consideration?.startAmount ?? 0)), BigNumber.from(0));
  }
  }
};

export const getListingPriceUSD: (
  listing: PartialDeep<TxActivity>,
  ethPriceUSD: number,
  chainId: string | number
) => number = (
  listing: PartialDeep<TxActivity>,
  ethPriceUSD: number,
  chainId: string | number
) => {
  const currency = getListingCurrencyAddress(listing);
  if (sameAddress(currency, getAddress('dai', chainId)) || sameAddress(currency, getAddress('usdc', chainId))) {
    return Number(ethers.utils.formatUnits(getListingPrice(listing), 18));
  } else if (sameAddress(NULL_ADDRESS, currency) || sameAddress(currency, getAddress('weth', chainId))) {
    return Number(ethers.utils.formatUnits(getListingPrice(listing), 18)) * ethPriceUSD;
  }
  return 0;
};

export const getListingCurrencyAddress = (listing: PartialDeep<TxActivity>) => {
  switch(listing?.order?.protocol) {
  case (ExternalProtocol.LooksRare): {
    const order = listing?.order?.protocolData as LooksrareProtocolData;
    return order?.currencyAddress ?? order?.['currency'];
  }
  case (ExternalProtocol.Seaport): {
    const order = listing?.order?.protocolData as SeaportProtocolData;
    return order?.parameters?.consideration?.[0]?.token;
  }
  }
};

export const getLowestPriceListing = (
  listings: PartialDeep<TxActivity>[],
  ethPriceUSD: number,
  chainId: number | string,
  protocolFilter?: ExternalProtocol
) => {
  const filteredListings = listings.filter(l => protocolFilter == null || l.order?.protocol === protocolFilter);
  let lowestPriceListing = filteredListings[0];
  const lowestPriceUSD = getListingPriceUSD(filteredListings[0], ethPriceUSD, chainId);
  for (let i = 1; i < filteredListings.length; i++) {
    if (getListingPriceUSD(filteredListings[i], ethPriceUSD, chainId) < lowestPriceUSD) {
      lowestPriceListing = filteredListings[i];
    }
  }
  return lowestPriceListing;
};