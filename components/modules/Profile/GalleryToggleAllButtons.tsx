import { useContext } from 'react';

import { tw } from 'utils/tw';

import Hidden from 'public/icons/Hidden.svg?svgr';
import Visible from 'public/icons/Visible.svg?svgr';

import { ProfileContext } from './ProfileContext';

export interface GalleryToggleAllButtonsProps {
  onShowAll: () => void;
  onHideAll: () => void;
  publicNFTCount: number;
}

export function GalleryToggleAllButtons(props: GalleryToggleAllButtonsProps) {
  const { hideAllNFTsValue, showAllNFTsValue, publiclyVisibleNftCount, allOwnerNftCount } = useContext(ProfileContext);
  return (
    <div className='flex text-black dark:text-white'>
      <div
        className={tw(
          'mr-4 flex cursor-pointer items-center',
          (publiclyVisibleNftCount === allOwnerNftCount && !hideAllNFTsValue) || showAllNFTsValue
            ? 'text-[#F9D54C]'
            : ''
        )}
        onClick={props.onShowAll}
      >
        <Visible className={tw('h-6 w-7 fill-black text-black')} />
        Show All
      </div>
      <div
        className={tw('flex cursor-pointer items-center', hideAllNFTsValue ? 'text-[#F9D54C]' : '')}
        onClick={props.onHideAll}
      >
        <Hidden className={tw('h-6 w-7 fill-black text-black')} />
        Hide All
      </div>
    </div>
  );
}
