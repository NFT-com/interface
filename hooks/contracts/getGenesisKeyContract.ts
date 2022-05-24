import { GenesisKey__factory } from 'constants/typechain/factories/GenesisKey__factory';
import { GenesisKey } from 'constants/typechain/GenesisKey';

import { Provider } from '@ethersproject/providers';

export function getGenesisKeyContract(address: string, provider: Provider): GenesisKey {
  return GenesisKey__factory.connect(address, provider);
}
