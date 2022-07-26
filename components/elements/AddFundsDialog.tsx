import { Button, ButtonType } from 'components/elements/Button';
import Copy from 'components/elements/Copy';
import { Modal } from 'components/elements/Modal';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { logAddFundsLinkClick, logAddFundsModalImpression } from 'utils/gaLogger';
import { shorten } from 'utils/helpers';
import { tw } from 'utils/tw';

import FiatBlack from 'public/fiat.svg';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface AddFundsDialogProps {
  currentAddress: string;
}

export default function AddFundsDialog(props: AddFundsDialogProps) {
  const [showWyreDisclaimer, setShowWyreDisclaimer] = useState(false);

  const { addFundsDialogOpen: isDialogOpen, setAddFundsDialogOpen } = useAddFundsDialog();

  const { primaryText, primaryTextClass, secondaryText } =
    useThemeColors();

  useEffect(() => {
    if (isDialogOpen) {
      logAddFundsModalImpression();
    }
  }, [isDialogOpen]);

  return <Modal
    visible={isDialogOpen}
    loading={false}
    title={{
      topLine: showWyreDisclaimer ? 'SENDING YOU' : 'ADD FUNDS',
      bottomLine: showWyreDisclaimer? 'TO WYRE' : ''
    }}
    pinkTitle
    onClose={() => {
      setShowWyreDisclaimer(false);
      setAddFundsDialogOpen(false);
    }}
  >
    <div
      className={tw(
        'sm:w-full',
        'rounded-xl text-center flex flex-col',
        'items-center justify-between mt-8 p-8',
      )}
      style={{
        color: primaryText,
      }}
    >
      <div className="flex items-center flex-col">
        {
          showWyreDisclaimer ?
            <>
              <div
                className="w-full text-center mt-4 mb-8 text-lg break-words max-w-xl"
                style={{
                  color: primaryText,
                }}
              >
                  You tried to place a bid higher than the amount of ETH in your wallet.{' '}
                  You are being redirected to Wyre (sendwyre.com) to purchase more ETH. It is
                  entirely up to you if you would like to use this FIAT to crypto service or fund
                  your wallet a different way. {'\n'}
              </div>
              <div className='w-full text-center text-base break-words max-w-xl'>
                  Please note: NFT.com is not affiliated with sendwyre.com in any way, and are
                  providing a link to this service for convenience purposes only.
              </div>
            </> :
            <>
              <QRCode value={`ethereum:${props.currentAddress}`} />
              <div className="mt-7">
                <div className={['w-full text-center text-base', primaryTextClass].join(' ')}>
                  {shorten(props.currentAddress, isMobile)}
                </div>

                <div
                  className="w-full text-center mt-2 mb-4 text-base break-words"
                  style={{
                    color: secondaryText,
                  }}
                >
                  Only send ETH or any other ERC-20 token to this address
                </div>
              </div>

              <Copy toCopy={props.currentAddress}>
                <span className="ml-1">Copy</span>
              </Copy>
            </>
        }
      </div>
    </div>
    <div className="font-hero-heading1 mx-[18%] md:mx-0 mb-5 md:mb-0">
      <Button
        icon={!showWyreDisclaimer ? FiatBlack : null}
        type={ButtonType.PRIMARY}
        color={'black'}
        label={showWyreDisclaimer ? 'GO TO WYRE' : 'FUND WITH FIAT'}
        stretch
        onClick={() => {
          if (showWyreDisclaimer) {
            window.open(
              `https://pay.sendwyre.com/?sourceCurrency=USD&destCurrency=ETH&dest=${props.currentAddress}`,
              '_blank'
            );
            setShowWyreDisclaimer(false);
            setAddFundsDialogOpen(false);
          } else {
            logAddFundsLinkClick();
            setShowWyreDisclaimer(true);
          }
        }}
      />
    </div>
  </Modal>;
}
