import dynamic from 'next/dynamic';

import { Modal } from 'components/elements/Modal';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import { CollectionsFiltersContent as StaticCollectionsFiltersContent } from './CollectionsFiltersContent';
import { NFTsFiltersContent as StaticNFTsFiltersContent } from './NFTsFiltersContent';
import { SearchContent as StaticSearchContent } from './SearchContent';

const DynamicCollectionsFiltersContent = dynamic<React.ComponentProps<typeof StaticCollectionsFiltersContent>>(() =>
  import('./CollectionsFiltersContent').then(mod => mod.CollectionsFiltersContent)
);
const DynamicNFTsFiltersContent = dynamic<React.ComponentProps<typeof StaticNFTsFiltersContent>>(() =>
  import('./NFTsFiltersContent').then(mod => mod.NFTsFiltersContent)
);
const DynamicSearchContent = dynamic<React.ComponentProps<typeof StaticSearchContent>>(() =>
  import('./SearchContent').then(mod => mod.SearchContent)
);

export const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, modalType } = useSearchModal();
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Modal
      fullModal
      transparentOverlay
      title={''}
      visible={searchModalOpen && screenWidth < 900}
      loading={false}
      onClose={function (): void {
        setSearchModalOpen(false);
      }}
    >
      <div
        className={tw(
          'absolute left-0 top-0 min-h-screen w-screen overflow-scroll',
          'flex items-center justify-center bg-[rgba(0,0,0,0.4)]',
          'text-primary-txt',
          'bg-white py-12'
        )}
      >
        {modalType === 'search' && <DynamicSearchContent />}
        {modalType === 'filters' && <DynamicNFTsFiltersContent />}
        {modalType === 'collectionFilters' && <DynamicCollectionsFiltersContent />}
      </div>
    </Modal>
  );
};
