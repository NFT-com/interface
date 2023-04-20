import { useContext } from 'react';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { Notifications } from 'components/modules/Notifications/Notifications';

type NotificationsModalProps = {
  visible: boolean;
  setVisible: (input: boolean) => void;
};

export default function NotificationsModal({ visible, setVisible }: NotificationsModalProps) {
  const { count } = useContext(NotificationContext);

  return (
    <Modal
      visible={visible}
      loading={false}
      title={''}
      onClose={() => {
        setVisible(false);
      }}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='maxlg:h-max h-screen max-h-screen max-w-full overflow-auto rounded-none bg-white px-4 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
        <div className='m-auto max-w-lg px-3 py-5 font-noi-grotesk minlg:relative lg:max-w-md'>
          <X
            onClick={() => setVisible(false)}
            className='absolute right-3 top-5 hover:cursor-pointer minlg:right-0'
            size={32}
            color='black'
            weight='fill'
          />
          <Notifications setVisible={setVisible} />
          {/* only show when notifications exist for better UI */}
          {count ? (
            <div className='mt-4'>
              <Button
                size={ButtonSize.LARGE}
                type={ButtonType.PRIMARY}
                stretch
                label='Close'
                onClick={() => setVisible(false)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
