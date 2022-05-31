import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { tw } from 'utils/tw';

import { NftGallery, PROFILE_GALLERY_PAGE_SIZE } from './NftGallery';
import { ProfileEditGalleryContext } from './ProfileEditGalleryContext';

import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Eye, EyeOff } from 'react-feather';
import { useAccount } from 'wagmi';

export interface MintedProfileGalleryProps {
  profileURI: string;
}

export function MintedProfileGallery(props: MintedProfileGalleryProps) {
  const {
    editMode,
    onShowAll,
    onHideAll,
    saveProfile,
    draftShowAll,
    draftHideAll,
    draftToShow
  } = useContext(ProfileEditGalleryContext);
  const [updated, setUpdated] = useState(0);
  const [currentUpdate, setCurrentUpdate] = useState(0);
  
  const { data: account } = useAccount();
  const { profileData } = useProfileQuery(props.profileURI);
  const { totalItems: publicNFTCount } = useProfileNFTsQuery(
    profileData?.profile?.id,
    false,
    { first: PROFILE_GALLERY_PAGE_SIZE }
  );

  useEffect(() => {
    if (updated !== currentUpdate) {
      saveProfile();
      setCurrentUpdate(updated);
    }
  }, [updated, currentUpdate, saveProfile]);

  return (
    <div className={tw(
      'flex flex-col mt-8 align-items', isMobile ? 'px-2' : 'sm:px-2 md:px-12 lg:px-20 px-32')}>
      {editMode && <div className='flex items-center w-full mb-12 px-8 justify-end text-white'>
        <div
          className={tw(
            'flex mr-4 items-center cursor-pointer',
            draftShowAll ? 'text-link' : ''
          )}
          onClick={() => {
            onShowAll();
            analytics.track('Show All NFTs', {
              ethereumAddress: account?.address,
              profile: props.profileURI
            });
            setUpdated(updated + 1);
          }}
        >
          <Eye size={16} className="mr-2" />
          Show All
        </div>
        <div
          className={tw(
            'flex items-center cursor-pointer',
            draftHideAll || (publicNFTCount === 0 && draftToShow?.size === 0) ? 'text-link' : ''
          )}
          onClick={() => {
            onHideAll();
            analytics.track('Hide All NFTs', {
              ethereumAddress: account?.address,
              profile: props.profileURI
            });
            setUpdated(updated + 1);
          }}
        >
          <EyeOff size={16} className="mr-2" />
          Hide All
        </div>
      </div>}
      {/* TODO: show CollectionGallery here if the profile's display mode is "collection" */}
      
      <NftGallery profileURI={props.profileURI} />
    </div>
  );
}