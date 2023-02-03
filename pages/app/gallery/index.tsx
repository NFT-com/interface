import { Button, ButtonType } from 'components/elements/Button';
import { LoadedContainer } from 'components/elements/LoadedContainer';
import { Modal } from 'components/elements/Modal';
import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { GalleryPageTitle } from 'components/modules/Gallery/GalleryPageTitle';
import { GenesisKeyGalleryDetailView } from 'components/modules/Gallery/GenesisKeyGalleryDetailView';
import { GenesisKeyGalleryFilters } from 'components/modules/Gallery/GenesisKeyGalleryFilters';
import { GenesisKeyGalleryItems } from 'components/modules/Gallery/GenesisKeyGalleryItems';
import { GenesisKeyGalleryProfileItems } from 'components/modules/Gallery/GenesisKeyGalleryProfileItems';
import { SignedOutView } from 'components/modules/GenesisKeyAuction/SignedOutView';
import { Maybe } from 'graphql/generated/types';
import { useGallery } from 'hooks/state/useGallery';
import { useUser } from 'hooks/state/useUser';
import { useSignedIn } from 'hooks/useSignedIn';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import { useCallback, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

/**
 * Renders a gallery of genesis keys and profiles.
 * 
 * The Genesis Key gallery queries the contract directly and uses a sequence of
 * token IDs from 1 to the totalSupply.
 * 
 * The Profile gallery queries our backend for a complet list of recently minted profiles,
 * so it will have a slight delay as it depends on the backend to update its data via our regular jobs.
 * 
 * Profiles owned by the logged in user are not delayed, because we query the contract directly.
 */
export default function GalleryPage() {
  const parentRef = useRef();

  const { user } = useUser();

  const { address: currentAddress } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const signedIn = useSignedIn();

  const { galleryShowMyStuff: showMyStuff, galleryItemType } = useGallery();
  
  const [detailId, setDetailId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>('');

  const getGalleryContent = useCallback(() => {
    if (showMyStuff && !signedIn) {
      return <div className="w-full flex justify-center">
        <SignedOutView />
      </div>;
    }
    if (galleryItemType === 'profile') {
      return (
        <GenesisKeyGalleryProfileItems showMyStuff={showMyStuff} />
      );
    } else {
      return (
        <GenesisKeyGalleryItems
          showMyStuff={showMyStuff}
          currentFilter={currentFilter}
          setDetailId={(id: Maybe<number>) => {
            setDetailId(id);
          }}
        />
      );
    }
  }, [currentFilter, galleryItemType, showMyStuff, signedIn]);

  return (
    <ClientOnly>
      <Modal
        dark={user.isDarkMode}
        pure
        visible={detailId != null}
        loading={false}
        title={''}
        onClose={() => {
          setDetailId(null);
        }}>
        <GenesisKeyGalleryDetailView
          id={detailId}
          onClose={() => {
            setDetailId(null);
          }}
        />
      </Modal>
      <div className={tw(
        'flex h-5/6 w-full overflow-hidden minlg:pt-20 bg-pagebg',
        'text-primary-txt-dk relative mb-[-30px]'
      )}>
        {/* Desktop Filters - sidebar */}
        {!isMobile &&
            <div className={tw(
              'minlg:flex flex-col w-1/4 shrink-0 h-full min-h-4/5',
              'px-10 pt-6 hidden text-black dark:text-white'
            )}>
              <GenesisKeyGalleryFilters
                showFilters={true}
                currentFilter={currentFilter}
                setCurrentFilter={(filter: string) => {
                  setCurrentFilter(filter);
                }}
              />
            </div>
        }
        <div className={tw(
          'flex flex-col flex-grow h-screen overflow-auto',
          'bg-pagebg dark:bg-pagebg-dk',
          'minmd:px-4 px-0 pt-6',
          'hideScroll overflow-y-hidden'
        )}>
          <GalleryPageTitle
            showMyStuff={showMyStuff}
            itemType={galleryItemType}
            currentFilter={currentFilter}
            totalGKSupply={BigNumber.from(10000)}
          />
          {currentAddress && !isSupported && <div className='w-full justify-center flex mt-12'>
            <NetworkErrorTile />
          </div>}
          <LoadedContainer loaded={true} fitToParent>
            <div ref={parentRef} className='ProfileGalleryScrollContainer w-full h-full flex flex-wrap items-start mt-4 overflow-y-scroll'>
              {getGalleryContent()}
            </div>
          </LoadedContainer>
        </div>
      </div>
      {/* mobile filters */}
      <div className={tw(
        'minlg:hidden w-full h-full absolute top-0 left-0',
        !showFilters ? 'hidden' : 'block',
        'bg-pagebg dark:bg-pagebg-dk',
        'mt-20 pt-8 px-8 flex flex-col text-primary-txt-dk',
        'text-black dark:text-white'
      )}>
        <GenesisKeyGalleryFilters
          showFilters={showFilters}
          currentFilter={currentFilter}
          setCurrentFilter={(filter: string) => {
            setCurrentFilter(filter);
          }}
        />
      </div>
      <div className={tw(
        'absolute bottom-[-9rem] mb-2 left-0 minlg:hidden w-full flex justify-center',
        'drop-shadow-md px-8'
      )}>
        <Button
          stretch
          label={showFilters ? 'Close' : 'Filter'}
          onClick={() => {
            setShowFilters(!showFilters);
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
    </ClientOnly>
  );
}

GalleryPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};
