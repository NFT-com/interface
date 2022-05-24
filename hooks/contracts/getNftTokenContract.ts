import { NftToken__factory } from 'constants/typechain/factories/NftToken__factory';
import { NftToken } from 'constants/typechain/NftToken';

import { Provider } from '@ethersproject/providers';

export function getNftTokenContract(address: string, provider: Provider): NftToken {
  return NftToken__factory.connect(address, provider);
}
