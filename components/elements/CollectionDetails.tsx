import { Hit } from 'components/modules/Search/Hit';
import { Nft } from 'graphql/generated/types';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import useLazyLoad from 'hooks/useLazyLoad';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapter, SearchableFields } from 'utils/typeSenseAdapters';

import { LoadingRow } from './LoadingRow';
import { NFTCard } from './NFTCard';

import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import {
  Configure,
  connectStateResults,
  InfiniteHits,
  InstantSearch,
  SearchBox,
} from 'react-instantsearch-dom';

export interface CollectionDetailsProps {
  address: string;
  collectionName: string;
}

const NUM_PER_PAGE = 12;

const Results = connectStateResults(
  ({ props, searchResults/*, children */ }) => {
    return searchResults && searchResults.nbHits !== 0 ? <InfiniteHits hitComponent={props.hitComponent} /> : null;
  }
);

export const SearchbarComponent = () => {
  return (
    <div className="relative mt-3 mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="search"
        name="search"
        className={tw('block w-full pl-10 pr-3 py-3',
          'border border-gray-200 rounded-xl leading-5',
          'bg-white dark:bg-white placeholder-gray-500 focus:outline-none',
          'focus:placeholder-gray-400 focus:ring-1',
          'focus:ring-gray-300 focus:border-gray-300 deprecated_sm:text-sm')}
        placeholder="Search ..."
        type="search"
        spellCheck={false}
      />
    </div>
  );
};

export const CollectionDetails = (props: CollectionDetailsProps) => {
  const triggerRef = useRef(null);
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [nextCursor, setNextCursor] = useState('start');
  const router = useRouter();

  const onGrabData = useCallback(() => {
    // when we reach the end of the list
    if (nextCursor == null) {
      return [];
    }
    return fetchCollectionsNFTs({
      collectionAddress: props.address,
      pageInput: {
        first: NUM_PER_PAGE,
        afterCursor: nextCursor === 'start' ? null : nextCursor
      }
    }).then((result) => {
      setNextCursor(result?.collectionNFTs?.pageInfo?.lastCursor);
      return result?.collectionNFTs?.items ?? [];
    });
  }, [fetchCollectionsNFTs, nextCursor, props.address]);

  const { data, loading } = useLazyLoad({ triggerRef, onGrabData });

  return (
    <>
      <SearchbarComponent />
      <div className='grid gap-4 grid-cols-4 w-full sm:grid-cols-2'>
        {(data ?? []).map((nft: Nft, index: number) => {
          return <NFTCard
            images={[nft?.metadata?.imageURL]}
            title={nft?.metadata?.name}
            description={nft?.metadata?.description}
            contractAddress={nft?.contract}
            tokenId={nft?.tokenId}
            key={index}
            onClick={() => {
              router.push(`/app/nft/${props.address}/${nft?.tokenId}`);
            }}
            customBackground={'LightGrey'}
          />;
        })}
      </div>
      {nextCursor != null && <div ref={triggerRef} className={`${loading ? 'trigger': ''}`}>
        <LoadingRow />
      </div>}
      <div className="hidden">
        {props.collectionName && <InstantSearch
          searchClient={getTypesenseInstantsearchAdapter(SearchableFields.NFTS_COLLECTION_FIELDS)}
          indexName="nfts">
          <Configure hitsPerPage={12}/>
          <div className="flex items-center border rounded-xl py-2 px-3 w-full dark:text-always-black">
            <SearchIcon className='w-10 mr-2 shrink-0 aspect-square' />
            <SearchBox
              submit={null}
              reset={null}
              defaultRefinement={''}/>
          </div>
          <div className="flex mb-10">
            <div className="w-full md:mt-36">
              <div className="flex flex-col">
                <div className="w-full pb-3 text-gray-400 dark:text-always-black font-bold text-4xl">NFTs</div>
                <div className="results-grid min-h-[17rem]">
                  <Results hitComponent={Hit}/>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>}
      </div>
    </>
  );
};

export default CollectionDetails;