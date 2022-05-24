import { Weth__factory } from 'constants/typechain/factories/Weth__factory';
import { Weth } from 'constants/typechain/Weth';

import { Provider } from '@ethersproject/providers';
export function getWethContract(address: string, provider: Provider): Weth {
  return Weth__factory.connect(address, provider);
}
