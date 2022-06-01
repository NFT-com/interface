import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { useRouter } from 'next/router';
import searchIcon from 'public/search.svg';
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
        'flex flex-row text-base my-3',
        'font-medium dark:text-always-white hover:cursor-pointer')}
      onClick={() => {
        if (!hit.hit.tokentId && !hit.hit.type) {
          router.push(`/app/collection/${hit.hit.contract}/`);
        } else {
          router.push(`/app/nft/${hit.hit.contract}/${hit.hit.id}`);
        }
      }}>
      <Highlight attribute="name" nonHighlightedTagName="span" hit={hit.hit} />
    </div>
  );
};

export const SearchBar = () => {
  const [showHits, setShowHits] = useState(false);
  const router = useRouter();

  const resultsRef = useRef();

  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: process.env.TYPESENSE_APIKEY,
      nodes: [
        {
          host: process.env.TYPESENSE_HOST,
          port: 443,
          protocol: 'https',
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    },
    additionalSearchParameters: {
      query_by: 'name,contract,type',
    },
    collectionSpecificSearchParameters: {
      ntfs: {
        query_by: 'name,contract,type',
      },
      collections: {
        query_by: 'name,contract',
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
            <Configure hitsPerPage={8} />
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
          <div className="flex border rounded-xl py-2 px-3 w-full dark:text-always-white">
            <Image src={searchIcon} className="w-4 mr-2" alt="Search" />
            <SearchBox
              submit={null}
              reset={null}
              onKeyDown={(event) => {
                setShowHits(true);
                const target = event.target as HTMLInputElement;
                if (event.keyCode === 13) {
                  setShowHits(false);
                  router.push(`/app/results/${target.value}`);
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
              <span className="text-xs text-gray-400">Press enter for all results</span>
            </div>
          )}
        </div>
      </InstantSearch>

    </>);
};
