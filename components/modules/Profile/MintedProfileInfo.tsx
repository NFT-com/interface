import { Button, ButtonType } from 'components/elements/Button';
import Toast from 'components/elements/Toast';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUser } from 'hooks/state/useUser';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';
import { ProfileMenu } from './ProfileMenu';

import GKHolderIcon from 'public/gk-holder.svg';
import { useCallback, useContext } from 'react';
import { useThemeColors } from 'styles/theme//useThemeColors';
import { useAccount } from 'wagmi';

export interface MintedProfileInfoProps {
  profileURI: string;
  userIsAdmin: boolean;
}

export function MintedProfileInfo(props: MintedProfileInfoProps) {
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
  } = useContext(ProfileContext);

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
        'mt-[-25px] minlg:mt-[-50px] px-4 minlg:px-20 font-noi-grotesk' :
        'my-0 minmd:my-4 mx-0 minxl:mx-8 mb-16 minmd:mb-0 px-4 w-4/5 minxl:w-3/5 minmd:min-h-52 min-h-32'
    )}
    >
      <Toast />
      <div className={tw('flex w-full items-center',
        `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && 'pr-12'}`,
        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'justify-start minlg:justify-between minlg:mt-3' : 'justify-start'
      )}>
        <div
          id="MintedProfileNameContainer"
          className={tw(
            getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'font-bold text-lg minlg:text-[44px] minlg:font-medium' :'font-bold text-2xl minxl:text-4xl',
            'text-primary-txt dark:text-primary-txt-dk text-center minlg:text-left mr-4 minmd:mt-4'
          )}>
          {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) &&
            <span className='bg-gradient-to-r from-[#FF9B37] to-[#FAC213] text-transparent bg-clip-text text-2xl minlg:text-[40px] minlg:mr-1'>/</span>
          }
          {profileURI}
        </div>
        {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) &&
          <div className='hidden minlg:block'>
            <ProfileMenu profileURI={profileURI} />
          </div>
        }
        {(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && <GKHolderIcon className="ml-2 w-8 h-8 mr-2 shrink-0 aspect-square" />}
      </div>
      {getProfileButton()}
      {profileData?.profile?.description &&
          <div className={tw(
            getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
              'mt-3 text-[#6A6A6A] break-words minlg:w-1/2' :
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