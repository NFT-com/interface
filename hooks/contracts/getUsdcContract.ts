import { Usdc__factory } from 'constants/typechain/factories/Usdc__factory';
import { Usdc } from 'constants/typechain/Usdc';

import { Provider } from '@ethersproject/providers';
export function getUsdcContract(address: string, provider: Provider): Usdc {
  return Usdc__factory.connect(address, provider);
}
