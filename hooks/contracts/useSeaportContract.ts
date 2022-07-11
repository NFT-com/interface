import { Seaport } from 'constants/typechain';
import { Seaport__factory } from 'constants/typechain/factories/Seaport__factory';

import { Provider } from '@ethersproject/providers';
import { CROSS_CHAIN_SEAPORT_ADDRESS } from 'types';

export function useSeaportContract(provider: Provider): Seaport {
  return Seaport__factory.connect(CROSS_CHAIN_SEAPORT_ADDRESS, provider);
}
