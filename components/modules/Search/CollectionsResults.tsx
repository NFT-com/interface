import CollectionsSlider from 'components/elements/CollectionsSlider';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { SearchableFields } from 'utils/typeSenseAdapters';

import router from 'next/router';
import { useEffect, useState } from 'react';

export const CollectionsResults = (props: {searchTerm: string}) => {
  const [results, setsResults] = useState([]);
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const [found, setFound] = useState([]);
    
  useEffect(() => {
    screenWidth && fetchTypesenseMultiSearch({ searches: [{
      collection: 'collections',
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: props.searchTerm,
      per_page: 20,
      page: 1,
    }] })
      .then((resp) => {
        setsResults([...resp.results[0].hits]);
        setFound(resp.results[0].found);
      });
  },[fetchTypesenseMultiSearch, props.searchTerm, screenWidth]);

  return(
    <>
      <div className="flex justify-between items-center font-grotesk font-bold text-base minmd:text-lg text-blog-text-reskin mt-12">
        <span> {found + ' ' + 'COLLECTIONS'} </span>
        <span
          className="cursor-pointer hover:font-semibold"
          onClick={() => { router.push(`/app/discover/collections/${props.searchTerm}`); }}
        >
          SEE ALL
        </span>
      </div>
      {results && results.length > 0 && <CollectionsSlider full slides={results} />}
    </>
  );
};