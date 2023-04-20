import { isMobile } from 'react-device-detect';

import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

export function NetworkErrorTile() {
  const { alwaysWhite } = useThemeColors();
  const { supportedNetworks } = useSupportedNetwork();
  return (
    <div
      className={tw('flex flex-col items-center rounded-xl p-5', 'border border-red-1 bg-black py-12 drop-shadow-lg')}
      style={{ width: isMobile ? '90%' : '40rem' }}
    >
      <div className='mb-5 text-2xl' style={{ color: alwaysWhite }}>
        Unsupported Network
      </div>
      <div className='text-lg' style={{ color: alwaysWhite }}>
        Please switch your wallet to one of the following networks:{' '}
        {supportedNetworks.map(item => item.split(':')[2]).join(', ')}
      </div>
    </div>
  );
}
