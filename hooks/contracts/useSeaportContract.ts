import { Seaport } from 'constants/typechain';
import { Seaport__factory } from 'constants/typechain/factories/Seaport__factory';
import { CROSS_CHAIN_SEAPORT_ADDRESS } from 'types';

import { Provider } from '@ethersproject/providers';

export function useSeaportContract(provider: Provider): Seaport {
  return Seaport__factory.connect(CROSS_CHAIN_SEAPORT_ADDRESS, provider);
}
