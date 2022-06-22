import { Switch } from 'components/elements/Switch';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
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
  const { editMode, draftBio, setDraftBio, setDraftGkIconVisible, draftGkIconVisible } = useContext(ProfileEditContext);
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(account?.address);

  const handleBioChange = (event) => {
    let bioValue = event.target.value;
    if(bioValue.length === 0) {
      bioValue = '';
    }
    setDraftBio(bioValue);
  };

  return (
    <div className="flex items-center my-6 mx-4 w-full md:flex-col">
      <div className="flex flex-col w-full">
        <div className={tw('flex w-full justify-around items-center', `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : 'pr-12'}`)}>
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
          {(draftGkIconVisible ?? profileData?.profile?.gkIconVisible) && <GKHolderIcon className="ml-2 w-8 h-8 mr-2 shrink-0 aspect-square" />}
        </div>
        {profileData?.profile?.description &&
          <div className={tw(
            'flex items-center mt-2.5 text-sm text-primary-txt dark:text-primary-txt-dk max-w-lg justify-center'
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
                handleBioChange(e);
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