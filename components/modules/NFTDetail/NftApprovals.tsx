import { Nft } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';

import { NFTListingsContext } from './NFTListingsContext';

import { useContext } from 'react';
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

  const { openListingBuilder } = useContext(NFTListingsContext);
  
  return <div className="w-full flex sm:flex-col items-center justify-around text-primary-text dark:text-primary-txt-dk">
    <div>
        looksrare:{' '}
      {
        looksRareAllowed ?
          <>
            <span
              className='text-link hover:underline cursor-pointer ml-2'
              onClick={async () => {
                openListingBuilder('looksrare', props.nft);
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
              openListingBuilder('seaport', props.nft);
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