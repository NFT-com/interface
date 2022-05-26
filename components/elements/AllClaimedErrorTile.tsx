import { Button, ButtonType } from 'components/Button/Button';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { tw } from 'utils/tw';

import { isMobile } from 'react-device-detect';

export interface AllClaimedErrorTileProps {
  onRefresh: () => void
}

export function AllClaimedErrorTile(props: AllClaimedErrorTileProps) {
  const { alwaysWhite } = useThemeColors();
  return (
    <div
      className={tw(
        'rounded-xl p-5 flex flex-col items-center text-center',
        'py-12 border border-yellow-500 bg-yellow-500 drop-shadow-lg'
      )}
      style={{ width: isMobile ? '90%' : '40rem' }}
    >
      <div className="text-2xl mb-5" style={{ color: alwaysWhite }}>
        You Have No Profiles To Claim
      </div>
      <div className='text-lg mb-10' style={{ color: alwaysWhite }}>
        Please switch your wallet to one with unclaimed profiles.
      </div>
      <Button
        type={ButtonType.SECONDARY}
        label={'Refresh Now'}
        onClick={props.onRefresh}
      />
    </div>
  );
}