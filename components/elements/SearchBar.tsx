import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapterRaw, SearchableFields } from 'utils/typeSenseAdapters';

import { useRouter } from 'next/router';
import SearchIcon from 'public/search.svg';
import { useRef, useState } from 'react';

type SearchBarProps = {
  bgLight?: boolean
}

export const SearchBar = (props: SearchBarProps) => {
  const [showHits, setShowHits] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const resultsRef = useRef();
  const cliente = getTypesenseInstantsearchAdapterRaw;

  useOutsideClickAlerter(resultsRef, () => {
    setShowHits(false);
  });

  const goTo = (document) => {
    if (document.url) {
      router.push(`/${document.url}`);
    }
    if (!document.nftName) {
      router.push(`/app/collection/${document.contractAddr}/`);
    } else {
      router.push(`/app/nft/${document.contractAddr}/${document.tokenId}`);
    }
  };

  const search = (event) => {
    const target = event.target as HTMLInputElement;

    if (target.value.length < 3) {
      setShowHits(false);
      return;
    }

    const searchRequests = {
      'searches': [
        {
          'collection': 'nfts',
          'q': target.value,
          'query_by': SearchableFields.NFTS_INDEX_FIELDS,
          'per_page': 4,
        },
        {
          'collection': 'collections',
          'q': target.value,
          'query_by': SearchableFields.COLLECTIONS_INDEX_FIELDS,
          'per_page': 4,
        },
        {
          'collection': 'profiles',
          'q': target.value,
          'query_by': SearchableFields.PROFILES_INDEX_FIELDS,
          'per_page': 4,
        }
      ]
    };

    cliente.multiSearch.perform(searchRequests)
      .then((data) => {
        setSearchResults([...data.results]);
      })
      .catch((error) => {
        console.log(error);
        setShowHits(false);
      });

    setShowHits(true);

    if (event.keyCode === 13) {
      router.push(`/app/results/${target.value !== '' ? target.value : '0'}`);
      setShowHits(false);
      target.click();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className={tw(
          'relative flex items-center border rounded-xl py-2 px-3',
          'mr-4 md:hidden block w-full',
          props.bgLight ? 'text-black':'text-white')}>
          <SearchIcon className='mr-2 shrink-0 aspect-square' />
          <div className="w-full">
            <input
              type="search"
              placeholder="Search here…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required maxLength={512}
              className="bg-inherit w-full border-none"
              onKeyUp={(event) => search(event)}
              onFocus={(event) => search(event)}/>
          </div>
        </div>
        {showHits && (
          <div
            ref={resultsRef}
            className={tw(
              'absolute mt-10 max-w-[27rem]',
              props.bgLight ? 'bg-always-white':'bg-always-black',
              'flex flex-col w-full p-4 border border-grey z-50 text-rubik rounded-xl')}>
            {searchResults.length > 0 && searchResults.map((item, index) => {
              return (
                <div key={index}>
                  <span className={tw(
                    'text-xs text-gray-400',
                    props.bgLight ? 'text-gray-400':'text-white')}>
                    {item?.request_params?.collection_name?.toUpperCase()}</span>
                  {item.found === 0 ?
                    <div className={tw(
                      props.bgLight ? 'text-gray-400':'text-white',
                      'text-sm p-3 text-gray-500')}>
                        No results found
                    </div>
                    : (item?.hits?.map((hit, index) => {
                      return (
                        <div
                          key={index}
                          className={tw(
                            'flex flex-col text-sm my-1 font-medium',
                            props.bgLight ? 'text-gray-400':'text-white',
                            'hover:cursor-pointer hover:opacity-70')}
                          onClick={() => goTo(hit.document)}>
                          <span>{hit.document.contractName}</span>
                          <span>{hit.document.url}</span>
                          <span className="text-[0.7rem]">{hit.document.contractAddr}</span>
                        </div>
                      );
                    }))}
                </div>);
            })}
            <span className="text-xs text-gray-400">Press enter for all results</span>
          </div>)}
      </div>
    </>);
};
