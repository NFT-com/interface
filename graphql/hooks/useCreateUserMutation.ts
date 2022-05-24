import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, SignUpInput } from 'graphql/generated/types';
import { logCreateUserFailure, logCreateUserSuccess, logEmailSubmitted } from 'utils/gaLogger';

import { ethers } from 'ethers';
import { useCallback, useState } from 'react';

export interface CreateUserMutationProps {
  onCreateSuccess: () => void;
  onCreateFailure: () => void;
}

export interface CreateUserMutationResult {
  creating: boolean;
  error: string | null;
  createUser: (input: SignUpInput) => void;
}

/**
 * provides the sign up function to the caller.
 * this function is called when the user submits an email address,
 * which we combine with a Wallet and other options to create the
 * unverified User in our system and send the email for verification.
 */
export function useCreateUserMutation({
  onCreateSuccess,
  onCreateFailure,
}: CreateUserMutationProps): CreateUserMutationResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const createUser = useCallback(async (input: SignUpInput) => {
    logEmailSubmitted();
    setLoading(true);
    try {
      await sdk.SignUp({
        input: {
          avatarURL: input.avatarURL ?? undefined,
          email: input.email?.toLowerCase(),
          username: input.username?.toLowerCase(),
          referredBy:
            input.referredBy?.length === 0
              ? undefined
              : (input.referredBy as string)?.toLowerCase(),
          wallet: {
            address: ethers.utils.getAddress(input.wallet.address),
            chainId: input.wallet.chainId,
            network: input.wallet.network,
          },
        },
      });
      logCreateUserSuccess();
      onCreateSuccess();
      setLoading(false);
    } catch (err) {
      // invalid inputs, or user creation failed.
      onCreateFailure();
      setLoading(false);
      setError(
        err.message.includes('duplicate key value violates unique constraint')
          ? 'User already exists.' :
          err.message.includes('already exists')
            ? 'User with email ' + input.email?.toLowerCase() + ' already exists.'
            : 'Sign Up failed. Please try again.'
      );
      // log here because this is a failure unexpected by Apollo, so we
      // may not have an Apollo error.
      logCreateUserFailure();
    }
  }, [onCreateFailure, onCreateSuccess, sdk]);

  return {
    creating: loading,
    error: error,
    createUser: createUser,
  };
}
