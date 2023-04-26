import { LooksRareProtocol, LooksRareProtocol__factory } from 'constants/typechain/looksrareV2';
import { Maybe } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/format';

import { Provider } from '@ethersproject/providers';
import { Addresses, addressesByNetwork } from '@looksrare/sdk-v2';
import { Signer } from 'ethers';
import { useNetwork } from 'wagmi';

export function useLooksrareProtocolContract(signerOrProvider: Provider | Signer): Maybe<LooksRareProtocol> {
  const { chain } = useNetwork();
  const addresses: Addresses = addressesByNetwork[chain?.id];
  const address = addresses?.EXCHANGE_V2;
  if (isNullOrEmpty(address) || signerOrProvider == null) {
    return null;
  }
  return LooksRareProtocol__factory.connect(address, signerOrProvider);
}
