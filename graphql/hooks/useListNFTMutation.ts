import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { SeaportOrderComponents } from 'types';
import { encodeOrder } from 'utils/X2Y2Helpers';

import { MakerOrderWithSignature } from '@looksrare/sdk';
import * as Sentry from '@sentry/nextjs';
import { X2Y2Order } from '@x2y2-io/sdk/dist/types';
import { useCallback } from 'react';

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
    maker: string
  ) => Promise<boolean>,
}

export function useListNFTMutations(): ListNftResult {
  const sdk = useGraphQLSDK();

  const defaultChainId = useDefaultChainId();

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
            chainId: defaultChainId,
            createdInternally: true
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
            chainId: defaultChainId,
            createdInternally: true
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
    async (order: X2Y2Order, tokenId: string, contract: string, maker: string) => {
      try {
        const result = await sdk.ListNFTX2Y2({
          input: {
            x2y2Order: JSON.stringify({
              order: encodeOrder(order),
              isBundle: false,
              bundleName: '',
              bundleDesc: '',
              orderIds: [],
              royalties: [],
              changePrice: false,
              isCollection: false, // for sell orders
              isPrivate: false,
              taker: null,
            }),
            chainId:  defaultChainId,
            tokenId,
            contract,
            maker,
            createdInternally: true
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

  return {
    listNftSeaport,
    listNftLooksrare,
    listNftX2Y2
  };
}
