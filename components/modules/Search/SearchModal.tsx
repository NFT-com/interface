import { Modal } from 'components/elements/Modal';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import { CollectionsFiltersContent } from './CollectionsFiltersContent';
import { NFTsFiltersContent } from './NFTsFiltersContent';
import { SearchContent } from './SearchContent';

export const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, modalType } = useSearchModal();
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Modal
      fullModal
      bgColor='transparent'
      transparentOverlay
      title={''}
      visible={searchModalOpen && screenWidth < 900}
      loading={false}
      onClose={function (): void {
        setSearchModalOpen(false);
      } }
    >
      <div className={tw(
        'absolute top-0 left-0 h-screen overflow-scroll w-screen',
        'bg-white',
        'text-primary-txt',
        'py-5'
      )}>
        {modalType === 'search' && <SearchContent />}
        {modalType === 'filters' && <NFTsFiltersContent />}
        {modalType === 'collectionFilters' && <CollectionsFiltersContent />}
      </div>
    </Modal>);
};