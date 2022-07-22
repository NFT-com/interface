
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

import { useContext } from 'react';
import { Eye, EyeOff } from 'react-feather';

export interface GalleryToggleAllButtonsProps {
  onShowAll: () => void;
  onHideAll: () => void;
  publicNFTCount: number;
}

export function GalleryToggleAllButtons(props: GalleryToggleAllButtonsProps) {
  const { publiclyVisibleNfts } = useContext(ProfileContext);
  return <div className='flex'>
    <div
      className={tw(
        'flex mr-4 items-center cursor-pointer',
      )}
      onClick={props.onShowAll}
    >
      <Eye size={16} className="mr-2" />
      Show All
    </div>
    <div
      className={tw(
        'flex items-center cursor-pointer',
        (props.publicNFTCount === 0 && publiclyVisibleNfts?.length === 0) ? 'text-link' : ''
      )}
      onClick={props.onHideAll}
    >
      <EyeOff size={16} className="mr-2" />
      Hide All
    </div>
  </div>;
}