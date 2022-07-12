import { IExecutionStrategy } from 'constants/typechain/looksrare';
import { IExecutionStrategy__factory } from 'constants/typechain/looksrare/factories/IExecutionStrategy__factory';
import { isNullOrEmpty } from 'utils/helpers';

import { Provider } from '@ethersproject/providers';
import { Addresses, addressesByNetwork } from '@looksrare/sdk';
import { useNetwork } from 'wagmi';

export function useLooksrareStrategyContract(provider: Provider): IExecutionStrategy {
  const { activeChain } = useNetwork();
  const addresses: Addresses = addressesByNetwork[activeChain?.id];
  const address = addresses?.STRATEGY_STANDARD_SALE;
  if (isNullOrEmpty(address)) {
    return null;
  }
  // todo: generalize this hook to different strategies.
  return IExecutionStrategy__factory.connect(address, provider);
}
