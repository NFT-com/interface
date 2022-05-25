import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { tw } from 'utils/tw';

export interface SignOutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SignOutModal(props: SignOutModalProps) {
  if (process.env.NEXT_PUBLIC_HERO_ONLY === 'true') {
    return null;
  }

  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={{ topLine:'DISCONNECT', bottomLine:'YOUR WALLET' }}
      onClose={props.onClose}
      pinkTitle
    >
      <div className='w-full flex flex-col items-center pb-4'>
        <div className={tw(
          'text-center max-w-md text-primary-txt-dk w-full text-base',
          'my-6'
        )}>
          We{'\''}ve signed you out of NFT.com. However, to completely detach your wallet information from our site, you must disconnect your wallet.
        </div>
        <div className="font-hero-heading1 md:mx-0 mx-[20%] md:mb-0 mb-5 flex w-full">
          <div className='mx-2 flex grow'>
            <Button
              type={ButtonType.PRIMARY}
              color={'black'}
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