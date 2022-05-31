import { Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { LoadedContainer } from 'components/elements/LoadedContainer';
import { Modal } from 'components/elements/Modal';
import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GalleryPageTitle } from 'components/modules/Gallery/GalleryPageTitle';
import { GenesisKeyGalleryDetailView } from 'components/modules/Gallery/GenesisKeyGalleryDetailView';
import { GenesisKeyGalleryFilters } from 'components/modules/Gallery/GenesisKeyGalleryFilters';
import { GenesisKeyGalleryItems } from 'components/modules/Gallery/GenesisKeyGalleryItems';
import { GenesisKeyGalleryProfileItems } from 'components/modules/Gallery/GenesisKeyGalleryProfileItems';
import { SignedOutView } from 'components/modules/GenesisKeyAuction/SignedOutView';
import { Maybe } from 'graphql/generated/types';
import { useGallery } from 'hooks/state/useGallery';
import { useSignedIn } from 'hooks/useSignedIn';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
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

  const { data: account } = useAccount();
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
    <PageWrapper removePinkSides headerOptions={{
      walletOnly: true,
      sidebar: (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') ? 'dashboard' : 'hero',
      removeSummaryBanner: true,
      walletPopupMenu: true,
    }}>
      <Modal
        dark
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
        'flex h-full w-full overflow-hidden pt-20 bg-modal-overlay-dk',
        'text-primary-txt-dk absolute'
      )}>
        {/* Desktop Filters - sidebar */}
        {!isMobile && (process.env.NEXT_PUBLIC_ENABLE_GALLERY_FILTERS === 'true') &&
         <div className={tw(
           'flex flex-col w-1/4 shrink-0 h-full min-h-4/5 border-r border-accent-border-dk',
           'border-t px-10 pt-6 md:hidden'
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
          'flex flex-col flex-grow h-full overflow-auto',
          'border-t border-accent-border-dk bg-modal-overlay-dk',
          'px-4 sm:px-0 pt-6'
        )}>
          <GalleryPageTitle
            showMyStuff={showMyStuff}
            itemType={galleryItemType}
            currentFilter={currentFilter}
            totalGKSupply={BigNumber.from(10000)}
          />
          {account && !isSupported && <div className='w-full justify-center flex mt-12'>
            <NetworkErrorTile />
          </div>}
          <LoadedContainer loaded={true} fitToParent>
            <div ref={parentRef} className='w-full h-full flex flex-wrap mt-4'>
              {getGalleryContent()}
            </div>
          </LoadedContainer>
        </div>
      </div>
      {/* mobile filters */}
      {(process.env.NEXT_PUBLIC_ENABLE_GALLERY_FILTERS === 'true') &&
        <div className={tw(
          'hidden w-full h-full absolute dark top-0 left-0',
          !showFilters ? 'md:hidden' : 'md:block',
          'bg-modal-overlay-dk mt-20 pt-8 px-8 flex flex-col text-primary-txt-dk',
          'border-t border-accent-border-dk'
        )}>
          <GenesisKeyGalleryFilters
            showFilters={showFilters}
            currentFilter={currentFilter}
            setCurrentFilter={(filter: string) => {
              setCurrentFilter(filter);
            }}
          />
        </div>
      }
      {(process.env.NEXT_PUBLIC_ENABLE_GALLERY_FILTERS === 'true') && <div className={tw(
        'md:block absolute bottom-0 left-0 hidden w-full mb-8 flex justify-center',
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
      </div>}
      <Footer />
    </PageWrapper>
  );
}