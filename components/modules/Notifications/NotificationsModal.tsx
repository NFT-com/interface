import { Modal } from 'components/elements/Modal';
import { Notifications } from 'components/modules/Sidebar/Notifications';

import { X } from 'phosphor-react';

type NotificationsModalProps = {
  visible: boolean;
  setVisible: (input:boolean) => void;
};

export default function NotificationsModal({ visible, setVisible }: NotificationsModalProps) {
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
      <div className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='py-5 font-noi-grotesk lg:max-w-md max-w-lg m-auto minlg:relative px-3'>
          <X onClick={() => setVisible(false)} className='absolute top-5 right-3 minlg:right-0 hover:cursor-pointer' size={32} color="black" weight="fill" />
          <Notifications setVisible={setVisible} />
        </div>
      </div>
    </Modal>
  );
}
    