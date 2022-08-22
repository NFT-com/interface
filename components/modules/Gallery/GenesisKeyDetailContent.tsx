import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { NullState } from 'components/elements/NullState';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';

import { GenesisKeyGalleryDetailView } from './GenesisKeyGalleryDetailView';

import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

export function GenesisKeyDetailContent(props: { id: string | string[] }) {
  const { address: currentAddress } = useAccount();
  const { isSupported } = useSupportedNetwork();

  if(currentAddress && !isSupported) {
    return <div className='w-full justify-center flex mt-12'>
      <NetworkErrorTile />
    </div>;
  }

  if((!props?.id.toString().match(/^[\d+]+$/)) || BigNumber.from(props?.id).gt(10000) || BigNumber.from(props?.id).lte(0)) {
    return (
      <NullState
        showImage
        primaryMessage='This Genesis Key doesnt exist yet. '
        buttonLabel={'Back to Gallery'}
        href='/app/gallery'
      />
    );
  }

  return <div className="flex flex-col h-full w-full items-center justify-center overflow-y-auto">
    <GenesisKeyGalleryDetailView
      verticalDetail
      hideCloseButton
      id={String(props?.id)}
      onClose={() => {
        // nothing
      }}
    />
  </div>;
}