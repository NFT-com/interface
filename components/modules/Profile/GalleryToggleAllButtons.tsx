
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

import Hidden from 'public/Hidden.svg';
import Visible from 'public/Visible.svg';
import { useContext } from 'react';
import { Eye, EyeOff } from 'react-feather';

export interface GalleryToggleAllButtonsProps {
  onShowAll: () => void;
  onHideAll: () => void;
  publicNFTCount: number;
}

export function GalleryToggleAllButtons(props: GalleryToggleAllButtonsProps) {
  const { hideAllNFTsValue, showAllNFTsValue, publiclyVisibleNftCount, allOwnerNftCount } = useContext(ProfileContext);
  return <div className='flex text-black dark:text-white'>
    <div
      className={tw(
        'flex mr-4 items-center cursor-pointer',
        (publiclyVisibleNftCount == allOwnerNftCount && !hideAllNFTsValue) || showAllNFTsValue ? getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'text-[#F9D54C]' : 'text-link' : ''
      )}
      onClick={props.onShowAll}
    >
      {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
        <Visible className={tw(
          'w-7 h-6 text-black fill-black'
        )} />
        :
        <Eye size={16} className="mr-2" />
      }
      Show All
    </div>
    <div
      className={tw(
        'flex items-center cursor-pointer',
        hideAllNFTsValue ? getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'text-[#F9D54C]' : 'text-link' : ''
      )}
      onClick={props.onHideAll}
    >
      {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
        <Hidden className={tw(
          'w-7 h-6 text-black fill-black'
        )} />
        :
        <EyeOff size={16} className="mr-2" />
      }
      Hide All
    </div>
  </div>;
}