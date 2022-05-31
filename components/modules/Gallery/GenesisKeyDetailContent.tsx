import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { NullState } from 'components/elements/NullState';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';

import { GenesisKeyGalleryDetailView } from './GenesisKeyGalleryDetailView';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

export function GenesisKeyDetailContent(props: { id: string | string[] }) {
  const { data: account } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const router = useRouter();

  if(account && !isSupported) {
    return <div className='w-full justify-center flex mt-12'>
      <NetworkErrorTile />
    </div>;
  }

  if(BigNumber.from(props?.id).gt(10000)) {
    return (
      <NullState
        showImage
        primaryMessage='This Genesis Key doesnt exist yet. '
        buttonLabel={'Back to Gallery'}
        onClick={() => {
          router.push('/app/gallery');
        }}/>
    );
  }

  return <div className="flex flex-col h-full w-full items-center justify-center overflow-y-scroll">
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