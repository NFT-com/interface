import { SearchContent } from 'components/modules/Search/SearchContent';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export const SearchBar = () => {
  const [showHits, setShowHits] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const resultsRef = useRef();

  useEffect(() => {
    if (!router.pathname.includes('discover/')) {
      //inputRef.current.value = '';
      setShowHits(false);
      setSearchResults([]);
    }
  },[router.pathname]);

  useOutsideClickAlerter(resultsRef, () => {
    setShowHits(false);
    setSearchResults([]);
  });

  return (
    <SearchContent isHeader />);
};
