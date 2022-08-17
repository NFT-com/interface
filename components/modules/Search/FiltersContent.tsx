import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { useRouter } from 'next/router';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useRef, useState } from 'react';

export const FiltersContent = () => {
  const { setSearchModalOpen, searchFilters, modalType } = useSearchModal();
  const [showHits, setShowHits] = useState(false);
  const [keyword, setKeyword] = useState('0');
  const [searchResults, setSearchResults] = useState([]);
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const router = useRouter();
  const resultsRef = useRef();
  console.log(searchFilters, modalType, 'searcfilters fdo');

  useOutsideClickAlerter(resultsRef, () => {
    setShowHits(false);
    setSearchModalOpen(false);
  });

  const goTo = (document) => {
    if (!document.nftName) {
      router.push(`/app/collection/${document.contractAddr}/`);
    } else {
      router.push(`/app/nft/${document.contractAddr}/${document.tokenId}`);
    }
  };

  const search = (event) => {
    const target = event.target as HTMLInputElement;
    setKeyword(target.value);

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
          'per_page': 3,
          'page':1,
        },
        {
          'collection': 'collections',
          'q': target.value,
          'query_by': SearchableFields.COLLECTIONS_INDEX_FIELDS,
          'per_page': 3,
          'page':1,
        },
      ]
    };

    fetchTypesenseMultiSearch(searchRequests)
      .then((data) => {
        setSearchResults([...data.results]);
      })
      .catch((error) => {
        console.log(error);
        setShowHits(false);
      });

    setShowHits(true);

    if (event.keyCode === 13) {
      router.push(`/app/discover/allResults/${target.value !== '' ? target.value : '0'}`);
      setSearchModalOpen(false);
    }
  };

  const resultTitle = (found, collectionName) => {
    let title = '';
    if (found < 1)
      title = 'O ' + collectionName.toUpperCase();
    else if (found > 3) {
      title = 'TOP 3 ' + collectionName.toUpperCase();
    } else {
      title = found + ' ' + collectionName.toUpperCase();
    }

    return (
      <div className={tw(
        `flex justify-${ found > 0 ? 'between' : 'start'}`,
        'text-xs text-blog-text-reskin font-medium bg-gray-200 py-3 px-5')}>
        <span>{title}</span>
        <span
          className="cursor-pointer hover:font-semibold"
          onClick={() => {
            router.push(`/app/discover/${collectionName}/${keyword}`);
            setSearchModalOpen(false);
          }}
        >
          {found < 1 ? '': found > 1 ? 'SEE ALL ' + found : 'SEE ' + found }
        </span>
      </div>
    );
  };

  const ResultsContent = (data) => {
    return data.searchResults && data.searchResults.length > 0 && data.searchResults.map((item, index) => {
      return (
        <>
          {resultTitle(item.found, item?.request_params?.collection_name)}
          <div className="flex flex-col items-start py-3 px-5" key={index}>
            {item.found === 0 ?
              <div className={tw('text-sm p-3 text-gray-500')}>
              No {item?.request_params?.collection_name?.toLowerCase()} results
              </div>
              : (item?.hits?.map((hit, index) => {
                return (
                  <div
                    key={index}
                    className={tw(
                      'flex flex-col items-start my-1 py-3',
                      'text-sm font-semibold text-black')}
                    onClick={() => goTo(hit.document)}>
                    <span>{hit.document.nftName ?? hit.document.contractName}</span>
                  </div>
                );
              }))}
          </div>
        </>
      );
    });
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex space-x-2 p-5">
          <div className={tw(
            'relative flex items-center border border-gray-400 rounded-xl p-2 w-full text-black')}>
            <SearchIcon className='mr-2 shrink-0 aspect-square' />
            <div className="w-full">
              <input
                type="search"
                placeholder="Keyword"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
                required maxLength={512}
                className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
                onKeyUp={(event) => search(event)}
                onFocus={(event) => search(event)}/>
            </div>
          </div>
          <div className='flex items-center cursor-pointer' onClick={() => {
            setSearchModalOpen(false);
          }}>
            <EllipseX />
          </div>
        </div>
        {showHits
          ? (
            <div
              ref={resultsRef}
              className={tw(
                'bg-always-white flex flex-col w-full py-4 text-rubik')}>
              {searchResults.length > 0 && <>
                {searchResults[0].found === 0 && searchResults[1].found === 0 ?
                  (<div className="mt-10 text-base font-grotesk font-medium text-gray-500">
                No results found. Please try another keyword.
                  </div>):
                  <>
                    <ResultsContent searchResults={searchResults} />
                    <div className="mx-auto absolute bottom-0 w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
                      <Button
                        color={'black'}
                        accent={AccentType.SCALE}
                        stretch={true}
                        label={'Search'}
                        onClick={() => {
                          router.push(`/app/discover/allResults/${keyword}`);
                          setSearchModalOpen(false);
                        }}
                        type={ButtonType.PRIMARY}
                      />
                    </div>
                  </>
                }
              </>}
            </div>)
          :<div className="mt-14 text-base font-grotesk font-medium text-gray-500">Enter a keyword to begin searching.</div>}
      </div>
    </>);
};
