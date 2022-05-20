import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { useUser } from 'hooks/state/useUser';
import { tw } from 'utils/tw';

export interface SignatureModalProps {
  visible: boolean;
  showRetry: boolean;
  onRetry: () => void;
}

export function SignatureModal(props: SignatureModalProps) {
  const { setUserSignature, updateIsSignedIn } = useUser();
  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={{ topLine:'SIGN THE MESSAGE', bottomLine:'IN YOUR WALLET' }}
      onClose={() => null}
      pinkTitle
      noCancelBtn
    >
      <div className='w-full flex flex-col items-center pb-4'>
        <div className={tw(
          'text-center max-w-md text-primary-txt-dk w-full text-base',
          'my-6'
        )}>
          NFT.com uses this signature to verify that you{'\''}re the owner of this Ethereum address.
        </div>
        <div className="font-hero-heading1 minmd:mx-[20%] minmd:mb-5 flex w-full">
          {props.showRetry &&
            <div className='mx-2 flex grow'>
              <Button
                stretch
                label={'TRY AGAIN'}
                onClick={props.onRetry}
                type={ButtonType.PRIMARY}
              />
            </div>
          }
          <div className='mx-2 flex grow'>
            <Button
              type={ButtonType.PRIMARY}
              color={'black'}
              label={'CANCEL'}
              stretch
              onClick={() => {
                updateIsSignedIn(false);
                setUserSignature(null);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}