import { useState } from 'react';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

('utils/typeSenseAdapters');

const IdFilter = (props: {
  setId: (id: string) => void;
  clearedFilters: boolean;
  setClearedFilters: (boolean) => void;
  id_nftName: string;
  screenWidth: number;
  setInputValue: (string) => void;
}) => {
  const { setId, clearedFilters, setClearedFilters, id_nftName, screenWidth, setInputValue } = props;
  const [value, setValue] = useState(id_nftName);
  return (
    <div className={tw('relative flex w-full items-center rounded-xl bg-gray-100 p-3 text-black')}>
      <div className='w-full'>
        <input
          type='search'
          placeholder='Search by name or ID'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          autoFocus
          value={clearedFilters ? '' : screenWidth >= 900 ? id_nftName : value}
          required
          maxLength={512}
          className='w-full border-none bg-inherit p-0 focus:border-transparent focus:ring-0'
          onChange={event => {
            screenWidth >= 900 ? setId(event.target.value) : setValue(event.target.value);
            setClearedFilters(false);
            setInputValue(event.target.value);
          }}
          onKeyUp={event => {
            if (event.keyCode === 13) {
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
    setCollectionPageAppliedFilters('', id_nftName, false);
  };

  return (
    <>
      <div className='flex w-full flex-col'>
        <div
          className='flex w-full cursor-pointer justify-end p-5 minlg:hidden'
          onClick={() => {
            setSearchModalOpen(false, 'collectionFilters');
          }}
        >
          <X className='hover:cursor-pointer' size={32} color='black' weight='bold' />
        </div>
        <div className='block self-start px-4 font-noi-grotesk text-4xl font-black minlg:hidden'>Filter</div>
        <div className='my-7 flex flex-col px-4'>
          <div className='mb-4 self-start font-noi-grotesk text-xl font-black'>Search for NFTs</div>
          <IdFilter
            setId={setId}
            clearedFilters={clearedFilters}
            setClearedFilters={setClearedFilters}
            id_nftName={id_nftName}
            screenWidth={screenWidth}
            setInputValue={setInputValue}
          />
        </div>
        <div
          onClick={() => {
            setInputValue('');
            setClearedFilters(true);
            setSearchModalOpen(false, 'collectionFilters');
            setCollectionPageAppliedFilters('', '', false);
          }}
          className='cursor-pointer self-start px-4 font-noi-grotesk text-xl font-black text-blog-text-reskin'
        >
          Clear filter
        </div>
        <span className='mt-10 px-5 text-xs text-gray-400 minlg:hidden'>Press enter for results</span>
        <div className='mx-auto mt-9 flex w-full justify-center px-4 font-medium minlg:hidden minxl:w-1/4'>
          <Button
            size={ButtonSize.LARGE}
            scaleOnHover
            stretch={true}
            label={'Filter'}
            onClick={() => {
              setCollectionPageAppliedFilters('', inputValue, false);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>
  );
};
