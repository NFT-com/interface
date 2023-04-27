import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { SocialEntityType } from 'graphql/generated/types';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
export interface CommentData {
  data: {
    __typename?: 'CommentsOutput',
    totalItems?: number,
    items: {__typename?: 'Comment', authorId?: string, content?: string, entityId?: string, entityType?: SocialEntityType, id?: string, author?: {photoURL?: string, url: string}}[]
  };
  loading: boolean;
  mutate: () => void;
}

export function useCommentsQuery(entityId: string): CommentData {
  const sdk = useGraphQLSDK();
  const keyString = 'CommentQuery';

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    const result = await sdk.GetComments(
      {
        input: {
          entityId: entityId
        }
      }
    );
    return result.comments;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis
  };
}

