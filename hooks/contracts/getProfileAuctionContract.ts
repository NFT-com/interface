import { ProfileAuction__factory } from 'constants/typechain/factories/ProfileAuction__factory';
import { ProfileAuction } from 'constants/typechain/ProfileAuction';

import { Provider } from '@ethersproject/providers';

export function getProfileAuctionContract(address: string, provider: Provider): ProfileAuction {
  return ProfileAuction__factory.connect(address, provider);
}
