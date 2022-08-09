import { Modal } from 'components/elements/Modal';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { SearchContent } from './SearchContent';

export const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen } = useSearchModal();
  return (
    <Modal
      fullModal
      bgColor='transparent'
      transparentOverlay
      title={''}
      visible={searchModalOpen}
      loading={false}
      onClose={function (): void {
        setSearchModalOpen(false);
      } }
    >
      <div className={tw(
        'absolute top-0 left-0 h-screen minlg:block overflow-scroll w-screen',
        'bg-white',
        'text-primary-txt',
        'py-5'
      )}>
        <SearchContent />
      </div>
    </Modal>);
};