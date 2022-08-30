import { LooksrareProtocolData, SeaportProtocolData, TxActivity } from 'graphql/generated/types';
import { ExternalProtocol } from 'types';

import { BigNumber } from 'ethers';
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

export const getListingPriceUSD = (listing: PartialDeep<TxActivity>, ethPriceUSD: number) => {
  // todo
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
  ethPriceUSD: number
) => {
  let lowestPriceListing = listings[0];
  const lowestPriceUSD = getListingPriceUSD(listings[0], ethPriceUSD);
  for (let i = 1; i < listings.length; i++) {
    if (getListingPriceUSD(listings[i], ethPriceUSD) < lowestPriceUSD) {
      lowestPriceListing = listings[i];
    }
  }
  return lowestPriceListing;
};