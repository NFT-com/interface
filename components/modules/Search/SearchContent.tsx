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
  mobileSearch?: boolean;
}

export const SearchContent = ({ isHeader, mobileSearch }: SearchContentProps) => {
  const [showHits, setShowHits] = useState(false);
  const [keyword, setKeyword] = useState('0');
  const [inputFocus, setInputFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [transitionWidth, setTransitionWidth] = useState('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
  const { setSearchModalOpen } = useSearchModal();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const router = useRouter();
  const resultsRef = useRef();
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClickAlerter(wrapperRef, () => {
    setInputFocus(false);
  });

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
    setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
  });

  const goTo = (document) => {
    if (!document.nftName) {
      router.push(`/app/collection/${document.contractAddr}/`);
    } else {
      router.push(`/app/nft/${document.contractAddr}/${document.tokenId}`);
    }
    setSearchModalOpen(false);
    setShowHits(false);
    setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
    inputRef.current.value = '';
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

      inputRef.current.value = '';
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
      setTransitionWidth('w-[18.4rem]');
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
            setSearchModalOpen(false);
            setShowHits(false);
            router.push(`/app/discover/${collectionName}/${keyword}`);
            setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
            inputRef.current.value = '';
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
                        'items-start my-1 py-3 w-full',
                        'text-sm font-semibold text-black',
                        'whitespace-nowrap text-ellipsis overflow-hidden')}
                      onClick={() => goTo(hit.document)}>
                      {hit.document.nftName ?? hit.document.contractName}
                    </div>
                  </div>
                );
              }))}
          </div>
        </div>
      );
    });
  };

  if(mobileSearch){
    return (
      <>
        <div id='mobile-search' className={tw(
          'flex flex-col font-noi-grotesk  relative',
          router.pathname !== '/' && 'px-6'
        )}>
          <div ref={wrapperRef} onClick={() => setInputFocus(true)} className={tw(
            'flex space-x-2 p-5 py-3 minlg:space-x-0 minlg:p-0 rounded-full bg-[#F8F8F8]',
            inputFocus && router.pathname !== '/' && 'border-2 border-[#F9D54C]',
            'h-[52px]'
          )}>
            <div className={tw(
              'relative flex items-center w-full text-black')}>
              <SearchIcon color='#000000' className='mr-2 shrink-0 aspect-square' />
              <div className="w-full">
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search profiles and NFTs by name..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  maxLength={512}
                  className={tw(
                    'w-full text-black text-lg placeholder:text-black bg-inherit border-none p-0',
                    'focus:border focus:border-[#F9D54C] focus:ring-0 focus:placeholder:text-[#B2B2B2] transition-[width]'
                  )}
                  onKeyUp={(event) => search(event)}
                  onFocus={(event) => event.target.value !== '' && search(event)}
                  onChange={(event) => !event.target.value && setShowHits(false)}
                />
              </div>
            </div>
          </div>
          {showHits && keyword !== ''
            ? (
              <div
                ref={resultsRef}
                className={tw(
                  'absolute left-0 minmd:left-6 mt-16 w-full max-w-[27rem] shadow-lg',
                  'bg-always-white flex flex-col w-full text-rubik z-[111] justify-center')}>
                {searchResults.length > 0 && <>
                  {searchResults[0].found === 0 && searchResults[1].found === 0 ?
                    (<div className="mt-10 self-center text-base font-medium text-gray-500 pb-4 text-center">
                      No results found. Please try another keyword.
                    </div>) :
                    <div className="py-4">
                      <ResultsContent searchResults={searchResults} />
                      {isHeader && <span className="px-5 text-xs text-gray-400">Press enter for all results</span>}
                    </div>
                  }
                </>}
              </div>
            )
            :
            ''
          }
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col font-noi-grotesk relative">
        <div className="flex space-x-2 p-5 minlg:space-x-0 minlg:p-0">
          <div className={tw(
            'relative flex items-center w-full text-black')}>
            <SearchIcon color='#000000' className='mr-2 shrink-0 aspect-square' />
            <div className="w-full">
              <input
                ref={inputRef}
                type="search"
                placeholder="Search profiles and NFTs by name..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength={512}
                className={tw(
                  'text-black text-lg placeholder:text-black bg-inherit border-none p-0',
                  'focus:border-transparent focus:ring-0 focus:placeholder:text-[#B2B2B2]',
                  transitionWidth
                )}
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
                isHeader ? 'absolute left-0 mt-16 max-w-[27rem]' : '',
                'bg-always-white flex flex-col w-full text-rubik')}>
              {searchResults.length > 0 && <>
                {searchResults[0].found === 0 && searchResults[1].found === 0 ?
                  (<div className="mt-10 self-center text-base font-medium text-gray-500 pb-4 text-center">
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
            (<div className="mt-14 minlg:mt-5 self-center text-base font-medium text-gray-500 pb-4">
                Enter a keyword to begin searching.
            </div>)}
      </div>
    </>);
};
