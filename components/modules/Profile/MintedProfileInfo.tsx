import { Button, ButtonType } from 'components/elements/Button';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import Toast from 'components/elements/Toast';
import { ProfileLayoutType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUser } from 'hooks/state/useUser';
import useCopyClipboard from 'hooks/useCopyClipboard';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { ShareNetwork, TwitterLogo } from 'phosphor-react';
import GKHolderIcon from 'public/gk-holder.svg';
import LinkIcon from 'public/icon_link.svg';
import FeaturedIcon from 'public/layout_icon_featured.svg';
import GridIcon from 'public/layout_icon_grid.svg';
import MosaicIcon from 'public/layout_icon_mosaic.svg';
import SpotlightIcon from 'public/layout_icon_spotlight.svg';
import GearIcon from 'public/settings_icon.svg';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useThemeColors } from 'styles/theme//useThemeColors';
import { useAccount } from 'wagmi';

export interface MintedProfileInfoProps {
  profileURI: string;
  userIsAdmin: boolean;
}

export function MintedProfileInfo(props: MintedProfileInfoProps) {
  const router = useRouter();
  const [, staticCopy] = useCopyClipboard();
  const { profileURI, userIsAdmin } = props;
  const { address: currentAddress } = useAccount();
  const { user, setCurrentProfileUrl } = useUser();
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);
  const { profileData } = useProfileQuery(profileURI);
  const { alwaysBlack } = useThemeColors();
  const {
    editMode,
    draftBio,
    setDraftBio,
    draftGkIconVisible,
    draftProfileImg,
    draftHeaderImg,
    saveProfile,
    setEditMode,
    clearDrafts,
    setLayoutType,
    setDescriptionsVisible
  } = useContext(ProfileContext);

  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showDescriptions, setShowDescriptions] = useState(null);

  const setLayout = useCallback((type: ProfileLayoutType) => {
    setSelectedLayout(type);
    setLayoutType(type);
  }, [setLayoutType]);

  const setDescriptions = useCallback((isVisible: boolean) => {
    setShowDescriptions(isVisible);
    setDescriptionsVisible(isVisible);
  }, [setDescriptionsVisible]);

  useEffect(() => {
    setSelectedLayout(profileData?.profile?.layoutType);
    setShowDescriptions(profileData?.profile?.nftsDescriptionsVisible || profileData?.profile?.nftsDescriptionsVisible === null ? true : false);
  }, [profileData]);

  const layoutOptions = [
    {
      name: 'Default',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Default),
      icon: <GridIcon className={tw(
        'w-[18px] h-[18px]'
      )} />
    },
    {
      name:'Featured',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Featured),
      icon: <FeaturedIcon className={tw(
        'w-[18px] h-[18px]'
      )} />
    },
    {
      name:'Mosaic',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Mosaic),
      icon:  <MosaicIcon className={tw(
        'w-[18px] h-[18px]'
      )} />
    },
    {
      name: 'Spotlight',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Spotlight),
      icon:  <SpotlightIcon className={tw(
        'w-[18px] h-[18px]'
      )} />
    }
  ];

  const getProfileButton = useCallback(() => {
    if (!userIsAdmin || !hasGks || getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED)) {
      return null;
    }
    
    if (user?.currentProfileUrl !== props.profileURI) {
      return (
        <div
          className='mt-3 minlg:mt-6'
        >
          <Button
            type={ButtonType.PRIMARY}
            label={'Switch'}
            onClick={() => {
              setCurrentProfileUrl(props.profileURI);
            }}
          />
        </div>
      );
    }

    return editMode ?
      <div
        className="flex mt-3 minlg:mt-6"
        style={{ zIndex: 49 }}
      >
        <div className='mr-4'>
          <Button
            type={ButtonType.PRIMARY}
            label={'Save'}
            onClick={() => {
              analytics.track('Update Profile', {
                ethereumAddress: currentAddress,
                profile: profileURI,
                newProfile: draftProfileImg?.preview ? true : false,
                newHeader: draftHeaderImg?.preview ? true : false,
                newDescription: draftBio,
              });

              saveProfile();
              setEditMode(false);
            }}
          />
        </div>
        <Button
          type={ButtonType.SECONDARY}
          label={'Cancel'}
          onClick={clearDrafts}
        />
      </div> :
      <div
        className="flex items-center mt-3 minlg:mt-6 "
        style={{ zIndex: 49 }}
      >
        <div>
          <Button
            type={ButtonType.PRIMARY}
            label={'Edit Profile'}
            onClick={() => {
              setEditMode(true);
            }}
          />
        </div>
      </div>;
  }, [clearDrafts, currentAddress, draftBio, draftHeaderImg?.preview, draftProfileImg?.preview, editMode, hasGks, profileURI, props.profileURI, saveProfile, setCurrentProfileUrl, setEditMode, user?.currentProfileUrl, userIsAdmin]);
  
  const handleBioChange = (event) => {
    let bioValue = event.target.value;
    if(bioValue.length === 0) {
      bioValue = '';
    }
    setDraftBio(bioValue);
  };
  return (
    <div className={tw(
      'flex flex-col w-full text-primary-txt dark:text-primary-txt-dk',
      getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
        'mt-[-25px] px-4 font-noi-grotesk' :
        'my-0 minmd:my-4 mx-0 minxl:mx-8 mb-16 minmd:mb-0 px-4 w-4/5 minxl:w-3/5 minmd:min-h-52 min-h-32'
    )}
    >
      <Toast />
      <div className={tw('flex w-full justify-start items-center', `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : 'pr-12'}`)}>
        <div
          id="MintedProfileNameContainer"
          className={tw(
            getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'font-bold text-lg' :'font-bold text-2xl minxl:text-4xl',
            'text-primary-txt dark:text-primary-txt-dk text-center minlg:text-left mr-4 minmd:mt-4'
          )}>
          {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && <span className='bg-gradient-to-r from-[#FF9B37] to-[#FAC213] text-transparent bg-clip-text text-2xl'>/</span> } {profileURI}
        </div>
        {(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && <GKHolderIcon className="ml-2 w-8 h-8 mr-2 shrink-0 aspect-square" />}
      </div>
      {getProfileButton()}
      {profileData?.profile?.description &&
          <div className={tw(
            getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
              'mt-4 text-[#6A6A6A] break-words' :
              'mt-3 minlg:mt-6 text-sm text-primary-txt dark:text-primary-txt-dk max-w-[45rem] break-words'
          )}>
            {!editMode && profileData?.profile?.description}
          </div>
      }
      {editMode && userIsAdmin &&
          <div className="max-w-full minmd:max-w-xl minxl:max-w-2xl flex items-end flex-col">
            <textarea
              className={tw(
                'text-base w-full resize-none mt-4',
                'text-left px-3 py-2 w-full rounded-xl font-medium h-32',
              )}
              maxLength={300}
              placeholder="Enter bio (optional)"
              value={draftBio ?? profileData?.profile?.description ?? ''}
              onChange={e => {
                handleBioChange(e);
              }}
              style={{
                color: alwaysBlack,
              }}
            />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {draftBio ? 300 - draftBio.length : '0' } / 300
            </div>
          </div>
      }
      {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) &&
        <div className='block minlg:hidden'>
          <ProfileMenu profileURI={profileURI} />
        </div>
      }
    </div>
  );
}