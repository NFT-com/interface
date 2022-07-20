import { CheckBox } from 'components/elements/CheckBox';
import { Switch } from 'components/elements/Switch';
import { useGallery } from 'hooks/state/useGallery';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import SearchIcon from 'public/search.svg';
import { useState } from 'react';

export interface GenesisKeyGalleryFiltersProps {
  showFilters: boolean;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}

export function GenesisKeyGalleryFilters(props: GenesisKeyGalleryFiltersProps) {
  const { galleryShowMyStuff: showMyStuff, galleryItemType, setGalleryItemType, setGalleryShowMyStuff } = useGallery();
  const { type } = useRouter().query;

  const [initLoad, setInitLoad] = useState(true);

  if(type === 'profile' && initLoad) {
    setGalleryItemType('profile');
    setInitLoad(false);
  }

  return (
    <>
      <span className='text-4xl deprecated_md:text-2xl'>Filter</span>
      <div className='w-full mt-4 dark border-b border-accent-border-dk py-4'>
        <Switch
          left="Genesis Keys"
          right="Profiles"
          enabled={galleryItemType === 'profile'}
          setEnabled={(enabled: boolean) => {
            (type === 'profile' && !enabled) ? setGalleryItemType('gk') : setGalleryItemType(enabled ? 'profile' : 'gk');
          }}
        />
      </div>
      <div className={tw(
        'w-full flex items-center py-8',
        'border-b border-accent-border-dk'
      )}>
        <CheckBox
          checked={showMyStuff}
          onToggle={(selected: boolean) => {
            setGalleryShowMyStuff(selected);
          }}
        />
        <span
          onClick={() => {
            setGalleryShowMyStuff(!showMyStuff);
          }}
          className='text-base ml-2 cursor-pointer'
        >
          Show My Assets
        </span>
      </div>
      {galleryItemType === 'gk' &&
        <div className='flex w-full dark py-4 items-center border-b border-accent-border-dk'>
          <SearchIcon className='w-6 h-6 mr-2 shrink-0 aspect-square' />
          <input
            className={tw(
              'text-lg deprecated_md:text-lg min-w-0 block',
              'text-left px-3 py-3 w-[70%] rounded-lg font-medium',
              'text-white bg-transparent shrink-0'
            )}
            placeholder="Filter by ID number"
            value={props.currentFilter}
            spellCheck={false}
            onChange={async e => {
              const validReg = /^[0-9]*$/;
              if (
                validReg.test(e.target.value.toLowerCase()) && e.target.value.length <= 5
              ) {
                props.setCurrentFilter(e.target.value.toLowerCase());
              }
            }}
          />
          {Number(props?.currentFilter) > 10000 &&
              <span className="min-w-0 block text-left w-[30%] text-red-1">Invalid ID.</span>
          }
        </div>
      }
    </>
  );
}