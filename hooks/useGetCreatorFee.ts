import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

interface RoyaltyObject {
  [key: string]: number;
}

interface MinMaxRoyalty {
  min: number;
  max: number;
  royalty?: RoyaltyObject;
}
export interface CreatorFeeDetails {
  data: MinMaxRoyalty
  loading: boolean;
  mutate: () => void;
}

export function useGetCreatorFee(
  contractAddress: string,
  tokenId: string
): CreatorFeeDetails {
  const { chain } = useNetwork();
  const { marketplace } = useAllContracts();

  const keyString = 'GetCreatorFee ' + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + contractAddress + tokenId;

  const { data: NFTCOMRoyaltyFee } = useSWR(
    'NFTCOMRoyaltyFee' + contractAddress?.toLowerCase(),
    async () => {
      return await marketplace.royaltyInfo(contractAddress?.toLowerCase());
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const { data } = useSWR(keyString, async () => {
    if (chain?.id !== 1 && getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== '1') {
      return null;
    }
    if (isNullOrEmpty(contractAddress) || tokenId == null) {
      return null;
    }

    const looksrare = 'https://api.thegraph.com/subgraphs/name/looksrare/royalty-fee-registry';
    const seaport = 'https://api.thegraph.com/subgraphs/name/messari/opensea-seaport-ethereum';
    const x2y2 = 'https://api.thegraph.com/subgraphs/name/messari/x2y2-ethereum';
    const query = `{\n  collections(where: { id: "${contractAddress?.toLowerCase()}" }) {\n    id\n    royaltyFee\n  }\n}`;
    // post request using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    };

    const royalty: RoyaltyObject = {};
    const responseLR = await fetch(looksrare, requestOptions);
    const responseSeaport = await fetch(seaport, requestOptions);
    const responseX2Y2 = await fetch(x2y2, requestOptions);
    const dataLR = await responseLR.json();
    const dataSeaport = await responseSeaport.json();
    const dataX2Y2 = await responseX2Y2.json();

    if (dataLR?.data?.collections?.length > 0) {
      royalty['looksrare'] = dataLR?.data?.collections[0]?.royaltyFee;
    }
    if (dataSeaport?.data?.collections?.length > 0) {
      royalty['seaport'] = dataSeaport?.data?.collections[0]?.royaltyFee;
    }
    if (dataX2Y2?.data?.collections?.length > 0) {
      royalty['x2y2'] = dataX2Y2?.data?.collections[0]?.royaltyFee;
    }
    if (NFTCOMRoyaltyFee) {
      royalty['nftcom'] = Number(NFTCOMRoyaltyFee ? NFTCOMRoyaltyFee[1] : 0) / 100; // divide 100 to get percent (10000 = 100%)
    }

    // if royalty is empty return 0
    if (Object.keys(royalty).length === 0) {
      return { min: 0, max: 0 };
    }

    // get min and max royalty
    const min = Math.min(...Object.values(royalty));
    const max = Math.max(...Object.values(royalty));

    return { min, max, royalty };
  });

  return {
    data: data,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}