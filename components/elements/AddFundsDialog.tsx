import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';
import QRCode from 'qrcode.react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Copy from 'components/elements/Copy';
import { Modal } from 'components/elements/Modal';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { shorten } from 'utils/format';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

const BlurImage = dynamic(import('components/elements/BlurImage'));

export interface AddFundsDialogProps {
  currentAddress: string;
}

export default function AddFundsDialog(props: AddFundsDialogProps) {
  const [showWyreDisclaimer, setShowWyreDisclaimer] = useState(false);

  const { addFundsDialogOpen: isDialogOpen, setAddFundsDialogOpen } = useAddFundsDialog();

  const { primaryText, primaryTextClass, secondaryText } = useThemeColors();

  return (
    <Modal
      visible={isDialogOpen}
      loading={false}
      title={{
        topLine: showWyreDisclaimer ? 'SENDING YOU' : 'ADD FUNDS',
        bottomLine: showWyreDisclaimer ? 'TO WYRE' : ''
      }}
      onClose={() => {
        setShowWyreDisclaimer(false);
        setAddFundsDialogOpen(false);
      }}
    >
      <div
        className={tw(
          'w-full max-w-nftcom',
          'flex flex-col rounded-xl text-center',
          'mt-8 items-center justify-between p-8'
        )}
        style={{
          color: primaryText
        }}
      >
        <div className='flex flex-col items-center'>
          {showWyreDisclaimer ? (
            <>
              <div
                className='mb-8 mt-4 w-full max-w-xl break-words text-center text-lg'
                style={{
                  color: primaryText
                }}
              >
                You are being redirected to Wyre (sendwyre.com) to purchase more ETH. It is entirely up to you if you
                would like to use this FIAT to crypto service or fund your wallet a different way. {'\n'}
              </div>
              <div className='w-full max-w-xl break-words text-center text-base'>
                Please note: NFT.com is not affiliated with sendwyre.com in any way, and are providing a link to this
                service for convenience purposes only.
              </div>
            </>
          ) : (
            <>
              <QRCode value={`ethereum:${props.currentAddress}`} />
              <div className='mt-7'>
                <div className={['w-full text-center text-base', primaryTextClass].join(' ')}>
                  {shorten(props.currentAddress, isMobile)}
                </div>

                <div
                  className='mb-4 mt-2 w-full break-words text-center text-base'
                  style={{
                    color: secondaryText
                  }}
                >
                  Only send ETH or any other ERC-20 token to this address
                </div>
              </div>

              <Copy toCopy={props.currentAddress}>
                <span className='ml-1'>Copy</span>
              </Copy>
            </>
          )}
        </div>
      </div>
      <div className='font-hero-heading1 mx-0 mb-0 minlg:mx-[18%] minlg:mb-5'>
        <Button
          icon={
            !showWyreDisclaimer ? <BlurImage src={'/fiat.svg'} localImage alt='fiat' width={64} height={64} /> : null
          }
          type={ButtonType.PRIMARY}
          size={ButtonSize.LARGE}
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
              setShowWyreDisclaimer(true);
            }
          }}
        />
      </div>
    </Modal>
  );
}
