/* eslint-disable @next/next/no-img-element */
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { shortenString } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { useRouter } from 'next/router';
import ProfileGeneric from 'public/generic_profile_item.svg';
import { useState } from 'react';

export interface HeroSidebarProfileProps {
  uri: string;
  onShowMore?: () => void;
}

export function HeroSidebarProfile(props: HeroSidebarProfileProps) {
  const router = useRouter();
  const { setHeroSidebarOpen } = useHeroSidebar();

  const { profileData } = useProfileQuery(props.uri);

  const [expanded, setExpanded] = useState(false);

  return (
    <div className={tw(
      'relative flex h-16 shrink-0 overflow-visible',
      expanded ? 'mb-16' : 'mb-3.5',
      'transition-spacing duration-200 ease-in-out'
    )}
    onMouseEnter={() => {
      if (props.onShowMore) {
        setExpanded(true);
      }
    }}
    onMouseLeave={() => {
      if (props.onShowMore) {
        setExpanded(false);
      }
    }}
    >
      <div
        key={props.uri}
        onClick={() => {
          setHeroSidebarOpen(false);
          router.push('/' + props.uri);
        }}
        className={tw(
          'relative z-40 grow mx-5',
          'flex items-center cursor-pointer shrink-0',
          'h-16 rounded-xl border',
          'bg-modal-overlay-dk border-accent-border-dk',
        )}
      >
        {/* {
          profileData?.profile?.photoURL ?
            <div className="ml-4 mr-2.5 h-9 aspect-square rounded-full relative">
              <Image
                className='rounded-full'
                layout="fill"
                objectFit="cover"
                src={profileData?.profile?.photoURL}
                alt="genesis key generic"
              />
            </div> :
            <ProfileGeneric className="ml-4 mr-2.5 h-9 aspect-square rounded-full" />
        } */}
        {profileData?.profile?.photoURL ?
          <img
            className="ml-4 mr-2.5 h-9 aspect-square rounded-full"
            src={profileData?.profile?.photoURL}
            alt="genesis key generic"
          /> :
          <ProfileGeneric className="ml-4 mr-2.5 h-9 aspect-square rounded-full" />
        }
        <div className="flex flex-col text-secondary-txt">
          Profile
          <span className='text-lg text-always-white'>
            @{shortenString(props.uri,13, 11)}
          </span>
        </div>
      </div>
      {
        props.onShowMore &&
        <>
          <div className={tw(
            'flex justify-center items-end pb-2',
            'text-link uppercase hover:underline text-sm',
            expanded ? 'mt-10' : 'mt-1.5',
            'transition-spacing duration-200 ease-in-out',
            'absolute flex mx-5 right-0 left-0',
            'h-16 rounded-xl border cursor-pointer',
            'bg-modal-overlay-dk border-accent-border-dk z-30',
          )}
          onClick={() => {
            setExpanded(false);
            props.onShowMore();
          }}
          >
            SHOW ALL
          </div>
          <div className={tw(
            'absolute flex mx-5 right-0 left-0',
            expanded ? 'mt-12' : 'mt-3',
            'transition-spacing duration-200 ease-in-out',
            'h-16 rounded-xl border cursor-pointer',
            'bg-modal-overlay-dk border-accent-border-dk z-20',
          )}>
            {/* bottom card */}
          </div>
        </>
      }
    </div>
  );
}