import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { ResultsDropDownDisplay } from 'components/modules/Search/ResultsDropDownDisplay';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import useDebounce from 'hooks/useDebounce';
import { tw } from 'utils/tw';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof ResultsDropDownDisplay>>(() => import('components/modules/Search/ResultsDropDownDisplay').then(mod => mod.ResultsDropDownDisplay));

export default function AssociatedProfileSelect() {
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();

  // formState and searchState are separate to allow click to set formState without triggering another search
  const [formState, setFormState] = useState({
    associatedCollectionSearch: ''
  });
  const [searchState, setSearchState] = useState({
    associatedCollectionSearch: ''
  });
  const debouncedSearch = useDebounce(searchState.associatedCollectionSearch, 250);

  const [searchResults, setSearchResults] = useState({} as any);
  const [selectedResult, setSelectedResult] = useState();

  useEffect(() => {
    if (debouncedSearch?.length) {
      fetchTypesenseSearch({
        index: 'collections',
        q: debouncedSearch,
        query_by: 'contractAddr,contractName',
        filter_by: 'isOfficial:true',
        per_page: 5,
        page: 1,
      })
        .then((results) => {
          setSearchResults(results);
        });
    } else {
      setSearchResults({});
    }
  }, [fetchTypesenseSearch, debouncedSearch]);

  const onChangeHandler = e => {
    setFormState({
      associatedCollectionSearch: e.target.value
    });
    setSearchState({
      associatedCollectionSearch: e.target.value
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
  };

  const onItemListClickHandler = (searchDoc) => {
    setFormState({
      associatedCollectionSearch: searchDoc.contractName
    });
    setSelectedResult(searchDoc);
    setSearchResults({});
  };

  const resetState = () => {
    setFormState({
      associatedCollectionSearch: ''
    });

    setSearchState({
      associatedCollectionSearch: ''
    });
    setSearchResults({});
    setSelectedResult(undefined);
  };
  const onButtonClickHandler = () => {
    console.log(selectedResult);
    resetState();
  };

  return (
    <div className='w-full'>
      <div className='relative mb-3'>
        <h3 className='text-blog-text-reskin text-base font-semibold tracking-wide mb-1'>
          Select NFT Collection
        </h3>
        <form onSubmit={onSubmitHandler}>
          <label htmlFor='associatedCollectionSearch' className='text-blog-text-reskin mb-4 inline-block'>Enter Collection address or name</label>
          <input
            id='associatedCollectionSearch'
            name ='associatedCollectionSearch'
            type='text'
            className={tw('box-border shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  placeholder:font-mono placeholder:text-sm pr-10',
              formState.associatedCollectionSearch === '' ? 'border-[#D5D5D5]' : 'border-[#0E8344] focus:ring-[#0E8344] focus:ring-1 focus:border-[#0E8344]',
            )}
            onChange={onChangeHandler}
            value={formState.associatedCollectionSearch} />
        </form>
        {!!searchResults?.found && <DynamicResultsDropDown
          isHeader={false}
          searchResults={[searchResults]}
          itemListOnClick={onItemListClickHandler}
        />}
      </div>
      <Button
        type={ButtonType.PRIMARY}
        size={ButtonSize.LARGE}
        label='Display Collection'
        stretch
        disabled={!selectedResult }
        onClick={onButtonClickHandler}
      />
    </div>
  );
}