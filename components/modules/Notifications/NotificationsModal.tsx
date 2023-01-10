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
        <div className='py-3 font-noi-grotesk lg:max-w-md max-w-lg m-auto minlg:relative'>
          <X onClick={() => setVisible(false)} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer' size={32} color="black" weight="fill" />
          <Notifications setVisible={setVisible} />
          <button onClick={() => setVisible(false)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
    