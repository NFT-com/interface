import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { SeaportOrderComponents } from 'types';

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
    signature: string
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
    async (order: X2Y2Order, signature: string) => {
      try {
        console.log(signature);
        // need r, s, v (signature)
        const result = await sdk.ListNFTX2Y2({
          input: {
            x2y2Order: JSON.stringify(order),
            profileUrl: 'luc',
            chainId:  defaultChainId,
          }
        });
        return result?.listNFTX2Y2 ?? false;
      } catch (err) {
        Sentry.captureException(err);
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
