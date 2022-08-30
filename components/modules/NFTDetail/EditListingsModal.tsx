import { Modal } from 'components/elements/Modal';
import { TxActivity } from 'graphql/generated/types';

import { XCircle } from 'phosphor-react';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';

export interface EditListingsModalProps {
  listings: PartialDeep<TxActivity>[];
  visible: boolean;
  onClose: () => void;
}

export function EditListingsModal(props: EditListingsModalProps) {
  const { visible, onClose } = props;

  const getModalContent = useCallback(() => {
    // todo: list all the listings, each with "unlist item" and "adjust price" and maybe "new listing" 
    return <div>todo</div>;
  }, []);

  return (
    <Modal
      visible={visible}
      loading={false}
      title={''}
      onClose={onClose}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 pb-10 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto minlg:relative'>
          <div className='absolute top-4 right-4 minlg:right-1 hover:cursor-pointer w-6 h-6 bg-[#f9d963] rounded-full'></div>
          <XCircle onClick={onClose} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer' size={32} color="black" weight="fill" />
          {<h2 className='text-4xl tracking-wide font-bold mb-10'>Editing Listings</h2>}
          {getModalContent()}
        </div>
      </div>
    </Modal>
  );
}