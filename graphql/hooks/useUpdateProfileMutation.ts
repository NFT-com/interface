import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, UpdateProfileInput } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface UpdateProfileResult {
  updating: boolean;
  error: string | null;
  updateProfile: (input: UpdateProfileInput) => Promise<boolean>;
}

/**
 * Removes the profile with given ID from the logged in user's watchlist.
 */
export function useUpdateProfileMutation(): UpdateProfileResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      setLoading(true);
      try {
        await sdk.UpdateProfile({
          input: input,
        });

        setLoading(false);

        return true;
      } catch (err) {
        setLoading(false);
        setError('Profile update failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    updating: loading,
    error: error,
    updateProfile: updateProfile,
  };
}
