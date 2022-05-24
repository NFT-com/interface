import { GenesisKeyTeamClaim__factory } from 'constants/typechain/factories/GenesisKeyTeamClaim__factory';
import { GenesisKeyTeamClaim } from 'constants/typechain/GenesisKeyTeamClaim';

import { Provider } from '@ethersproject/providers';
export function getGenesisKeyTeamClaimContract(
  address: string,
  provider: Provider
): GenesisKeyTeamClaim {
  return GenesisKeyTeamClaim__factory.connect(address, provider);
}