import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';

import { Button,ButtonSize,ButtonType } from 'components/elements/Button';
import useWindowDimensions from 'hooks/useWindowDimensions';

import EllipseX from 'public/ellipse-x.svg?svgr';
import { useState } from 'react';

const IdFilter = (props: {
  setId: (id: string) => void,
  clearedFilters: boolean,
  setClearedFilters: (boolean) => void,
  id_nftName: string,
  screenWidth: number,
  setInputValue: (string) => void,
}) => {
  const { setId, clearedFilters, setClearedFilters, id_nftName, screenWidth, setInputValue } = props;
  const [value, setValue] = useState(id_nftName);
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
          value={clearedFilters ? '' : screenWidth >= 900 ? id_nftName : value}
          required maxLength={512}
          className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
          onChange={(event) => {
            screenWidth >= 900 ? setId(event.target.value) : setValue(event.target.value);
            setClearedFilters(false);
            setInputValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.keyCode === 13){
              setId(value);
              setClearedFilters(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export const CollectionsFiltersContent = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { setSearchModalOpen, setCollectionPageAppliedFilters, id_nftName } = useSearchModal();
  const [clearedFilters, setClearedFilters] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const setId = (id_nftName: string) => {
    setCollectionPageAppliedFilters('',id_nftName, false);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className="block minmd:hidden p-5 justify-end cursor-pointer"
          onClick={() => {
            setSearchModalOpen(false, 'collectionFilters');
          }}>
          <EllipseX />
        </div>
        <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filter</div>
        <div className="px-4 flex flex-col my-7">
          <div className="self-start font-black text-xl font-grotesk mb-4">Search for NFTs</div>
          <IdFilter
            setId={setId}
            clearedFilters={clearedFilters}
            setClearedFilters={setClearedFilters}
            id_nftName={id_nftName}
            screenWidth={screenWidth}
            setInputValue={setInputValue}/>
        </div>
        <div
          onClick={() =>{
            setInputValue('');
            setClearedFilters(true);
            setSearchModalOpen(false, 'collectionFilters');
            setCollectionPageAppliedFilters('','', false);
          }}
          className="px-4 self-start font-black text-xl font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filter
        </div>
        <span className="minlg:hidden px-5 mt-10 text-xs text-gray-400">Press enter for results</span>
        <div className="minlg:hidden px-4 mx-auto w-full minxl:w-1/4 flex justify-center mt-9 font-medium">
          <Button
            size={ButtonSize.LARGE}
            scaleOnHover
            stretch={true}
            label={'Filter'}
            onClick={() => {
              setCollectionPageAppliedFilters('',inputValue, false);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>);
};
