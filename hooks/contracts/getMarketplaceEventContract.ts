import { MarketplaceEvent__factory } from 'constants/typechain/factories/MarketplaceEvent__factory';
import { MarketplaceEvent } from 'constants/typechain/MarketplaceEvent';

import { Provider } from '@ethersproject/providers';

export function getMarketplaceEventContract(address: string, provider: Provider): MarketplaceEvent {
  return MarketplaceEvent__factory.connect(address, provider);
}