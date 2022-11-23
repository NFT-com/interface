import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { ProfileLayoutType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUser } from 'hooks/state/useUser';
import useCopyClipboard from 'hooks/useCopyClipboard';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { ShareNetwork, TwitterLogo, X } from 'phosphor-react';
import LinkIcon from 'public/icon_link.svg';
import FeaturedIcon from 'public/layout_icon_featured.svg';
import GridIcon from 'public/layout_icon_grid.svg';
import MosaicIcon from 'public/layout_icon_mosaic.svg';
import SpotlightIcon from 'public/layout_icon_spotlight.svg';
import GearIcon from 'public/settings_icon.svg';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export interface ProfileMenuProps {
  profileURI: string;
}

export function ProfileMenu({ profileURI } : ProfileMenuProps) {
  const { address: currentAddress } = useAccount();
  const router = useRouter();
  const [, staticCopy] = useCopyClipboard();
  const { user } = useUser();
  const { profileData } = useProfileQuery(profileURI);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showDescriptions, setShowDescriptions] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const inputRef = useRef();

  useOutsideClickAlerter(inputRef, () => {
    searchQuery === '' && setSearchVisible(false);
  });

  const {
    setEditMode,
    setLayoutType,
    setDescriptionsVisible,
    searchQuery,
    setSearchQuery,
    editMode,
    saveProfile,
    draftProfileImg,
    draftHeaderImg,
    draftBio,
    clearDrafts,
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible
  } = useContext(ProfileContext);

  const setLayout = useCallback((type: ProfileLayoutType) => {
    setSelectedLayout(type);
    setLayoutType(type);
  }, [setLayoutType]);

  const setDescriptions = useCallback((isVisible: boolean) => {
    setShowDescriptions(isVisible);
    setDescriptionsVisible(isVisible);
    setDraftNftsDescriptionsVisible(isVisible);
  }, [setDescriptionsVisible, setDraftNftsDescriptionsVisible]);

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
        'w-[18px] h-[18px] minlg:w-5 minlg:h-5'
      )} />
    },
    {
      name:'Featured',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Featured),
      icon: <FeaturedIcon className={tw(
        'w-[15px] h-[15px]'
      )} />
    },
    {
      name:'Mosaic',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Mosaic),
      icon:  <MosaicIcon className={tw(
        'w-[18px] h-[18px] minlg:w-5 minlg:h-5'
      )} />
    },
    {
      name: 'Spotlight',
      label: '',
      onSelect: () => setLayout(ProfileLayoutType.Spotlight),
      icon:  <SpotlightIcon className={tw(
        'w-[18px] h-[18px] minlg:w-5 minlg:h-5'
      )} />
    }
  ];

  return (
    <div className='w-full flex justify-end mt-5 minlg:mt-0 font-noi-grotesk'>
      <div ref={inputRef} className={tw(
        'w-full flex flex-row border-[#ECECEC] rounded-full justify-center items-center',
        'focus-within:border focus-within:border-[#F9D54C] focus-within:ring-1 focus-within:ring-[#F9D54C] ',
        searchVisible ? 'w-full minlg:w-[320px] minlg:max-w-[320px]  p-[10px] border-[1.3px] transition-[width]' : 'w-0 p-0 border-0'
      )}>
        <input
          type="text"
          placeholder="Search your NFTs.."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          maxLength={512}
          className={tw(
            'w-full text-black placeholder:text-black bg-inherit border-0 rounded-full py-0 pr-0 pl-2',
            'focus:border-0 focus:ring-0 focus:placeholder:text-[#B2B2B2]'
          )}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <X color='black'
          className='hover:cursor-pointer'
          onClick={() => {
            setSearchVisible(false);
            setSearchQuery('');
          }} />
      </div>
        
      <div className={tw(
        'flex flex-row items-center space-x-1 minlg:space-x-3',
        searchVisible && 'hidden minlg:flex'
      )}>
        <div onClick={() => setSearchVisible(true)} className={tw(
          'w-10 h-10 minlg:w-12 minlg:h-12 rounded-full px-2.5 minlg:px-3.5',
          'flex justify-center items-center border border-[#ECECEC] hover:cursor-pointer',
          searchVisible && 'minlg:hidden'
        )}>
          <SearchIcon className='font-medium h-[18px] minlg:h-5' color='#0F0F0F' />
        </div>
        {user?.currentProfileUrl === profileURI &&
            <>
              <DropdownPickerModal
                pointer
                align='center'
                constrain
                stopMobileModal
                disableMinWidth
                disablePadding
                selectedIndex={selectedLayout ? layoutOptions.findIndex(item => item.name === selectedLayout) : 0}
                options={layoutOptions}
              >
                <div className='w-10 h-10 minlg:w-12 minlg:h-12 rounded-full flex justify-center items-center border border-[#ECECEC] hover:cursor-pointer'>
                  {selectedLayout ? layoutOptions.filter(item => item?.name === selectedLayout)[0]?.icon : layoutOptions[0]?.icon}
                </div>
              </DropdownPickerModal>

              <DropdownPickerModal
                pointer
                constrain
                stopMobileModal
                disableMinWidth
                disablePadding
                align='center'
                selectedIndex={0}
                options={filterNulls([
                  {
                    label: 'Settings',
                    onSelect: () => router.push('/app/settings'),
                    icon: null
                  },
                  !editMode &&
                  {
                    label: 'Edit Profile',
                    onSelect: () => setEditMode(true),
                    icon: null,
                    closeModalOnClick: true
                  },
                  {
                    label: `${showDescriptions ? 'Hide' : 'Show'} Descriptions`,
                    onSelect: editMode ? () => setDraftNftsDescriptionsVisible(!draftNftsDescriptionsVisible) : () => setDescriptions(!showDescriptions),
                    icon: null,
                  }
                ])
                }>
                <div className='w-10 h-10 minlg:w-12 minlg:h-12 rounded-full flex justify-center items-center border border-[#ECECEC] hover:cursor-pointer'>
                  <GearIcon className={tw(
                    'w-[18px] h-[18px] minlg:h-5 minlg:w-5'
                  )} />
                </div>
              </DropdownPickerModal>

              {editMode &&
              <div className='fixed minlg:relative bottom-0 left-0 bg-white minlg:bg-transparent flex w-full py-5 px-3 space-x-4 shadow-[0_-16px_32px_rgba(0,0,0,0.08)] minlg:shadow-none z-50'
              >
                <button
                  type="button"
                  className={tw(
                    'flex w-full justify-center items-center',
                    'rounded-[10px] border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                    'px-4 py-2 font-medium text-black whitespace-nowrap',
                    'focus:outline-none focus-visible:bg-[#E4BA18]',
                    'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
                  )}
                  onClick={() => {
                    analytics.track('Update Profile', {
                      ethereumAddress: currentAddress,
                      profile: profileURI,
                      newProfile: draftProfileImg?.preview ? true : false,
                      newHeader: draftHeaderImg?.preview ? true : false,
                      newDescription: draftBio,
                    });
      
                    saveProfile();
                    setTimeout(() => {
                      setEditMode(false);
                    }, 3000);
                  }}
                >
                Save changes
                </button>
                <button
                  type="button"
                  className={tw(
                    'flex w-full justify-center items-center',
                    'rounded-[10px] border border-transparent bg-black hover:bg-[#282828]',
                    'px-4 py-2 font-medium text-white',
                    'focus:outline-none focus-visible:bg-[#E4BA18]',
                    'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
                  )}
                  onClick={clearDrafts}
                >
                Cancel
                </button>
              </div>
              }
            </>
        }
        {!editMode &&
        <DropdownPickerModal
          pointer
          constrain
          stopMobileModal
          disableMinWidth
          disablePadding
          align='right'
          selectedIndex={0}
          options={[
            {
              label: 'Copy link to clipboard',
              onSelect: () => staticCopy(`${getEnv(Doppler.NEXT_PUBLIC_BASE_URL)}${router.query?.profileURI}`),
              icon: <LinkIcon className={tw(
                'w-[18px] h-[18px] mr-3'
              )} />
            },
            {
              label: 'Share via Twitter',
              onSelect: () => window.open('https://twitter.com/share?url='+ `https://www.nft.com/${profileURI}`+`&text=NFT.com Profile for ${profileURI}`, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'),
              icon: <TwitterLogo size={18} className='mr-3' color='#1DA1F2' weight="fill" />
            },
          ]
          }>
          <div className='w-[102px] h-10 minlg:h-12 rounded-full flex items-center px-4 text-sm font-medium border border-[#ECECEC] hover:cursor-pointer'>
            <ShareNetwork size={15} className='mr-1' weight='bold' /> SHARE
          </div>
        </DropdownPickerModal>
        }
      </div>
    </div>
  );
}
