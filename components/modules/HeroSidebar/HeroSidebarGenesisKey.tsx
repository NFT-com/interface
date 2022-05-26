import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { isNullOrEmpty, processIPFSURL, shortenString } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import gkCircleGeneric from 'public/gk_circle_generic.svg';
import { useState } from 'react';

export interface HeroSidebarGenesisKeyProps {
  tokenId: number;
  onShowMore?: () => void;
}

export const HeroSidebarGenesisKey = (props: HeroSidebarGenesisKeyProps) => {
  const router = useRouter();
  const { setHeroSidebarOpen } = useHeroSidebar();
  const genesisKeyMetadata = useGenesisKeyMetadata(
    props.tokenId != null ? BigNumber.from(props.tokenId) : null
  );
  
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={tw(
      'relative flex h-16 shrink-0 overflow-visible',
      expanded ? 'mb-16' : props.onShowMore ? 'mb-8' : 'mb-3.5',
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
        onClick={() => {
          setHeroSidebarOpen(false);
          router.push('/app/gallery/' + props.tokenId);
        }}
        className={tw(
          'relative z-40 grow mx-5',
          'flex items-center cursor-pointer shrink-0',
          'h-16 rounded-xl border',
          'bg-modal-overlay-dk border-accent-border-dk',
          'overflow-hidden',
        )}
      >
        <div className='flex w-full overflow-hidden'>
          <div className={tw('flex justify-between items-center pl-4 w-full overflow-hidden')}>
            <div className='flex h-full items-center z-50'>
              {/* <Image
                className='flex-shrink-0 aspect-square h-9'
                src={gkCircleGeneric}
                alt="genesis key generic"
              /> */}
              <div className="flex flex-col text-primary-txt-dk deprecated_sm:grow ml-2">
                Genesis Key
                <span className='text-lg text-always-white deprecated_sm:ml-2'>
                #{shortenString(props.tokenId, 13, 11)}
                </span>
              </div>
            </div>
            <div
              className={tw(
                'bg-gradient-to-l from-transparent to-modal-overlay-dk overflow-hidden',
                'absolute top-0 right-24 w-24 h-full flex rounded-r-xl z-40'
              )}
            />
            {/* {!isNullOrEmpty(genesisKeyMetadata?.metadata?.image) &&
              <Image
                className={tw(
                  'absolute -top-4 -right-12 flex flex-shrink-0 aspect-square w-60 self-start rounded-r-xl z-30',
                )}
                src={processIPFSURL(genesisKeyMetadata?.metadata?.image)}
                alt="genesis key specific"
              />
            } */}
          </div>
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
};