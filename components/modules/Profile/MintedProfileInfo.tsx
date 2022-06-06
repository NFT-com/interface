import { Button, ButtonType } from 'components/elements/Button';
import { Switch } from 'components/elements/Switch';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileEditContext } from './ProfileEditContext';

import GKHolderIcon from 'public/gk-holder.svg';
import { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
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
    setEditMode,
    clearDrafts,
    saveProfile,
    editMode,
    draftBio,
    setDraftBio,
    setDraftGkIconVisible,
    draftGkIconVisible,
    draftProfileImg,
    draftHeaderImg,
  } = useContext(ProfileEditContext);
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { mutate: mutateProfileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    // this query is only used to determine if the profile has any nfts, so we don't need to track the page info.
    // however, we should still fetch the full first page for caching purposes.
    20
  );
  const { mutate: mutateMyNFTs } = useMyNFTsQuery(20);

  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);

  return (
    <div className="flex items-center my-6 mx-4 md:mx-0 w-full md:flex-col">
      <div className="flex flex-col w-full">
        <div className={tw('flex w-full items-center', `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : 'pr-12'}`)}>
          <div className={tw(
            'font-bold lg:text-2xl text-4xl text-primary-txt dark:text-primary-txt-dk md:text-center md:mb-4 mr-4',
          )}>
            @{profileURI}
          </div>
          {editMode && ownedGenesisKeyTokens.length > 0 && <Switch
            left="Hide GK Icon"
            right="Show GK Icon"
            enabled={draftGkIconVisible ?? profileData?.profile?.gkIconVisible}
            setEnabled={() => {
              setDraftGkIconVisible(!(draftGkIconVisible ?? profileData?.profile?.gkIconVisible));
            }}
          />}
          {(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) &&
            <GKHolderIcon className="ml-2 w-8 h-8 mr-2 shrink-0 aspect-square relative" />
          }
        </div>
        {userIsAdmin && hasGks && (
          editMode ?
            <div className={tw('flex mt-4')} style={{ zIndex: 49 }} >
              <Button
                type={ButtonType.SECONDARY}
                label={'Cancel'}
                onClick={clearDrafts}
              />
              <div className='ml-4'>
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
            </div> :
            <div style={{ zIndex: 49 }} className="mt-4">
              <Button
                type={ButtonType.PRIMARY}
                label={'Edit Profile'}
                onClick={() => {
                  setEditMode(true);
                }}
              />
            </div>
        )}
        {profileData?.profile?.description &&
          <div className={tw(
            'flex items-center mt-8 text-base text-primary-txt dark:text-primary-txt-dk max-w-lg'
          )}>
            {!editMode && profileData?.profile?.description}
          </div>
        }
        {editMode && userIsAdmin &&
          <div className="max-w-2xl mt-2.5 md:max-w-xl sm:max-w-full flex items-center">
            <input
              type="text"
              className={tw(
                'text-base w-full',
                'text-left px-3 py-2 w-full rounded-xl font-medium',
              )}
              placeholder="Enter bio (optional)"
              value={draftBio}
              onChange={e => {
                setDraftBio(e.target.value);
              }}
              style={{
                color: alwaysBlack,
              }}
            />
          </div>
        }
      </div>
    </div>
  );
}