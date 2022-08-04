import { ProfileContext } from 'components/modules/Profile/ProfileContext';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { Doppler, getEnv } from 'utils/env';

import { NFTCard } from './NFTCard';

import { useContext } from 'react';
import { useNetwork } from 'wagmi';

export interface NFTCollectionCardProps {
  contract: string
  count: number
  images: string[]
  onClick: () => void
  customBackground?: string
  customBorder?: string
  contractName?: string
  lightModeForced?: boolean
}

/**
 * Simple wrapper to an NFT card that will fetch collection data for you.
 */
export function NFTCollectionCard(props: NFTCollectionCardProps) {
  const { chain } = useNetwork();

  const {
    draftNftsDescriptionsVisible
  } = useContext(ProfileContext);

  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.contract, false);
  const processedImages = props.images.filter(i => i != null);
  //console.log(collection, 'collection card fdo', props.contractName);
  return (
    <NFTCard
      title={collection?.collection?.name ?? props.contractName}
      traits={[{ key: '', value: props.count + (props.count > 1 ? ' items' : ' item') }]}
      images={processedImages}
      imageLayout="row"
      onClick={props.onClick}
      nftsDescriptionsVisible={draftNftsDescriptionsVisible}
      contractAddress={collection?.collection?.contract}
      customBackground={props.customBackground}
      customBorder={props.customBorder}
      lightModeForced={props.lightModeForced}
    />
  );
}