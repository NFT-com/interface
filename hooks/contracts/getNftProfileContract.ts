import { NftProfile__factory } from 'constants/typechain/factories/NftProfile__factory';
import { NftProfile } from 'constants/typechain/NftProfile';

import { Provider } from '@ethersproject/providers';

export function getNftProfileContract(address: string, provider: Provider): NftProfile {
  return NftProfile__factory.connect(address, provider);
}
