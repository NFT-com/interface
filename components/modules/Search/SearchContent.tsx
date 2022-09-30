import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { useRouter } from 'next/router';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useEffect, useRef, useState } from 'react';

interface SearchContentProps {
  isHeader?: boolean;
}

export const SearchContent = ({ isHeader }: SearchContentProps) => {
  const [showHits, setShowHits] = useState(false);
  const [keyword, setKeyword] = useState('0');
  const [searchResults, setSearchResults] = useState([]);
  const { setSearchModalOpen } = useSearchModal();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const router = useRouter();
  const resultsRef = useRef();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!router.pathname.includes('discover/')) {
      inputRef.current.value = '';
      setShowHits(false);
      setSearchResults([]);
    }
    setSearchResults([]);
  }, [router.pathname]);

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
    setSearchModalOpen(false);
  };

  const search = (event) => {
    const target = event.target as HTMLInputElement;
    setKeyword(target.value);

    if (target.value.length < 3) {
      setShowHits(false);
      if (target.value.length > 0) {
        return;
      }
    }

    const searchRequests = {
      'searches': [
        {
          'collection': 'nfts',
          'q': target.value,
          'query_by': SearchableFields.NFTS_INDEX_FIELDS,
          'per_page': 3,
          'page': 1,
        },
        {
          'collection': 'collections',
          'q': target.value,
          'query_by': SearchableFields.COLLECTIONS_INDEX_FIELDS,
          'per_page': 3,
          'page': 1,
        },
      ]
    };

    if (event.keyCode === 13) {
      if (target.value !== '' && searchResults && searchResults[0]?.found === 0 && searchResults[1]?.found === 0) {
        return;
      }

      if (target.value !== '') {
        router.push(`/app/discover/allResults/${target.value}`);
      } else {
        router.push('/app/discover');
      }

      setSearchModalOpen(false);
      setShowHits(false);
    } else {
      fetchTypesenseMultiSearch(searchRequests)
        .then((data) => {
          setSearchResults([...data.results]);
        })
        .catch((error) => {
          console.log(error);
          setShowHits(false);
        });

      setShowHits(true);
    }
  };

  const resultTitle = (found, collectionName) => {
    let title = '';

    if (found < 1 && collectionName !== '')
      title = 'O ' + collectionName?.toUpperCase();
    else if (found > 3) {
      title = 'TOP 3 ' + collectionName?.toUpperCase();
    } else {
      title = found + ' ' + collectionName?.toUpperCase();
    }

    return (
      <div className={tw(
        `flex justify-${found > 0 ? 'between' : 'start'}`,
        'text-xs text-blog-text-reskin font-medium bg-gray-200 py-3 px-5')}>
        <span>{title}</span>
        <span
          className="cursor-pointer hover:font-semibold"
          onClick={() => {
            router.push(`/app/discover/${collectionName}/${keyword}`);
            setSearchModalOpen(false);
          }}
        >
          {found < 1 ? '' : found > 1 ? 'SEE ALL ' + found : 'SEE ' + found}
        </span>
      </div>
    );
  };

  const ResultsContent = (data) => {
    return data.searchResults && data.searchResults.length > 0 && data.searchResults.map((item, index) => {
      return (
        <div key={index}>
          {resultTitle(item.found, item?.request_params?.collection_name)}
          <div className="flex flex-col items-start" key={index}>
            {item.found === 0 ?
              <div className={tw('text-sm py-3 text-gray-500 px-5')}>
                No {item?.request_params?.collection_name?.toLowerCase()} results
              </div>
              : (item?.hits?.map((hit, index) => {
                return (
                  <div
                    className="hover:cursor-pointer hover:bg-gray-100 w-full"
                    key={index}>
                    <div
                      className={tw(
                        'px-5',
                        'flex flex-col items-start my-1 py-3 w-full',
                        'text-sm font-semibold text-black')}
                      onClick={() => goTo(hit.document)}>
                      <span>{hit.document.nftName ?? hit.document.contractName}</span>
                    </div>
                  </div>
                );
              }))}
          </div>
        </div>
      );
    });
  };

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <>
        <div className="w-24 flex flex-col">
          <div className="flex">
            <div className={tw(
              'relative flex items-center text-black')}>
              <SearchIcon color='#000000' className='mr-2 shrink-0 aspect-square' />
              <div className="w-full">
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoFocus
                  maxLength={512}
                  className="w-full text-black text-lg placeholder:text-black bg-inherit border-none focus:border-transparent focus:ring-0 p-0"
                  onKeyUp={(event) => search(event)}
                  onFocus={(event) => event.target.value !== '' && search(event)}
                  onChange={(event) => !event.target.value && setShowHits(false)}
                />
              </div>
            </div>
            <div className='items-center cursor-pointer block minlg:hidden' onClick={() => {
              setSearchModalOpen(false);
            }}>
              <EllipseX />
            </div>
          </div>
          {showHits && keyword !== ''
            ? (
              <div
                ref={resultsRef}
                className={tw(
                  isHeader ? 'absolute -translate-x-1/2 mt-16 max-w-[27rem]' : '',
                  'bg-always-white flex flex-col w-full text-rubik')}>
                {searchResults.length > 0 && <>
                  {searchResults[0].found === 0 && searchResults[1].found === 0 ?
                    (<div className="mt-10 self-center text-base font-grotesk font-medium text-gray-500 pb-4">
                      No results found. Please try another keyword.
                    </div>) :
                    <div className="py-4">
                      <ResultsContent searchResults={searchResults} />
                      {isHeader && <span className="px-5 text-xs text-gray-400">Press enter for all results</span>}
                    </div>
                  }
                </>}
              </div>)
            :
            isHeader
              ? '' :
              (<div className="mt-14 minlg:mt-5 self-center text-base font-grotesk font-medium text-gray-500 pb-4">
                Enter a keyword to begin searching.
              </div>)}
        </div>
      </>);
  } else {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex space-x-2 p-5">
            <div className={tw(
              'relative flex items-center border border-gray-300 rounded-xl p-2 w-full text-black')}>
              <SearchIcon className='mr-2 shrink-0 aspect-square' />
              <div className="w-full">
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search for NFTs..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoFocus
                  maxLength={512}
                  className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
                  onKeyUp={(event) => search(event)}
                  onFocus={(event) => event.target.value !== '' && search(event)}
                  onChange={(event) => !event.target.value && setShowHits(false)}
                />
              </div>
            </div>
            <div className='flex items-center cursor-pointer block minlg:hidden' onClick={() => {
              setSearchModalOpen(false);
            }}>
              <EllipseX />
            </div>
          </div>
          {showHits && keyword !== ''
            ? (
              <div
                ref={resultsRef}
                className={tw(
                  isHeader ? 'absolute mt-16 max-w-[27rem]' : '',
                  'bg-always-white flex flex-col w-full text-rubik')}>
                {searchResults.length > 0 && <>
                  {searchResults[0].found === 0 && searchResults[1].found === 0 ?
                    (<div className="mt-10 self-center text-base font-grotesk font-medium text-gray-500 pb-4">
                      No results found. Please try another keyword.
                    </div>) :
                    <div className="py-4">
                      <ResultsContent searchResults={searchResults} />
                      {isHeader && <span className="px-5 text-xs text-gray-400">Press enter for all results</span>}
                    </div>
                  }
                </>}
              </div>)
            :
            isHeader
              ? '' :
              (<div className="mt-14 minlg:mt-5 self-center text-base font-grotesk font-medium text-gray-500 pb-4">
                Enter a keyword to begin searching.
              </div>)}
        </div>
      </>);
  }
};
