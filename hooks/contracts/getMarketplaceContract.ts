import { Marketplace__factory } from 'constants/typechain/factories/Marketplace__factory';
import { Marketplace } from 'constants/typechain/Marketplace';

import { Provider } from '@ethersproject/providers';
export function getMarketplaceContract(address: string, provider: Provider): Marketplace {
  return Marketplace__factory.connect(address, provider);
}
