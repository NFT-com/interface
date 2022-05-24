import {
  GenesisKeyTeamDistributor__factory
} from 'constants/typechain/factories/GenesisKeyTeamDistributor__factory';
import { GenesisKeyTeamDistributor } from 'constants/typechain/GenesisKeyTeamDistributor';

import { Provider } from '@ethersproject/providers';

export function getGenesisKeyTeamDistributorContract(
  address: string,
  provider: Provider
): GenesisKeyTeamDistributor {
  return GenesisKeyTeamDistributor__factory.connect(address, provider);
}