import { Eip2612 } from 'constants/typechain/Eip2612';
import { Eip2612__factory } from 'constants/typechain/factories/Eip2612__factory';

import { Provider } from '@ethersproject/providers';

export function useEIP2612Contract(tokenAddress: string, provider: Provider): Eip2612 {
  return Eip2612__factory.connect(tokenAddress, provider);
}
