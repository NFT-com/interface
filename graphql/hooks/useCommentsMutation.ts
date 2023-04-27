import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useUser } from 'hooks/state/useUser';

import { SocialEntityType } from 'graphql/generated/types';
import { useCallback, useState } from 'react';

export function useCommentsMutation(entityId?: string, comment?: string, commentId?: string) {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const { currentProfileId } = useUser();
  const setComment = useCallback(
    async () => {
      setLoading(true);
      try {
        const result = await sdk.AddComment({
          input: {
            authorId: currentProfileId,
            content: comment,
            entityId: entityId,
            entityType: SocialEntityType.Nft,
          }
        });

        if (!result) {
          return null;
        }
        setLoading(false);
        return result;
      } catch (err) {
        return null;
      }
    },
    [comment, currentProfileId, entityId, sdk]
  );
  const deleteCommentFn = useCallback(
    async () => {
      setLoading(true);
      try {
        const result = await sdk.DeleteComment({
          input: {
            commentId: commentId
          }
        });

        if (!result) {
          return null;
        }
        setLoading(false);
        return result;
      } catch (err) {
        return null;
      }
    },
    [commentId, sdk]
  );

  return {
    setComment,
    deleteCommentFn,
    loading
  };
}
