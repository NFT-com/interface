import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Nft } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ExternalListingTile } from './ExternalListingTile';

import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { address: currentAddress } = useAccount();
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const { data: listings } = useExternalListingsQuery(props?.nft?.contract, props?.nft?.tokenId, String(props.nft?.wallet.chainId || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)));
  
  if (isNullOrEmpty(listings?.filter((l) => !isNullOrEmpty(l.url)))) {
    return (
      getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
        currentAddress === props.nft?.wallet?.address &&
        <div className='w-full justify-center flex'>
          <div className="flex flex-col items-center bg-white dark:bg-secondary-bg-dk rounded-xl py-5 px-12 my-6">
            <span className='dark:text-white mb-4'>This item is in your wallet</span>
            <Button
              label={'List Item'}
              color="white"
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  targets: []
                });
                if (!isMobile) {
                  toggleCartSidebar();
                }
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
    );
  }
  return <div className={tw(
    'flex w-full px-4',
    'flex-col minlg:flex-row flex-wrap'
  )}>
    {listings?.filter((l) => !isNullOrEmpty(l.url))?.map((listing, index) => (
      <div className='w-full minlg:w-2/4 pr-2' key={index}>
        <ExternalListingTile listing={listing} />
      </div>
    ))}
  </div>;
}