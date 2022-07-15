import { setupWagmiClient } from './utils';

import { waitFor } from '@testing-library/dom';
import {
  renderHook as defaultRenderHook,
} from '@testing-library/react-hooks/dom';
import * as React from 'react';
import { QueryClient } from 'react-query';
import { WagmiConfig, WagmiConfigProps } from 'wagmi';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
});

type Props = WagmiConfigProps & {
  children?:
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactNode
}
export function wrapper(props: Props) {
  const client = props.client ?? setupWagmiClient({ queryClient });
  return <WagmiConfig client={client} {...props} />;
}

type RenderHookOptions<Props> = {
  initialProps?: Props
  wrapper?: typeof wrapper
}

export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }: RenderHookOptions<TProps & WagmiConfigProps> | undefined = {},
) {
  // for react 17:
  const options = {
    wrapper: wrapper_ ?? wrapper,
    ...options_,
  };

  const utils = defaultRenderHook<TProps, TResult>(hook, options);
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor }).waitFor ?? waitFor,
  };
}

export {
  getProvider,
  getSigners,
  getWebSocketProvider,
} from './utils';
export {
  actConnect,
  actDisconnect,
  actNetwork,
  getUnclaimedTokenId,
  setupWagmiClient,
} from './utils';
export { act } from '@testing-library/react-hooks/dom';