import { useContext } from 'react';

import CustomTooltip from 'components/elements/CustomTooltip';
import LikeCount from 'components/elements/LikeCount';
import { LikeableType } from 'graphql/generated/types';
import { useNftLikeQuery } from 'graphql/hooks/useNFTLikeQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { tw } from 'utils/tw';

import GK from 'public/icons/Badge_Key.svg?svgr';

import { ProfileContext } from './ProfileContext';
import { ProfileMenu } from './ProfileMenu';

export interface MintedProfileInfoProps {
  profileURI: string;
  userIsAdmin: boolean;
}

export function MintedProfileInfo(props: MintedProfileInfoProps) {
  const { profileURI, userIsAdmin } = props;
  const { user } = useUser();
  const { profileData } = useProfileQuery(profileURI);
  const { nftProfile } = useAllContracts();
  const { data: profileLikeData, mutate: mutateProfileLikeData } = useNftLikeQuery(
    nftProfile.address,
    profileData?.profile?.tokenId
  );
  const { editMode, draftBio, setDraftBio, draftGkIconVisible } = useContext(ProfileContext);

  const isOwnerAndSignedIn = userIsAdmin && user?.currentProfileUrl === props.profileURI;

  const handleBioChange = event => {
    let bioValue = event.target.value;
    if (bioValue.length === 0) {
      bioValue = '';
    }
    setDraftBio(bioValue);
  };
  return (
    <div
      className={tw(
        'flex w-full flex-col text-primary-txt dark:text-primary-txt-dk',
        'mt-[-25px] px-4 font-noi-grotesk minlg:mb-12 minlg:mt-[-50px] minlg:px-20'
      )}
    >
      <div
        className={tw(
          'flex w-full items-center',
          `${editMode && (draftGkIconVisible ?? profileData?.profile?.gkIconVisible) ? '' : ''}`,
          'justify-start minlg:mt-3 minlg:justify-between'
        )}
      >
        <div className='flex items-end'>
          <div
            id='MintedProfileNameContainer'
            className={tw(
              'flex items-center space-x-2 text-center text-primary-txt dark:text-primary-txt-dk minmd:mt-4 minlg:text-left'
            )}
          >
            <div className='text-lg font-bold minlg:text-[44px] minlg:font-medium'>
              <span className='mr-1 bg-gradient-to-r from-[#FF9B37] to-[#FAC213] bg-clip-text text-2xl text-transparent minlg:text-[40px]'>
                /
              </span>
              {profileURI}
            </div>
            {profileData?.profile?.isGKMinted && (
              <div className='ml-2 h-5 w-5 minlg:h-7 minlg:w-7'>
                <GK />
              </div>
            )}
            <LikeCount
              count={profileLikeData?.likeCount}
              isLiked={profileLikeData?.isLikedBy}
              mutate={mutateProfileLikeData}
              likeData={{
                id: profileData?.profile?.id,
                type: LikeableType.Profile,
                profileName: profileData?.profile?.url
              }}
            />
          </div>
        </div>

        <div className='hidden minlg:block'>
          <ProfileMenu profileURI={profileURI} />
        </div>
      </div>

      {profileData?.profile?.description && !editMode && isOwnerAndSignedIn && (
        <div className='flex w-full flex-col items-end text-[#6A6A6A] minlg:w-1/2'>
          <div className={tw('m-2 -ml-1 w-full break-words px-2 py-1 text-[#6A6A6A]')}>
            {profileData?.profile?.description}
          </div>
        </div>
      )}

      {profileData?.profile?.description && !isOwnerAndSignedIn && !editMode && (
        <div className='flex w-full flex-col items-start text-[#6A6A6A] minlg:w-1/2'>
          <div className={tw('m-2 -ml-1 break-words px-2 py-1 text-[#6A6A6A]')}>
            {profileData?.profile?.description}
          </div>
        </div>
      )}

      {editMode && userIsAdmin && (
        <div className={tw('group flex w-full flex-col text-[#6A6A6A] minlg:w-1/2', 'items-start')}>
          <CustomTooltip
            orientation='top'
            useFullWidth
            tooltipComponent={
              <div className='w-max'>
                <p>Update your bio</p>
              </div>
            }
          >
            <textarea
              className={tw(
                'w-full resize-none',
                'm-2 -ml-1 h-32 rounded-xl px-2 py-1 text-left',
                'mt-3 border-2 border-[#ECECEC] text-[#6A6A6A]',
                'hover:outline-3 hover:cursor-pointer focus:cursor-auto focus:border-[#F9D54C] focus:ring-0'
              )}
              maxLength={300}
              placeholder='Enter bio (optional)'
              value={draftBio ?? profileData?.profile?.description ?? ''}
              onChange={e => {
                handleBioChange(e);
              }}
            />
          </CustomTooltip>
          <div className='flex w-full space-x-2 text-sm font-medium text-gray-900 dark:text-white'>
            <span className='hidden text-[#E4BA18] group-focus-within:block'>Brief description for your profile.</span>
            <p>{draftBio ? 300 - draftBio.length : '0'} / 300</p>
          </div>
        </div>
      )}

      <div className='block minlg:hidden'>
        <ProfileMenu profileURI={profileURI} />
      </div>
    </div>
  );
}
