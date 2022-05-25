import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { isNullOrEmpty } from 'utils/helpers';

import { Signer } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
export declare type FetchSignerResult = Signer | null;

export async function useProfileAuctionSigner() {
  const { data: account } = useAccount();
  const { profileAuction } = useAllContracts();
  const { data: signer } = useSigner();
  // extra check to make TS happy.
  if (isNullOrEmpty(account?.address) || account?.address == null || account?.connector == null || signer == null) {
    console.log('failed to connect signer to Profile Auction contract');
    return profileAuction;
  }

  return profileAuction.connect(signer);
}
