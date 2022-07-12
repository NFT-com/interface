import { RoyaltyFeeRegistry } from 'constants/typechain/looksrare';
import { RoyaltyFeeRegistry__factory } from 'constants/typechain/looksrare/factories/RoyaltyFeeRegistry__factory';

import { Provider } from '@ethersproject/providers';
import { Addresses, addressesByNetwork } from '@looksrare/sdk';
import { useNetwork } from 'wagmi';

export function useLooksrareRoyaltyFeeRegistryContractContract(provider: Provider): RoyaltyFeeRegistry {
  const { activeChain } = useNetwork();
  const addresses: Addresses = addressesByNetwork[activeChain?.id];
  return RoyaltyFeeRegistry__factory.connect(addresses?.ROYALTY_FEE_REGISTRY, provider);
}
