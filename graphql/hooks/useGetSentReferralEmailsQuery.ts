import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';

import useSWR, { mutate } from 'swr';
import { useAccount } from 'wagmi';

export interface GetSentReferralEmailsData {
  data: { __typename?: 'SentReferralEmailsOutput'; email: string; accepted: boolean; }[],
  loading: boolean;
  mutate: () => void;
}

export function useGetSentReferralEmailsQuery(): GetSentReferralEmailsData {
  const sdk = useGraphQLSDK();
  const { address: currentAddress } = useAccount();

  const keyString = 'GetSentReferralEmailsQuery' + currentAddress;

  const { data } = useSWR(keyString, async () => {
    if(!currentAddress) {
      return null;
    }

    const result = await sdk.GetSentReferralEmails();
    return result;
  });
  
  return {
    data: data?.getSentReferralEmails ?? null,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}