import { Button, ButtonType } from 'components/elements/Button';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileEditContext } from './ProfileEditContext';

import GKHolderIcon from 'public/gk-holder.svg';
import { useContext } from 'react';
import { useThemeColors } from 'styles/theme//useThemeColors';
import { useAccount } from 'wagmi';

export interface MintedProfileInfoProps {
  profileURI: string;
  userIsAdmin: boolean;
}

export function MintedProfileInfo(props: MintedProfileInfoProps) {
  const { profileURI, userIsAdmin } = props;
  const { data: account } = useAccount();
  
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
    clearDrafts
  } = useContext(ProfileEditContext);
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(account?.address);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);

  const { mutate: mutateMyNFTs } = useMyNFTsQuery(20);
      
  const { mutate: mutateProfileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    // this query is only used to determine if the profile has any nfts, so we don't need to track the page info.
    // however, we should still fetch the full first page for caching purposes.
    20
  );
  
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
      'xs:my-0 xs:mx-0 xs:mb-16 xs:-mt-10 sm:-mt-14 my-4 sm:mx-0 lg:mx-8 px-4',
      'xs:w-full sm:w-4/5 lg:w-3/5 w-full xs:h-32 h-52')}>
      <div className={tw('flex w-full justify-start items-center', `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : 'pr-12'}`)}>
        <div
          id="MintedProfileNameContainer"
          className="font-bold lg:text-2xl text-4xl text-primary-txt dark:text-primary-txt-dk md:text-center mr-4">
            @{profileURI}
        </div>
        {(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) && <GKHolderIcon className="ml-2 w-8 h-8 mr-2 shrink-0 aspect-square" />}
      </div>
      {userIsAdmin && hasGks && (
        editMode ?
          <div
            className="flex mt-6 md:mt-3"
            style={{ zIndex: 49 }}
          >
            <div className='mr-4'>
              <Button
                type={ButtonType.PRIMARY}
                label={'Save'}
                onClick={() => {
                  analytics.track('Update Profile', {
                    ethereumAddress: account?.address,
                    profile: profileURI,
                    newProfile: draftProfileImg?.preview ? true : false,
                    newHeader: draftHeaderImg?.preview ? true : false,
                    newDescription: draftBio,
                  });

                  saveProfile();
                  setEditMode(false);
                  mutateProfileNFTs();
                  mutateMyNFTs();
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
            className="mt-6 md:mt-3"
            style={{ zIndex: 49 }}
          >
            <Button
              type={ButtonType.PRIMARY}
              label={'Edit Profile'}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>)}
      {profileData?.profile?.description &&
          <div className={tw(
            'mt-6 md:mt-3 text-sm text-primary-txt dark:text-primary-txt-dk max-w-[45rem] break-words'
          )}>
            {!editMode && profileData?.profile?.description}
          </div>
      }
      {editMode && userIsAdmin &&
          <div className="max-w-2xl md:max-w-xl sm:max-w-full flex items-end flex flex-col">
            <textarea
              className={tw(
                'text-base w-full resize-none',
                'text-left px-3 py-2 w-full rounded-xl font-medium h-32',
              )}
              maxLength={300}
              placeholder="Enter bio (optional)"
              value={draftBio ?? profileData?.profile?.description}
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
    </div>
  );
}