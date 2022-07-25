/* eslint-disable @next/next/no-img-element */
import Loader from 'components/elements/Loader';
import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { Nft } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { getGenesisKeyThumbnail, isNullOrEmpty, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGrid } from './NftGrid';
import { ProfileContext } from './ProfileContext';

import { CaretLeft } from 'phosphor-react';
import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface CollectionGalleryProps {
  profileURI: string;
}

export function CollectionGallery(props: CollectionGalleryProps) {
  const { profileURI } = props;
  
  const { activeChain } = useNetwork();
  const { profileData } = useProfileQuery(profileURI);

  const {
    editMode,
    selectedCollection,
    setSelectedCollection,
    hideNftIds,
    showNftIds,
    publiclyVisibleNfts,
    allOwnerNfts,
  } = useContext(ProfileContext);

  const { data: collectionData } = useCollectionQuery(String(activeChain?.id), selectedCollection, true);

  const { data: collections } = useSWR(
    '' + editMode + JSON.stringify(publiclyVisibleNfts) + JSON.stringify(allOwnerNfts),
    () => {
      const nftsToShow = editMode ?
        (allOwnerNfts ?? []) :
        (publiclyVisibleNfts ?? []);
      const newCollections = nftsToShow?.reduce((
        previousValue: Map<string, Nft[]>,
        currentValue: Nft,
      ) => {
        if (previousValue.has(currentValue?.contract)) {
          previousValue.get(currentValue?.contract).push(currentValue);
          return previousValue;
        } else {
          previousValue.set(currentValue?.contract, [currentValue]);
          return previousValue;
        }
      }, new Map<string, Nft[]>()) ?? new Map();
      return newCollections;
    }
  );

  if (publiclyVisibleNfts == null || profileData == null) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && (allOwnerNfts.length ?? 0) === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  if (selectedCollection) {
    const detailedCollectionNFTs = collections?.get(selectedCollection) ?? [];
    
    return <div className={'w-full flex flex-col items-center'}>
      <div className='w-full flex items-center px-8 mb-8 cursor-pointer justify-between'>
        <div className='flex items-center' onClick={() => {
          setSelectedCollection(null);
        }}>
          <CaretLeft className='mr-4' color="white" />
          <span className='text-primary-txt dark:text-primary-txt-dk'>Back to Collections</span>
        </div>
        {editMode && <div className='flex items-center text-primary-txt dark:text-primary-txt-dk'>
          <GalleryToggleAllButtons
            onShowAll={() => {
              showNftIds(detailedCollectionNFTs.map(nft => nft.id));
            }}
            onHideAll={() => {
              hideNftIds(detailedCollectionNFTs.map(nft => nft.id));
            }}
            publicNFTCount={detailedCollectionNFTs.filter(nft => !nft.hidden).length}
          />
        </div>}
      </div>
      {!isNullOrEmpty(collectionData?.openseaInfo?.collection?.banner_image_url) ?
        <div
          className={tw('w-screen h-80',
            'flex items-center justify-center',
            'text-center text-2xl text-primary-txt dark:text-primary-txt-dk font-medium',
            'mb-8',
            'bg-auto bg-center'
          )}
          style={{
            backgroundImage: `url(${collectionData?.openseaInfo?.collection?.banner_image_url})`
          }}
        /> :
        ''
      }
      <span className='w-full text-center text-2xl text-primary-txt dark:text-primary-txt-dk mb-12 font-medium'>
        {collectionData?.collection?.name}
      </span>
      <NftGrid profileURI={profileURI} nfts={detailedCollectionNFTs} />
    </div>;
  }

  return (
    <div className={'grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 w-full'}>
      {Array.from(collections?.keys() ?? []).map((key: string) => (
        <div
          key={key}
          className={tw(
            'flex mb-10 items-center justify-center p-3',
            'NFTCollectionCardContainer'
          )}
        >
          <NFTCollectionCard
            contract={key}
            count={collections?.get(key)?.length}
            images={collections?.get(key)?.map((nft: PartialDeep<Nft>) => {
              if (sameAddress(nft?.contract, getAddress('genesisKey', activeChain?.id ?? 1))) {
                return getGenesisKeyThumbnail(nft?.tokenId);
              }
              return nft?.metadata?.imageURL;
            })}
            onClick={() => {
              setSelectedCollection(key);
            }}
          />
        </div>
      ))}
    </div>
  );
}