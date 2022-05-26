import { Button, ButtonType } from 'components/Button/Button';
import { WalletRainbowKitButton } from 'components/Header/WalletRainbowKitButton';
import { OptionGrid } from 'components/WalletModal/OptionGrid';
import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { tw } from 'utils/tw';

import { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export function SignatureErrorTile() {
  const { alwaysWhite } = useThemeColors();
  const { data: account } = useAccount();
  const { signed, trySignature } = useContext(GraphQLContext);

  const [showWalletOptions, setShowWalletOptions] = useState(false);

  if (signed) {
    return null;
  }

  return (
    <div
      className={tw(
        'rounded-xl p-5 flex flex-col items-center',
        'py-12 border border-rose-500 bg-black drop-shadow-lg'
      )}
      style={{ width: isMobile ? '90%' : '40rem' }}
    >
      <div className="text-2xl mb-5" style={{ color: alwaysWhite }}>
        Not Logged In
      </div>
      <div className='text-lg text-center mb-8' style={{ color: alwaysWhite }}>
        Please accept the signature request in your wallet to{' '}
        authenticate and access your data.
      </div>
      {showWalletOptions ?
        (
          <>
            <div className="text-base mb-5 text-secondary-txt">
              Connect with one of our available wallet providers.
            </div>
            <div
              className="rounded-xl p-5 flex flex-col bg-page-bg dark:bg-pagebg-dk"
              style={{ width: isMobile ? '90%' : '30rem' }}>
              <OptionGrid><WalletRainbowKitButton/></OptionGrid>
            </div>
          </>
        ) :
        (
          <Button
            label={'Try Again'}
            onClick={() => {
              if (!account) {
                setShowWalletOptions(true);
              } else {
                trySignature();
              }
            }}
            type={ButtonType.PRIMARY}
          />
        )}
    </div>
  );
}