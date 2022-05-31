import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { tw } from 'utils/tw';

import { ProfileEditGalleryContext } from './ProfileEditGalleryContext';

import { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface MintedProfileInfoProps {
  profileURI: string;
  userIsAdmin: boolean;
}

export function MintedProfileInfo(props: MintedProfileInfoProps) {
  const { profileURI, userIsAdmin } = props;
  
  const { profileData } = useProfileQuery(profileURI);
  const { alwaysBlack } = useThemeColors();
  const { editMode, draftBio, setDraftBio } = useContext(ProfileEditGalleryContext);

  return (
    <div className="flex items-center my-6 mx-4 w-full md:flex-col">
      <div className="flex flex-col w-full">
        <div className={tw(
          'font-bold lg:text-2xl text-4xl text-primary-txt dark:text-primary-txt-dk md:text-center md:mb-4'
        )}>
            @{profileURI}
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