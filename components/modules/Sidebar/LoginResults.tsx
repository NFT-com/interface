import { useSidebar } from 'hooks/state/useSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import SidebarNoProfiles from './NoProfiles';

import { XIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { XCircle } from 'phosphor-react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useDisconnect } from 'wagmi';

type LoginResultsProps = {
  profileValue?: string;
  setProfileValue?: any;
  setViewed?: any;
};

export default function LoginResults({ profileValue, setProfileValue, setViewed }: LoginResultsProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { setSidebarOpen } = useSidebar();
  const { primaryIcon } = useThemeColors();
  const { setSignOutDialogOpen } = useSignOutDialog();
  const { disconnect } = useDisconnect();

  const exitClickHandler = () => {
    if(myOwnedProfileTokens.length) {
      setSignOutDialogOpen(true);
      disconnect();
      setSidebarOpen(false);
      setProfileValue('');
    } else {
      setViewed(true);
    }
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
      <XCircle onClick={() => exitClickHandler()} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          
      {myOwnedProfileTokens.length > 0 &&
            <h2 className='font-grotesk font-bold text-4xl mb-9 mt-24 tracking-wide'>Select Profile</h2>
      }

      {profileValue !== '' && myOwnedProfileTokens.length > 0 &&
            <p className='text-[#6F6F6F] mb-4 font-grotesk tracking-wide'>We couldn’t find the profile <span className='text-black font-bold'>{profileValue}</span> but we found these.</p>
      }

      {profileValue === '' && myOwnedProfileTokens.length > 0 &&
            <p className='text-[#6F6F6F] mb-4 tracking-wide'>Good news! We found your profiles.</p>
      }

      {myOwnedProfileTokens.length > 0 && myOwnedProfileTokens?.map((profile, index) => {
        return (
          <motion.div
            style={{
              background: `url("${profile.metadata.header}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            className='bg-black rounded-[10px] mb-4 hover:cursor-pointer'
            onClick={() => setProfileValue(profile.title)}
            key={index}
          >
            <div className='bg-black opacity-80 flex items-center py-4 px-4 rounded-[10px]' >
              <Image className='rounded-full' width={50} height={50} alt={`profile for ${profile.title}`} src={profile.metadata.image} />
              <p className='font-grotesk text-base text-white leading-6 font-medium ml-3 tracking-wide'>{profile.title}</p>
            </div>
          </motion.div>
        );
      })}

      {!myOwnedProfileTokens.length &&
        <SidebarNoProfiles/>
      }
    </motion.div>
  );
}
