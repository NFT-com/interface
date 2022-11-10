import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { ProfileLayoutType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUser } from 'hooks/state/useUser';
import useCopyClipboard from 'hooks/useCopyClipboard';
import useDebounce from 'hooks/useDebounce';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { Doppler, getEnv } from 'utils/env';
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

export interface ProfileMenuProps {
  profileURI: string;
}

export function ProfileMenu({ profileURI } : ProfileMenuProps) {
  const router = useRouter();
  const [, staticCopy] = useCopyClipboard();
  const { user } = useUser();
  const { profileData } = useProfileQuery(profileURI);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showDescriptions, setShowDescriptions] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 1000);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClickAlerter(inputRef, () => {
    setSearchVisible(false);
  });

  const {
    setEditMode,
    setLayoutType,
    setDescriptionsVisible
  } = useContext(ProfileContext);

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
    <div className='w-full flex justify-end mt-8 minlg:mt-0 font-noi-grotesk'>
     
      <div className={tw(
        'w-full flex flex-row border-[#ECECEC] rounded-full justify-center items-center',
        'focus-within:border focus-within:border-[#F9D54C] focus-within:ring-1 focus-within:ring-[#F9D54C] ',
        searchVisible ? 'w-full minlg:w-[320px] minlg:max-w-[320px]  p-[10px] border-[1.3px] transition-[width]' : 'w-0 p-0 border-0'
      )}>
        <input
          ref={inputRef}
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
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <X color='black'
          className='hover:cursor-pointer'
          onClick={() => {
            setSearchVisible(false);
            setSearchValue('');
          }} />
      </div>
        
      <div className={tw(
        'flex flex-row space-x-1 minlg:space-x-3',
        searchVisible && 'hidden minlg:flex'
      )}>
        <div onClick={() => setSearchVisible(true)} className={tw(
          'w-10 h-10 minlg:w-12 minlg:h-12 rounded-full',
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
                options={[
                  {
                    label: 'Settings',
                    onSelect: () => router.push('/app/settings'),
                    icon: null
                  },
                  {
                    label: 'Edit Profile',
                    onSelect: () => setEditMode(true),
                    icon: null
                  },
                  {
                    label: `${showDescriptions ? 'Hide' : 'Show'} Descriptions`,
                    onSelect: () => setDescriptions(!showDescriptions),
                    icon: null,
                  }
                ]
                }>
                <div className='w-10 h-10 minlg:w-12 minlg:h-12 rounded-full flex justify-center items-center border border-[#ECECEC] hover:cursor-pointer'>
                  <GearIcon className={tw(
                    'w-[18px] h-[18px] minlg:h-5 minlg:w-5'
                  )} />
                </div>
              </DropdownPickerModal>
            </>
        }
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
      </div>
    </div>
  );
}
