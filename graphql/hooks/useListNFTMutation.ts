import { NULL_ADDRESS } from 'constants/addresses';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft, Signature } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { SeaportOrderComponents } from 'types';
import { isNullOrEmpty } from 'utils/helpers';
import { getMarketplaceAssetInput, onchainAuctionTypeToGqlAuctionType, unhashedMakeAsset, unhashedTakeAsset, UnsignedOrder } from 'utils/nativeMarketplaceHelpers';
import { getOrderHash } from 'utils/signatureUtils';
import { encodeOrder } from 'utils/X2Y2Helpers';

import { MakerOrderWithSignature } from '@looksrare/sdk';
import * as Sentry from '@sentry/nextjs';
import { X2Y2Order } from '@x2y2-io/sdk/dist/types';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';

export interface ListNftResult {
  listNftSeaport: (
    signature: string,
    parameters: SeaportOrderComponents
  ) => Promise<boolean>,
  listNftLooksrare: (
    order: MakerOrderWithSignature
  ) => Promise<boolean>,
  listNftX2Y2: (
    order: X2Y2Order,
    tokenId: string,
    contract: string,
    maker: string,
    hasOpenOrder: boolean,
    openOrderId: number[]
  ) => Promise<boolean>,
  listNftNative: (
    order: UnsignedOrder,
    signature: Signature,
    nft: PartialDeep<Nft>,
    currency: string,
    startingPrice: BigNumber
  ) => Promise<boolean>,
}

export function useListNFTMutations(): ListNftResult {
  const sdk = useGraphQLSDK();

  const defaultChainId = useDefaultChainId();
  const { getByContractAddress } = useSupportedCurrencies();
  
  const listNftSeaport = useCallback(
    async (
      signature: string,
      parameters: SeaportOrderComponents
    ) => {
      try {
        const result = await sdk.ListNftSeaport({
          input: {
            seaportSignature: signature,
            seaportParams: JSON.stringify(parameters),
            chainId: defaultChainId
          }
        });
        return result?.listNFTSeaport ?? false;
      } catch (err) {
        Sentry.captureException(err);
        return false;
      }
    },
    [defaultChainId, sdk]
  );

  const listNftLooksrare = useCallback(
    async (order: MakerOrderWithSignature) => {
      try {
        const result = await sdk.ListNftLooksrare({
          input: {
            looksrareOrder: JSON.stringify(order),
            chainId: defaultChainId
          }
        });
        return result?.listNFTLooksrare ?? false;
      } catch (err) {
        Sentry.captureException(err);
        return false;
      }
    },
    [defaultChainId, sdk]
  );

  const listNftX2Y2 = useCallback(
    async (order: X2Y2Order, tokenId: string, contract: string, maker: string, hasOpenOrder: boolean, openOrderId: number[]) => {
      try {
        const result = await sdk.ListNFTX2Y2({
          input: {
            x2y2Order: JSON.stringify({
              order: encodeOrder(order),
              isBundle: false,
              bundleName: '',
              bundleDesc: '',
              orderIds: openOrderId,
              royalties: [],
              changePrice: hasOpenOrder,
              isCollection: false, // for sell orders
              isPrivate: false,
              taker: null,
            }),
            chainId: defaultChainId,
            tokenId,
            contract,
            maker
          }
        });
        return result?.listNFTX2Y2 ?? false;
      } catch (err) {
        Sentry.captureException(err);
        console.log('err:', err);
        return false;
      }
    },
    [defaultChainId, sdk]
  );

  const listNftNative = useCallback(
    async (order: UnsignedOrder, signature: Signature, nft: PartialDeep<Nft>, currency: string, startingPrice: BigNumber ) => {
      try {
        const unhashedMake = unhashedMakeAsset(nft);
        const unhashedTake = unhashedTakeAsset(
          currency,
          startingPrice,
          onchainAuctionTypeToGqlAuctionType(order.auctionType),
          getByContractAddress(isNullOrEmpty(order?.taker) ? NULL_ADDRESS : order.taker).contract);
        const orderHash = getOrderHash({
          ...order,
          makeAssets: [unhashedMake],
          takeAssets: [unhashedTake]
        });
        const result = await sdk.CreateMarketListing({
          input: {
            auctionType: onchainAuctionTypeToGqlAuctionType(order.auctionType),
            chainId: defaultChainId,
            end: order.end,
            makeAsset: [
              getMarketplaceAssetInput(
                unhashedMake,
                BigNumber.from(nft.tokenId),
                nft.contract
              ),
            ],
            makerAddress: order.maker,
            nonce: order.nonce,
            salt: order.salt,
            signature : {
              r: signature.r,
              s: signature.s,
              v: signature.v
            },
            start: order.start,
            structHash: orderHash,
            takeAsset: [
              getMarketplaceAssetInput(
                unhashedTake,
                0,
                getByContractAddress(isNullOrEmpty(order.taker) ?
                  NULL_ADDRESS :
                  order.taker).contract
              ),
            ],
            takerAddress: isNullOrEmpty(order.taker) ?
              NULL_ADDRESS:
              order.taker,
          }
        });
        console.log('🚀 ~ file: useListNFTMutation.ts:209 ~ result', result);
        return result?.createMarketListing ? true : false;
      } catch (err) {
        Sentry.captureException(err);
        console.log('err:', err);
        return false;
      }
    },
    [defaultChainId, getByContractAddress, sdk]
  );

  return {
    listNftSeaport,
    listNftLooksrare,
    listNftX2Y2,
    listNftNative
  };
}
