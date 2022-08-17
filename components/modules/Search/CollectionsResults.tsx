import CollectionsSlider from 'components/elements/CollectionsSlider';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { SearchableFields } from 'utils/typeSenseAdapters';

import router from 'next/router';
import useSWR from 'swr';

export const CollectionsResults = (props: {searchTerm: string}) => {
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();

  const { data } = useSWR(screenWidth, async () => {
    let results = [];
    let found = 0;
    screenWidth && await fetchTypesenseMultiSearch({ searches: [{
      collection: 'collections',
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: props.searchTerm,
      per_page: 20,
      page: 1,
    }] })
      .then((resp) => {
        results = [...resp.results[0].hits];
        found = resp.results[0].found;
      });

    return { found, results };
  });

  return(
    <>
      <div className="flex justify-between items-center font-grotesk font-bold text-base minmd:text-lg text-blog-text-reskin mt-12">
        <span> {data?.found + ' ' + 'COLLECTIONS'} </span>
        <span
          className="cursor-pointer hover:font-semibold"
          onClick={() => { router.push(`/app/discover/collections/${props.searchTerm}`); }}
        >
          SEE ALL
        </span>
      </div>
      {data?.results && data?.results.length > 0 && <CollectionsSlider full slides={data?.results} />}
    </>
  );
};