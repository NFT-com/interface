/* eslint-disable @next/next/no-img-element */
import Loader from 'components/elements/Loader';
import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { Nft } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { GalleryToggleAllButtons } from './GalleryToggleAllButtons';
import { NftGrid } from './NftGrid';
import { ProfileEditContext } from './ProfileEditContext';

import { CaretLeft } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export interface CollectionGalleryProps {
  profileURI: string;
}

export function CollectionGallery(props: CollectionGalleryProps) {
  const { profileURI } = props;

  const [loadedCount,] = useState(100);
  
  const { activeChain } = useNetwork();
  const { profileData } = useProfileQuery(profileURI);

  const {
    editMode,
    selectedCollection,
    setSelectedCollection,
    hideNftIds,
    showNftIds,
  } = useContext(ProfileEditContext);

  const { data: collectionData } = useCollectionQuery(String(activeChain?.id), selectedCollection, '');

  const { data: allOwnerNFTs } = useMyNFTsQuery(loadedCount);
  const { nfts: profileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    loadedCount
  );

  const [collections, setCollections] = useState<Map<string, Nft[]>>(
    new Map<string, Nft[]>()
  );

  useEffect(() => {
    const nftsToShow = editMode ?
      (allOwnerNFTs ?? []) :
      (profileNFTs ?? []);
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
    setCollections(newCollections);
  }, [allOwnerNFTs, editMode, profileNFTs]);

  if (profileNFTs == null || profileData == null) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-white">
          <Loader />
        </div>
      </div>
    );
  }

  if (editMode && (allOwnerNFTs.length ?? 0) === 0) {
    return (
      <div className="w-full flex items-center justify-center customHeight">
        <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
          <div className="">No Gallery NFTs</div>
        </div>
      </div>
    );
  }

  if (selectedCollection) {
    const detailedCollectionNFTs = (collections.get(selectedCollection) ?? [])
      .map(nft => {
        if (profileNFTs.find(nft2 => nft2.id === nft.id)) {
          return {
            ...nft,
            hidden: false
          };
        } else {
          return {
            ...nft,
            hidden: true
          };
        }
      });
    
    return <div className={'w-full flex flex-col items-center'}>
      <div className='w-full flex items-center px-8 mb-8 cursor-pointer justify-between'>
        <div className='flex items-center' onClick={() => setSelectedCollection(null)}>
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
      <div
        className='w-screen flex items-center text-center text-2xl text-primary-txt dark:text-primary-txt-dk font-medium mb-8 justify-center h-40'
        style={{
          backgroundImage: `url(${!isNullOrEmpty(collectionData?.openseaInfo?.image_url)
            ? processIPFSURL(collectionData?.openseaInfo?.image_url)
            : 'https://cdn.nft.com/empty_profile_banner.png'})`
        }}
      />
      <span className='w-full text-center text-2xl text-primary-txt dark:text-primary-txt-dk mb-12 font-medium'>
        {collectionData?.collection?.name}
      </span>
      <NftGrid profileURI={profileURI} nfts={detailedCollectionNFTs} />
    </div>;
  }

  return (
    <div className={'grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 w-full'}>
      {Array.from(collections.keys()).map((key: string) => (
        <div
          key={key}
          className={tw(
            'flex mb-10 items-center justify-center p-3',
          )}
        >
          <NFTCollectionCard
            contract={key}
            count={collections.get(key)?.length}
            images={collections.get(key).map((nft) => {
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