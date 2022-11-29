import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { SeaportOrderComponents } from 'types';

import { MakerOrderWithSignature } from '@looksrare/sdk';
import * as Sentry from '@sentry/nextjs';
import { useCallback } from 'react';

export interface ListNftResult {
  listNftSeaport: (
    signature: string,
    parameters: SeaportOrderComponents
  ) => Promise<boolean>,
  listNftLooksrare: (
    order: MakerOrderWithSignature
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

  return {
    listNftSeaport,
    listNftLooksrare
  };
}
