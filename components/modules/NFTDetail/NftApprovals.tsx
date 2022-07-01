import { NULL_ADDRESS } from 'constants/addresses';
import { Nft } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { listSeaport } from 'utils/listings';

import { ethers } from 'ethers';
import { PartialDeep } from 'type-fest';
import { SEAPORT_CONDUIT_KEY,SEAPORT_ZONE, SEAPORT_ZONE_HASH,SeaportItemType, SeaportOrderParameters } from 'types';
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
          <>
            <span>approved!</span>
            <span
              className='text-link hover:underline cursor-pointer ml-2'
              onClick={() => {
                // todo: call to /api/looksrare to list
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
            onClick={() => {
              const parameters: SeaportOrderParameters = {
                offerer: account?.address,
                zone: SEAPORT_ZONE,
                zone_hash: SEAPORT_ZONE_HASH,
                start_time: 0,
                end_time: 0, // todo: set expiration time
                order_type: 0,
                salt: String(Date.now()),
                conduitKey: SEAPORT_CONDUIT_KEY,
                nonce: '0',
                totalOriginalConsiderationItems: 2,
                offer: [{
                  item_type: SeaportItemType.ERC721,
                  token: props.nft?.contract,
                  identifier_or_criteria: '1',
                  startAmount: 1, // todo: support amount input for ERC1155
                  endAmount: 1,
                }],
                consideration: [{
                  // offerer fee (i.e. the price)
                  item_type: 0,
                  token: NULL_ADDRESS, // todo: support non-ETH currencies
                  identifier_or_criteria: '0',
                  startAmount: ethers.utils.parseEther('10'),
                  endAmount: ethers.utils.parseEther('10'),
                  recipient: account?.address,
                },
                {
                  // opensea fee
                  item_type: 0,
                  token: NULL_ADDRESS,
                  identifier_or_criteria: '0',
                  startAmount: ethers.utils.parseEther('1'),
                  endAmount: ethers.utils.parseEther('1'),
                  recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                },
                {
                  // (optional) collection fee
                  item_type: 0,
                  token: NULL_ADDRESS,
                  identifier_or_criteria: '0',
                  startAmount: ethers.utils.parseEther('1'),
                  endAmount: ethers.utils.parseEther('1'),
                  recipient: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
                }],
              };
              // todo: get signature
              listSeaport('' , parameters);
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