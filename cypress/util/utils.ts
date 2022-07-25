import { currentAddresss } from './constants';
import { renderHook } from './wagmi';

import { BaseProvider, WebSocketProvider } from '@ethersproject/providers';
import { act } from '@testing-library/react-hooks/dom';
import { allChains, Chain, chain as chain_ } from '@wagmi/core';
import { MockConnector } from '@wagmi/core/connectors/mock';
import { providers } from 'ethers';
import { Wallet } from 'ethers/lib/ethers';
import { Contract } from 'ethers/lib/ethers';
import { Connector, createClient, CreateClientConfig } from 'wagmi';

type Config = Partial<CreateClientConfig>

class EthersProviderWrapper extends providers.StaticJsonRpcProvider {

  toJSON() {
    return `<Provider network={${this.network.chainId}} />`;
  }

}

export function getNetwork(chain: Chain) {
  return {
    chainId: chain.id,
    ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    name: chain.name,
  };
}

export function getSigners() {
  const provider = getProvider();
  const signers = currentAddresss.map((x) => {
    const wallet = new Wallet(x.privateKey);
    return provider.getSigner(wallet.address);
  });
  return signers;
}

export function getProvider({ chainId }: { chainId?: number } = {}) {
  const chain = allChains.find((x) => x.id === chainId) ?? chain_.hardhat;
  const network = getNetwork(chain);
  const url = chain_.hardhat.rpcUrls.default.toString();
  return new EthersProviderWrapper(url, network);
}

export function setupWagmiClient(config: Config = {}) {
  return createClient<BaseProvider, WebSocketProvider>({
    connectors: [
      new MockConnector({
        options: {
          signer: getSigners()[0],
        },
      }),
    ],
    provider: getProvider,
    ...config,
  });
}

class EthersWebSocketProviderWrapper extends providers.WebSocketProvider {

  toJSON() {
    return `<WebSocketProvider network={${this.network.chainId}} />`;
  }

}

export function getWebSocketProvider({ chainId }: { chainId?: number } = {}) {
  const chain = allChains.find((x) => x.id === chainId) ?? chain_.hardhat;
  const network = getNetwork(chain);
  const url = chain_.hardhat.rpcUrls.default.toString().replace('http', 'ws');
  return new EthersWebSocketProviderWrapper(url, network);
}

export async function actConnect(config: {
  connector?: Connector
  utils: ReturnType<typeof renderHook>
}) {
  const connector = config.connector;
  const getConnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.connect || utils.result.current;
  const utils = config.utils;

  await act(async () => {
    const connect = getConnect(utils);
    connect.connect?.(connector ?? connect.connectors?.[0]);
  });

  const { waitFor } = utils;
  await waitFor(() => expect(getConnect(utils).isConnected).to.be.ok);
}

export async function actDisconnect(config: {
  utils: ReturnType<typeof renderHook>
}) {
  const getDisconnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.disconnect || utils.result.current;
  const utils = config.utils;

  await act(async () => {
    const disconnect = getDisconnect(utils);
    disconnect.disconnect?.();
  });

  const { waitFor } = utils;
  await waitFor(() => expect(getDisconnect(utils).isSuccess).to.be.ok);
}

export async function actNetwork(config: {
  chainId: number
  utils: ReturnType<typeof renderHook>
}) {
  const chainId = config.chainId;
  const getNetwork = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.network || utils.result.current;
  const utils = config.utils;

  await act(async () => {
    getNetwork(utils).switchNetwork(chainId);
  });

  const { waitFor } = utils;
  await waitFor(() => expect(getNetwork(utils).isSuccess).to.be.ok);
}

export async function getUnclaimedTokenId(
  addressOrName: string,
  maxAttempts = 3,
) {
  function getRandomTokenId(from: number, to: number) {
    return Math.floor(Math.random() * to) + from;
  }

  let attempts = 0;
  const provider = getProvider();
  const contract = new Contract(
    addressOrName,
    [
      'function ownerOf(uint256 _tokenId) external view returns (address)',
      'function totalSupply() view returns (uint256)',
    ],
    provider,
  );
  const totalSupply = await contract.totalSupply();
  while (attempts < maxAttempts) {
    const randomTokenId = getRandomTokenId(1, totalSupply);
    try {
      await contract.ownerOf(randomTokenId);
    } catch (error) {
      return randomTokenId;
      break;
    }
    attempts += 1;
  }
  return false;
}