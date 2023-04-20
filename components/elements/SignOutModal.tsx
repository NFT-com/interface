import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { tw } from 'utils/tw';

export interface SignOutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SignOutModal(props: SignOutModalProps) {
  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={{ topLine: 'DISCONNECT', bottomLine: 'YOUR WALLET' }}
      onClose={props.onClose}
    >
      <div className='flex w-full flex-col items-center pb-4 font-noi-grotesk'>
        <div className={tw('w-full max-w-md text-center font-noi-grotesk text-base text-primary-txt', 'my-6')}>
          We{"'"}ve signed you out of NFT.com. However, to completely detach your wallet information from our site, you
          must disconnect your wallet.
        </div>
        <div className='mx-0 mb-0 flex w-full font-noi-grotesk minlg:mx-[20%] minlg:mb-5'>
          <div className='mx-2 flex grow'>
            <Button
              type={ButtonType.PRIMARY}
              size={ButtonSize.XLARGE}
              label={'CONTINUE'}
              stretch
              onClick={() => {
                props.onClose();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
