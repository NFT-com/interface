import { Nft } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';

import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface NFTApprovalsProps {
  nft: PartialDeep<Nft>;
}

export function NftApprovals(props: NFTApprovalsProps) {
  const { data: account } = useAccount();
  const {
    allowedAll: openseaAllowed,
    requestAllowance: requestOpensea
  } = useNftCollectionAllowance(
    props.nft?.contract,
    account?.address,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
    requestAllowance: requestLooksrare
  } = useNftCollectionAllowance(
    props.nft?.contract,
    account?.address,
    TransferProxyTarget.LooksRare
  );
  
  return <div className="w-full flex items-center justify-around text-primary-text dark:text-primary-txt-dk">
    <div>
        looksrare:
      {
        looksRareAllowed ?
          'approved!' :
          <span
            className='text-link hover:underline cursor-pointer ml-2'
            onClick={requestLooksrare}
          >
            Approve
          </span>
      }
    </div>
    <div>
        opensea:{' '}
      {
        openseaAllowed ?
          'approved!' :
          <span
            className='text-link hover:underline cursor-pointer ml-4'
            onClick={requestOpensea}
          >
            Approve
          </span>
      }
    </div>
  </div>;
}