import { Modal } from 'components/elements/Modal';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import { CollectionsFiltersContent as StaticCollectionsFiltersContent } from './CollectionsFiltersContent';
import { NFTsFiltersContent as StaticNFTsFiltersContent } from './NFTsFiltersContent';
import { SearchContent as StaticSearchContent } from './SearchContent';

import dynamic from 'next/dynamic';

const DynamicCollectionsFiltersContent = dynamic<React.ComponentProps<typeof StaticCollectionsFiltersContent>>(() => import('./CollectionsFiltersContent').then(mod => mod.CollectionsFiltersContent));
const DynamicNFTsFiltersContent = dynamic<React.ComponentProps<typeof StaticNFTsFiltersContent>>(() => import('./NFTsFiltersContent').then(mod => mod.NFTsFiltersContent));
const DynamicSearchContent = dynamic<React.ComponentProps<typeof StaticSearchContent>>(() => import('./SearchContent').then(mod => mod.SearchContent));

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
        'absolute top-0 left-0 min-h-screen overflow-scroll w-screen',
        'bg-white',
        'text-primary-txt',
        'py-12'
      )}>
        {modalType === 'search' && <DynamicCollectionsFiltersContent />}
        {modalType === 'filters' && <DynamicNFTsFiltersContent />}
        {modalType === 'collectionFilters' && <DynamicSearchContent />}
      </div>
    </Modal>);
};