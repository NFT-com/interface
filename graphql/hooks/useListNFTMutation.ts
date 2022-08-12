import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Doppler,getEnv } from 'utils/env';
import { getChainIdString } from 'utils/helpers';

import { MakerOrderWithSignature } from '@looksrare/sdk';
import * as Sentry from '@sentry/nextjs';
import { useCallback } from 'react';
import { SeaportOrderComponents } from 'types';
import { useNetwork } from 'wagmi';

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

  const { chain } = useNetwork();

  const listNftSeaport = useCallback(
    async (
      signature: string,
      parameters: SeaportOrderComponents
    ) => {
      try {
        await sdk.ListNftSeaport({
          input: {
            seaportSignature: signature,
            seaportParams: JSON.stringify(parameters),
            chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
          }
        });
        return true;
      } catch (err) {
        Sentry.captureException(err);
        return false;
      }
    },
    [chain?.id, sdk]
  );

  const listNftLooksrare = useCallback(
    async (order: MakerOrderWithSignature) => {
      try {
        await sdk.ListNftLooksrare({
          input: {
            looksrareOrder: JSON.stringify(order),
            chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)
          }
        });
        return true;
      } catch (err) {
        Sentry.captureException(err);
        return false;
      }
    },
    [chain?.id, sdk]
  );

  return {
    listNftSeaport,
    listNftLooksrare
  };
}
