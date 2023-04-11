import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { ResultsDropDownDisplay } from 'components/modules/Search/ResultsDropDownDisplay';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import useDebounce from 'hooks/useDebounce';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import dynamic from 'next/dynamic';
import { CheckCircle, Warning } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof ResultsDropDownDisplay>>(() => import('components/modules/Search/ResultsDropDownDisplay').then(mod => mod.ResultsDropDownDisplay));

type AssociatedProfileSelectProps = {
  profileId: string;
};
export default function AssociatedProfileSelect({ profileId }: AssociatedProfileSelectProps) {
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const { updateProfile } = useUpdateProfileMutation();

  // formState and searchState are separate to allow click to set formState without triggering another search
  const [formState, setFormState] = useState({
    associatedCollectionSearch: ''
  });
  const [searchState, setSearchState] = useState({
    associatedCollectionSearch: ''
  });
  const debouncedSearch = useDebounce(searchState.associatedCollectionSearch, 250);

  const [searchResults, setSearchResults] = useState({} as any);
  const [selectedResult, setSelectedResult] = useState<{id: string, contractAddr: string}>();
  const [error, setError] = useState<boolean | undefined>();

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

  const inputInfo = useCallback(() => {
    if(isNullOrEmpty(formState.associatedCollectionSearch)){
      return null;
    }
    
    if(error){
      return (
        <>
          <p className='text-[#DD0F70] mt-1 text-xs font-noi-grotesk'>Please select a collection from the dropdown</p>
          <Warning size={25} className='mr-3 rounded-full absolute box-border top-[4.7rem] right-0' weight="fill" color='#DD0F70' />
        </>
      );
    }

    return (
      <>
        <p className='text-[#0E8344] mt-1 text-xs font-noi-grotesk'>Valid collection</p>
        <CheckCircle size={25} className='mr-3 rounded-full absolute box-border top-[4.7rem] right-0' color='green' weight="fill" />
      </>
    );
  }, [error, formState]);

  const onChangeHandler = e => {
    if (selectedResult) {
      setSelectedResult(undefined);
    }
    setError(true);
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
    setError(false);
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
    setError(undefined);
  };
  const onButtonClickHandler = () => {
    if (selectedResult) {
      toast.success('Saved!');
      updateProfile({
        id: profileId,
        associatedContract: selectedResult.contractAddr,
      });
    }
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
              formState.associatedCollectionSearch === '' ? 'border-[#D5D5D5]' : selectedResult ? 'border-[#0E8344] focus:ring-[#0E8344] focus:ring-1 focus:border-[#0E8344]' : 'border-[#DD0F70] focus:ring-[#DD0F70] focus:ring-1 focus:border-[#DD0F70]',
            )}
            onChange={onChangeHandler}
            value={formState.associatedCollectionSearch} />
          {inputInfo()}
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