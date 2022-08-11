import { Nft } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';

import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface NFTApprovalsProps {
  nft: PartialDeep<Nft>;
}

export function NftApprovals(props: NFTApprovalsProps) {
  const { address: currentAddress } = useAccount();

  const {
    allowedAll: openseaAllowed,
    requestAllowance: requestOpensea
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
    requestAllowance: requestLooksrare
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );
  
  return <div className="w-full flex sm:flex-col items-center justify-around text-primary-text dark:text-primary-txt-dk">
    <div>
        looksrare:{' '}
      {
        looksRareAllowed ?
          <>
            <span
              className='text-link hover:underline cursor-pointer ml-2'
              onClick={async () => {
                // todo: add to listing cart to be configured later
              }}
            >
              List Now
            </span>
          </> :
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
          <span
            className='text-link hover:underline cursor-pointer ml-2'
            onClick={async () => {
              // todo: add to listing cart to be configured later
            }}
          >
            List Now
          </span> :
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