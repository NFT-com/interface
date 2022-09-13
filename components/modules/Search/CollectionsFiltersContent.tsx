import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';

import EllipseX from 'public/ellipse-x.svg';
import { useState } from 'react';

const IdFilter = (props: {setId: (id: string) => void, clearedFilters: boolean, setClearedFilters: (boolean) => void}) => {
  const [value, setValue] = useState('');
  const { setId, clearedFilters, setClearedFilters } = props;
  return (
    <div className={tw(
      'relative flex items-center rounded-xl p-3 w-full text-black bg-gray-100')}>
      <div className="w-full">
        <input
          type="search"
          placeholder="Search by name or ID"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
          value={clearedFilters ? '' : value}
          required maxLength={512}
          className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
          onChange={(event) => {
            setId(event.target.value);
            setValue(event.target.value);
            setClearedFilters(false);
          }}
        />
      </div>
    </div>
  );
};

export const CollectionsFiltersContent = () => {
  const { setSearchModalOpen, setCollectionPageAppliedFilters } = useSearchModal();
  const [clearedFilters, setClearedFilters] = useState(false);

  const setId = (id_nftName: string) => {
    setCollectionPageAppliedFilters('',id_nftName, false);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className="block minmd:hidden flex p-5 justify-end cursor-pointer"
          onClick={() => {
            setSearchModalOpen(false, 'collectionFilters');
          }}>
          <EllipseX />
        </div>
        <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filter</div>
        <div className="px-4 flex flex-col my-7">
          <div className="self-start font-black text-xl font-grotesk mb-4">Search for NFTs</div>
          <IdFilter setId={setId} clearedFilters={clearedFilters} setClearedFilters={setClearedFilters}/>
        </div>
        <div
          onClick={() =>{
            setCollectionPageAppliedFilters('','', true);
            setClearedFilters(true);
          }}
          className="px-4 self-start font-black text-xl font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filter
        </div>
      </div>
    </>);
};
