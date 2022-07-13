import { BaseProvider, WebSocketProvider } from '@ethersproject/providers';
import { Client as VanillaClient } from '@wagmi/core';
import { QueryClient } from 'react-query';

export class TestWagmiClient extends VanillaClient<BaseProvider, WebSocketProvider> {

  getSupportedNetworks;
  queryClient: QueryClient;

  constructor(
    config: any = null,
    storage: any = null,
    getSupportedNetworks: any = null,
    setState: any = null,
    clearState: any = null,
    destroy: any = null,
    autoConnect: any = null,
    setLastUsedConnector: any = null,
    queryClient: any = null
  ) {
    super();
    this.config = config;
    this.storage = storage;
    this.getSupportedNetworks = getSupportedNetworks;
    this.setState = setState;
    this.clearState = clearState;
    this.destroy = destroy;
    this.autoConnect = autoConnect;
    this.setLastUsedConnector = setLastUsedConnector;
    this.queryClient = queryClient;
  }

}