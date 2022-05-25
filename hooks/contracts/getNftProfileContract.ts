import { Nft_profile } from 'constants/typechain';
import { Nft_profile__factory } from 'constants/typechain/factories/Nft_profile__factory';

import { Provider } from '@ethersproject/providers';

export function getNftProfileContract(address: string, provider: Provider): Nft_profile {
  return Nft_profile__factory.connect(address, provider);
}
