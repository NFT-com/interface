import { Erc721 } from 'constants/typechain';
import { Erc721__factory } from 'constants/typechain/factories/Erc721__factory';

import { Provider } from '@ethersproject/providers';
export function use721Contract(tokenAddress: string, provider: Provider): Erc721 {
  return Erc721__factory.connect(tokenAddress, provider);
}
