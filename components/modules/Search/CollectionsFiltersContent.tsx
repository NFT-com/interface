import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { DropdownPicker } from 'components/elements/DropdownPicker';

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
          type="number"
          placeholder="Example: 1234"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
          min="0"
          value={clearedFilters ? '' : value}
          required maxLength={512}
          className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
          onChange={(event) => {
            if (['.', '-'].includes('tokenId:='+event.target.value)) return;
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
  const { setSearchModalOpen, setCollectionPageAppliedFilters, collectionPageSortyBy } = useSearchModal();
  const [sortBy, setSortBy] = useState(collectionPageSortyBy);
  const [id, setId] = useState(null);
  const [clearedFilters, setClearedFilters] = useState(false);

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
        <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filters</div>
{/*         <div className="px-4 flex flex-col mt-7">
          <div className="self-start font-black text-3xl font-grotesk mb-3">Sort</div>
          <DropdownPicker
            placeholder={collectionPageSortyBy !== '' ? null : 'Default'}
            selectedIndex={collectionPageSortyBy === 'Price: Low to High' ? 0 : 1}
            options={[
              {
                label: 'Price: Low to High',
                onSelect: () => { setSortBy('listedPx:asc'); }
              },
              {
                label: 'Price: High to Low',
                onSelect: () => { setSortBy('listedPx:desc'); }
              },
            ]}
          />
        </div> */}
        <div className="px-4 flex flex-col my-7">
          <div className="self-start font-black text-xl font-grotesk mb-4">Filter by ID</div>
          <IdFilter setId={setId} clearedFilters={clearedFilters} setClearedFilters={setClearedFilters}/>
        </div>
        <div
          onClick={() =>{
            setCollectionPageAppliedFilters('','', true);
            setClearedFilters(true);
          }}
          className="px-4 self-start font-black text-xl font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filters
        </div>
        <div className="px-4 mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
          <Button
            color={'black'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Filter'}
            onClick={() => {
              setCollectionPageAppliedFilters(sortBy, 'tokenId:='+id, false);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>);
};
