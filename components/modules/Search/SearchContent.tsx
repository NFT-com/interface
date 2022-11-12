import { ResultsDropDown as StaticResultsDropDown } from 'components/modules/Search/ResultsDropDown';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useEffect, useRef, useState } from 'react';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof StaticResultsDropDown>>(() => import('components/modules/Search/ResultsDropDown').then(mod => mod.ResultsDropDown));

interface SearchContentProps {
  isHeader?: boolean;
  mobileSearch?: boolean;
  mobileSidebar?: boolean;
}

export const SearchContent = ({ isHeader, mobileSearch, mobileSidebar }: SearchContentProps) => {
  const [showHits, setShowHits] = useState(false);
  const [keyword, setKeyword] = useState('0');
  const [inputFocus, setInputFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [transitionWidth, setTransitionWidth] = useState('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
  const { setSearchModalOpen, setDropDownSearchResults } = useSearchModal();
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
    }
    setSearchResults([]);
  }, [router.pathname]);

  useOutsideClickAlerter(resultsRef, () => {
    setShowHits(false);
    setSearchModalOpen(false);
    setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
  });

  const goTo = () => {
    setSearchModalOpen(false);
    setShowHits(false);
    setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
    inputRef.current.value = '';
    setDropDownSearchResults([]);
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
          setDropDownSearchResults([...data.results], target.value);
        })
        .catch((error) => {
          console.log(error);
          setShowHits(false);
        });

      setShowHits(true);
      setTransitionWidth('w-[18.4rem]');
    }
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
          {showHits && keyword !== '' && mobileSidebar === false
            ? (
              <div
                ref={resultsRef}>
                <DynamicResultsDropDown
                  isHeader={isHeader}
                  extraClasses={'mt-8 minmd:left-6 shadow-lg z-[111]'}
                  searchResults={searchResults}
                  resultTitleOnClick={() => {
                    setSearchModalOpen(false);
                    setShowHits(false);
                    setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
                    inputRef.current.value = '';
                    setDropDownSearchResults([]);
                  }}
                  itemListOnClick={goTo}
                />
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
            <div ref={resultsRef}>
              <DynamicResultsDropDown
                isHeader={isHeader}
                extraClasses={'mt-4'}
                searchResults={searchResults}
                resultTitleOnClick={() => {
                  setSearchModalOpen(false);
                  setShowHits(false);
                  setTransitionWidth('minlg:w-[4.65rem] focus:w-[18.4rem]  transition-[width]');
                  inputRef.current.value = '';
                  setDropDownSearchResults([]);
                }}
                itemListOnClick={goTo}
              />
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
