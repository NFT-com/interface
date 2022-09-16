import { SidebarProfileCard } from 'components/modules/Sidebar/SidebarProfileCard';
import { useSidebar } from 'hooks/state/useSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import { XIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { XCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useDisconnect } from 'wagmi';

type LoginResultsProps = {
  profileValue?: string;
  hiddenProfile?: string
};

export default function LoginResults({ profileValue, hiddenProfile }: LoginResultsProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { setSidebarOpen } = useSidebar();
  const { primaryIcon } = useThemeColors();
  const { setSignOutDialogOpen } = useSignOutDialog();
  const { disconnect } = useDisconnect();
  const { setCurrentProfileUrl } = useUser();
  const [allProfiles, setAllProfiles] = useState([]);
  const [profilesToShow, setProfilesToShow] = useState([]);

  useEffect(() => {
    setAllProfiles(myOwnedProfileTokens.sort((a, b) => a.title.localeCompare(b.title)));
  }, [myOwnedProfileTokens]);

  const searchHandler = (query) => {
    setAllProfiles(allProfiles.filter((item) => item?.title?.toLowerCase().includes(query)));
    setProfilesToShow(allProfiles.slice(0, 3));
    if(!allProfiles.length ){
      setAllProfiles(myOwnedProfileTokens.filter((item) => item?.title?.toLowerCase().includes(query)));
    }
    if(query === ''){
      setAllProfiles(myOwnedProfileTokens);
    }
  };

  useEffect(() => {
    setProfilesToShow(allProfiles.slice(0, 3));
  }, [allProfiles]);

  const LoadMoreHandler = () => {
    const currentLength = profilesToShow.length;
    const nextProfiles = allProfiles.slice(currentLength, currentLength + 3);
    setProfilesToShow([...profilesToShow, ...nextProfiles]);
  };

  const exitClickHandler = () => {
    setSignOutDialogOpen(true);
    disconnect();
    setSidebarOpen(false);
    setCurrentProfileUrl('');
  };

  const selectProfileHandler = (url) => {
    setCurrentProfileUrl(url);
  };

  return (
    <motion.div
      layout
      key='sidebarContent'
      className='flex flex-col bg-white h-full dark px-4'
    >
      {isMobile &&
          <motion.div
            key='sidebarMobileXIcon'
            className='flex justify-end pt-6 px-4'
          >
            <XIcon
              color={primaryIcon}
              className="block h-8 w-8 mb-8"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen(false);
              }}
            />
          </motion.div>
      }
      <div className='absolute top-11 right-4 hover:cursor-pointer w-6 h-6 bg-[#F9D963] rounded-full'></div>
      <XCircle onClick={() => exitClickHandler()} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          
      {myOwnedProfileTokens.length > 0 &&
            <h2 className='font-grotesk font-bold text-4xl mb-9 mt-24 tracking-wide'>Select Profile</h2>
      }

      {profileValue !== '' && myOwnedProfileTokens.length > 0 &&
            <p className='text-[#6F6F6F] mb-4 font-grotesk tracking-wide'>We couldn’t find the profile <span className='text-black font-bold'>{profileValue}</span> but we found these.</p>
      }

      {profileValue === '' && myOwnedProfileTokens.length > 0 &&
      <>
        <p className='text-[#6F6F6F] mb-4 tracking-wide'>Good news! We found your profiles.</p>
        <input
          onChange={event => searchHandler(event.target.value.toLowerCase())}
          className="shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 border-[#D5D5D5] placeholder:text-sm"
          id="currentAddress"
          type="text"
          placeholder="Profile Name" />
      </>
      }

      <div className='max-h-[500px] maxlg:max-h-[320px] overflow-auto'>
        <div>
          {myOwnedProfileTokens.length > 0 && profilesToShow?.map((profile) => {
            if(!hiddenProfile || profile.title !== hiddenProfile){
              return (
                <div key={profile?.title} className='mb-4'>
                  <SidebarProfileCard onClick={selectProfileHandler} profile={profile} />
                </div>
              );
            }
          })}
        </div>
        {!allProfiles.length && <p className='text-[#6F6F6F] mb-4'>No profiles found. Please try again.</p>}
        {allProfiles.length > profilesToShow.length
          ?
          (
            <button onClick={() => LoadMoreHandler()} className="bg-[#F9D963] font-bold tracking-normal hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full" type="button">
            Load More
            </button>
          )
          : null
        }
      </div>
    </motion.div>
  );
}
