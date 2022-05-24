import {
  GenesisKeyDistributor__factory
} from 'constants/typechain/factories/GenesisKeyDistributor__factory';
import { GenesisKeyDistributor } from 'constants/typechain/GenesisKeyDistributor';

import { Provider } from '@ethersproject/providers';

export function getGenesisKeyDistributorContract(
  address: string,
  provider: Provider
): GenesisKeyDistributor {
  return GenesisKeyDistributor__factory.connect(address, provider);
}