import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { Doppler, getEnv } from 'utils/env';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import SearchIcon from 'public/search.svg';
import { useRef, useState } from 'react';
import {
  Configure,
  connectStateResults,
  Highlight,
  Hits,
  Index,
  InstantSearch,
  SearchBox } from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const Hit = (hit) => {
  const router = useRouter();
  return (
    <div
      className={tw(
        'flex flex-col text-sm my-1',
        'font-medium dark:text-always-white hover:cursor-pointer')}
      onClick={() => {
        if (hit.hit.url) {
          router.push(`/${hit.hit.url}`);
        }

        if (!hit.hit.nftName) {
          router.push(`/app/collection/${hit.hit.contractAddr}/`);
        } else {
          router.push(`/app/nft/${hit.hit.contractAddr}/${hit.hit.tokenId}`);
        }
      }}>
      <Highlight attribute={!hit.hit.nftName ? hit.hit.url ? 'url' : 'contractName' : 'nftName'} nonHighlightedTagName="span" hit={hit.hit} />
      {hit.hit.contractAddr && <span className="text-[0.7rem]"><Highlight attribute={'contractAddr'} nonHighlightedTagName="span" hit={hit.hit} /></span>}
      {hit.hit._highlightResult.tokenId && hit.hit._highlightResult.tokenId.matchLevel === 'full' && <span className="text-[0.7rem]"><Highlight attribute={'tokenId'} nonHighlightedTagName="span" hit={hit.hit} /></span>}
    </div>
  );
};

export const SearchBar = () => {
  const [showHits, setShowHits] = useState(false);
  const router = useRouter();

  const resultsRef = useRef();

  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_APIKEY),
      nodes: [
        {
          host: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_HOST),
          port: 443,
          protocol: 'https',
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    },
    additionalSearchParameters: {
      query_by: 'nftName,contractName,contractAddr,tokenId,listingType,chain,status,nftType,ownerAddr,traits',
    },
    collectionSpecificSearchParameters: {
      ntfs: {
        query_by: 'nftName,contractName,contractAddr,tokenId,listingType,chain,status,listedPx,nftType,ownerAddr,traits',
      },
      collections: {
        query_by: 'contractName,contractAddr,chain',
      },
      profiles: {
        query_by: 'url',
      },
    },
  });
  
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  useOutsideClickAlerter(resultsRef, () => {
    setShowHits(false);
  });

  const Results = connectStateResults(
    ({ searchResults, searchState }) => {
      if (!searchState.query) {
        setShowHits(false);
        return '';
      }

      return searchResults && searchResults.nbHits !== 0
        ? (
          <>
            <Configure hitsPerPage={5} />
            <Hits hitComponent={Hit}/>
          </>
        )
        : (
          <div className="dark:text-always-white text-sm p-3 text-gray-500">
            No results found
          </div>
        );
    }
  );

  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="collections"
        onSearchStateChange={() => {
          // TODO: depending on the data from searchState.query, add behavior
        }}>

        <div className="relative w-full">
          <div className="flex items-center border rounded-xl py-2 px-3 w-full dark:text-always-white">
            <SearchIcon className='mr-2 shrink-0 aspect-square' />
            <SearchBox
              submit={null}
              reset={null}
              onKeyDown={(event) => {
                setShowHits(true);
                const target = event.target as HTMLInputElement;
                if (event.keyCode === 13) {
                  setShowHits(false);
                  router.push(`/app/results/${target.value !== '' ? target.value : '0' }`);
                }
              }}/>
          </div>
          
          {showHits && (
            <div
              ref={resultsRef}
              className={tw(
                'absolute bg-always-white dark:bg-always-black',
                'flex flex-col w-full',
                'p-4 border border-grey z-50 text-rubik rounded-xl')}>
              <Index indexName="collections">
                <span className="text-xs text-gray-400">Collections</span>
                <Results/>
              </Index>

              <Index indexName="nfts">
                <span className="text-xs text-gray-400">NFTs</span>
                <Results/>
              </Index>

              <Index indexName="profiles">
                <span className="text-xs text-gray-400">Profiles</span>
                <Results/>
              </Index>
              <span className="text-xs text-gray-400">Press enter for all results</span>
            </div>
          )}
        </div>
      </InstantSearch>

    </>);
};
