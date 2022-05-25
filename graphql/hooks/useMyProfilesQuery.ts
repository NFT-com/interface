import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MyProfilesQuery, ProfileStatus } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount } from 'wagmi';

export interface MyProfilesQueryData {
  data: MyProfilesQuery;
  loading: boolean;
  mutate: () => void;
}

export function useMyProfilesQuery(): MyProfilesQueryData {
  const sdk = useGraphQLSDK();
  const { data: account } = useAccount();
  const { signed } = useContext(GraphQLContext);

  const keyString = 'MyProfilesQueryQuery' + account?.address + signed;

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(account?.address) || !signed) {
      return null;
    }

    // todo: include pagination data
    const result = await sdk.MyProfiles({
      input: {
        statuses: [ProfileStatus.Owned, ProfileStatus.Pending],
        pageInput: {
          first: 100
        }
      },
    });
    return result;
  });
  return {
    data: data,
    loading: data == null && !isNullOrEmpty(account?.address) && signed,
    mutate: () => {
      mutate(keyString);
    },
  };
}
