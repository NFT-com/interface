import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { CaretDown, CaretUp, Check } from 'phosphor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Menu } from 'react-feather';
import { useAccount } from 'wagmi';

export function SignedInProfileButtonDropdown() {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const router = useRouter();
  const { user,getHiddenProfileWithExpiry, setCurrentProfileUrl } = useUser();
  const { address: currentAddress } = useAccount({
    onConnect({ isReconnected }) {
      if (isReconnected && !!user?.currentProfileUrl) {
        setCurrentProfileUrl(localStorage.getItem('selectedProfileUrl'));
      } else {
        setCurrentProfileUrl('');
      }
    },
    onDisconnect() {
      console.log('disconnected');
      setCurrentProfileUrl('');
    },
  });

  const [profiles, setProfiles] = useState(myOwnedProfileTokens);
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlerter(wrapperRef, () => {
    !isMobile && setExpanded(false);
  });

  useEffect(() => {
    setProfiles(myOwnedProfileTokens);
  }, [myOwnedProfileTokens]);

  const sortProfiles = useCallback(() => {
    const hiddenProfile = getHiddenProfileWithExpiry();
    const hiddenIndex = profiles.findIndex((e) => e.title === hiddenProfile);
    if(hiddenIndex !== -1){
      profiles.splice(hiddenIndex, 1);
    }

    const index = profiles.findIndex((e) => e.title === user.currentProfileUrl);
    profiles.unshift(...profiles.splice(index, 1));
  }, [getHiddenProfileWithExpiry, profiles, user.currentProfileUrl]);

  return (
    <div
      ref={wrapperRef}
      className={tw(
        'relative',
        'cursor-pointer flex flex-col items-end rounded-xl',
        'text-base -mr-5 -ml-3',
        'dark:text-always-white text-primary-txt',
        'whitespace-nowrap justify-between',
      )}
    >
      <div
        ref={anchorRef}
        className={tw(
          'flex flex-row items-end px-2.5',
          'bg-transparent dark:bg-secondary-dk',
          'py-2 h-full',
          'justify-between rounded-xl w-full',
        )}
        onClick={() => {
          setExpanded(!expanded);
          sortProfiles();
        }}
      >
        <>
          <button
            className='block minlg:hidden cursor-pointer z-[51] relative'
            onClick={() => {
              null;
            }}
          >
            <Menu color='#6F6F6F' />
          </button>
          <div
            className="gap-3 hidden minlg:block cursor-pointer"
          >
            <button
              className={tw(
                'block font-bold rounded-full',
                'bg-[#F9D54C] font-medium',
                'flex flex-row items-center cursor-pointer hover:opacity-80 font-noi-grotesk',
                'py-2 pr-5 pl-[18px]',
              )}
              type="button"
            >
              {myOwnedProfileTokens?.some((token) => token.title === user.currentProfileUrl) ?
                <div className='flex justify-between items-center'>
                  <p className='mr-2 text-xl font-extrabold '>/</p>
                  <p className='font-medium'>{user.currentProfileUrl}</p>
                  <CaretDown size={18} color="black" weight="bold" className='ml-2' />
                </div>
                :
                <>
                  <div className='flex justify-between items-center'>
                    <p className='font-medium'>{shortenAddress(currentAddress, 3)}</p>
                    <CaretDown size={18} color="black" weight="bold" className='ml-2' />
                  </div>
                </>
              }
            </button>
          </div>
        </>

      </div>

      {expanded && !isMobile &&
        <div
          style={{
            marginTop: anchorRef.current.clientHeight + 8,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          className={tw(
            'rounded-xl',
            'bg-white dark:bg-secondary-dk',
            'absolute z-50',
            'min-w-[14rem] drop-shadow-md',
          )}
        >
          <CaretUp size={32} color="white" weight="fill" className='absolute -top-[18px] left-[43%]'/>

          <div className='max-h-[128px] overflow-y-auto pt-2 mt-2'>
            {myOwnedProfileTokens.map((profile) => (
              user.currentProfileUrl === profile.title ?
                <div
                  key={profile.title}
                  className={'flex flex-row w-full px-4 py-2 items-center justify-between bg-[#FFF4CA] text-primary-txt font-medium h-10'}
                  onClick={() => null}
                >
                  <div className='flex'>
                    <div className='h-6 w-6 mr-4 rounded-full bg-[#F9D54C] border border-[#E4BA18]  flex justify-center items-center'>
                      {profile.title.charAt(0).toUpperCase()}
                    </div>
                    <p>{profile.title}</p>
                  </div>
                  <Check size={18} color="black" weight="bold" />
                </div>
                :
                <div
                  key={profile.title}
                  className={'flex flex-row w-full px-4 py-2 items-center text-primary-txt font-medium h-10'}
                  onClick={() => setCurrentProfileUrl(profile.title)}
                >
                  <div className='h-6 w-6 mr-4 rounded-full bg-[#F9D54C] border border-[#E4BA18]  flex justify-center items-center'>
                    {profile.title.charAt(0).toUpperCase()}
                  </div>
                  <p>{profile.title}</p>
                </div>
            ))}
          </div>

          <div className='flex justify-between mt-4'>
            <div
              onClick={() => {
                router.push('/app/settings');
                setExpanded(false);
              }}
              style={{ height: '10%' }}
              className={'flex flex-row w-full px-4 mb-3 py-2 pt-4 items-center font-medium text-black border-t border-[#ECECEC]'}
            >
              Settings
            </div>
          </div>
        </div>
      }
    </div>
  );
}

