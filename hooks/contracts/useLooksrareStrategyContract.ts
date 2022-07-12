import { IExecutionStrategy } from 'constants/typechain/looksrare';
import { IExecutionStrategy__factory } from 'constants/typechain/looksrare/factories/IExecutionStrategy__factory';

import { Provider } from '@ethersproject/providers';
import { Addresses, addressesByNetwork } from '@looksrare/sdk';
import { useNetwork } from 'wagmi';

export function useLooksrareStrategyContract(provider: Provider): IExecutionStrategy {
  const { activeChain } = useNetwork();
  const addresses: Addresses = addressesByNetwork[activeChain?.id];
  // todo: generalize this hook to different strategies.
  return IExecutionStrategy__factory.connect(addresses?.STRATEGY_STANDARD_SALE, provider);
}
