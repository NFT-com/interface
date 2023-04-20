import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CaretDown, CaretUp, Check } from 'phosphor-react';
import { useAccount } from 'wagmi';

import { useProfileSelectModal } from 'hooks/state/useProfileSelectModal';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { isNullOrEmpty } from 'utils/format';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

export function SignedInProfileButtonDropdown() {
  const router = useRouter();
  const { setProfileSelectModalOpen } = useProfileSelectModal();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { user, getHiddenProfileWithExpiry, setCurrentProfileUrl } = useUser();
  const { address: currentAddress } = useAccount();

  const [profiles, setProfiles] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlerter(wrapperRef, () => {
    setExpanded(false);
  });

  useEffect(() => {
    myOwnedProfileTokens.length && setProfiles(myOwnedProfileTokens);
  }, [myOwnedProfileTokens]);

  const sortProfiles = useCallback(() => {
    const hiddenProfile = getHiddenProfileWithExpiry();
    const hiddenIndex = profiles?.findIndex(e => e.title === hiddenProfile);
    if (hiddenIndex !== -1) {
      profiles?.splice(hiddenIndex, 1);
    }

    const index = profiles?.findIndex(e => e.title === user.currentProfileUrl);
    profiles?.unshift(...profiles.splice(index, 1));
  }, [getHiddenProfileWithExpiry, profiles, user.currentProfileUrl]);

  useEffect(() => {
    if (
      currentAddress &&
      profiles?.length &&
      myOwnedProfileTokens?.length &&
      (user.currentProfileUrl === '' ||
        isNullOrEmpty(user.currentProfileUrl) ||
        !profiles?.some(profile => profile.title === user.currentProfileUrl))
    ) {
      setProfileSelectModalOpen(true);
    } else {
      setProfileSelectModalOpen(false);
    }
  }, [currentAddress, profiles, user.currentProfileUrl, setProfileSelectModalOpen, router, myOwnedProfileTokens]);

  return (
    <div
      ref={wrapperRef}
      className={tw(
        'relative',
        'flex cursor-pointer flex-col items-end rounded-xl',
        '-ml-3 -mr-5 text-base',
        'text-primary-txt dark:text-always-white',
        'justify-between whitespace-nowrap'
      )}
    >
      <div
        ref={anchorRef}
        className={tw(
          'flex flex-row items-end px-2.5',
          'bg-transparent dark:bg-secondary-dk',
          'h-full py-2',
          'w-full justify-between rounded-xl'
        )}
      >
        <>
          <button
            onClick={() => {
              setExpanded(!expanded);
              sortProfiles();
            }}
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-300 font-bold minlg:hidden'
          >
            /
          </button>
          <div className='hidden cursor-pointer gap-3 minlg:block'>
            <button
              className={tw(
                'block rounded-full font-bold',
                'bg-[#F9D54C] font-medium',
                'flex cursor-pointer flex-row items-center font-noi-grotesk hover:opacity-80',
                'py-2 pl-[18px] pr-5'
              )}
              type='button'
            >
              {myOwnedProfileTokens?.some(token => token.title === user.currentProfileUrl) ? (
                <div className='flex items-center justify-between'>
                  <p className='mr-2 text-xl font-bold'>/</p>
                  <Link href={`/${user.currentProfileUrl}`}>
                    <p className='font-medium'>{user.currentProfileUrl}</p>
                  </Link>

                  <CaretDown
                    onClick={() => {
                      setExpanded(!expanded);
                      sortProfiles();
                    }}
                    size={18}
                    color='black'
                    weight='bold'
                    className='ml-2'
                  />
                </div>
              ) : (
                <>
                  <div className='flex items-center justify-between'>
                    {myOwnedProfileTokens?.length > 0 ? (
                      <p onClick={() => setProfileSelectModalOpen(true)} className='font-medium'>
                        {shortenAddress(currentAddress, 3)}
                      </p>
                    ) : (
                      <Link href='/app/mint-profiles'>
                        <p className='font-medium'>{shortenAddress(currentAddress, 3)}</p>
                      </Link>
                    )}
                    <CaretDown
                      onClick={() => {
                        setExpanded(!expanded);
                        sortProfiles();
                      }}
                      size={18}
                      color='black'
                      weight='bold'
                      className='ml-2'
                    />
                  </div>
                </>
              )}
            </button>
          </div>
        </>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: anchorRef.current.clientHeight + 8
          }}
          className={tw(
            'rounded-xl',
            'bg-white dark:bg-secondary-dk',
            'absolute z-50',
            'right-1 min-w-[14rem] drop-shadow-md minlg:left-1/2 minlg:right-auto minlg:-translate-x-1/2'
          )}
        >
          <CaretUp
            size={32}
            color='white'
            weight='fill'
            className='absolute -top-[18px] right-3 minlg:left-[43%] minlg:right-auto'
          />

          <div className='mt-2 max-h-[128px] overflow-y-auto pt-2'>
            {myOwnedProfileTokens?.length === 0 && (
              <>
                <p className='px-4 text-black hover:cursor-default'>No Profiles Found</p>
                <div
                  onClick={() => {
                    router.push('/app/mint-profiles');
                    setExpanded(false);
                  }}
                  style={{ height: '10%' }}
                  className={'flex w-full flex-row items-center px-4 font-medium text-black hover:cursor-pointer'}
                >
                  Create One Here
                </div>
              </>
            )}

            {myOwnedProfileTokens?.length > 0 &&
              myOwnedProfileTokens.map(profile =>
                user.currentProfileUrl === profile.title ? (
                  <Link key={profile.title} href={`/${profile.title}`}>
                    <div
                      className={
                        'flex h-10 w-full flex-row items-center justify-between bg-[#FFF4CA] px-4 py-2 font-medium text-primary-txt'
                      }
                    >
                      <div className='flex'>
                        <div className='mr-4 flex h-6 w-6 items-center justify-center rounded-full  border border-[#E4BA18] bg-[#F9D54C]'>
                          {profile.title.charAt(0).toUpperCase()}
                        </div>
                        <p>{profile.title}</p>
                      </div>
                      <Check size={18} color='black' weight='bold' />
                    </div>
                  </Link>
                ) : (
                  <Link key={profile.title} href={`/${profile.title}`}>
                    <div
                      className={'flex h-10 w-full flex-row items-center px-4 py-2 font-medium text-primary-txt'}
                      onClick={() => setCurrentProfileUrl(profile.title)}
                    >
                      <div className='mr-4 flex h-6 w-6 items-center justify-center rounded-full  border border-[#E4BA18] bg-[#F9D54C]'>
                        {profile.title.charAt(0).toUpperCase()}
                      </div>
                      <p>{profile.title}</p>
                    </div>
                  </Link>
                )
              )}
          </div>

          <div className='mt-4 flex justify-between'>
            <div
              onClick={() => {
                router.push('/app/settings');
                setExpanded(false);
              }}
              style={{ height: '10%' }}
              className={
                'mb-3 flex w-full flex-row items-center border-t border-[#ECECEC] px-4 py-2 pt-4 font-medium text-black'
              }
            >
              Settings
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
