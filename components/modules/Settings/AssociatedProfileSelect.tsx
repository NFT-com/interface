import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { CheckCircle, Warning } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { ResultsDropDownDisplay } from 'components/modules/Search/ResultsDropDownDisplay';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import useDebounce from 'hooks/useDebounce';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { isNullOrEmpty } from 'utils/format';
import { cl } from 'utils/tw';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof ResultsDropDownDisplay>>(() =>
  import('components/modules/Search/ResultsDropDownDisplay').then(mod => mod.ResultsDropDownDisplay)
);

type AssociatedProfileSelectProps = {
  profileId: string;
  associatedContract?: string;
  onAssociatedContract: () => void;
};
export default function AssociatedProfileSelect({
  profileId,
  associatedContract,
  onAssociatedContract
}: AssociatedProfileSelectProps) {
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const { updateProfile } = useUpdateProfileMutation();
  const defaultChainId = useDefaultChainId();
  const { data: collectionQueryData } = useCollectionQuery({
    chainId: defaultChainId,
    contract: associatedContract
  });

  // formState and searchState are separate to allow click to set formState without triggering another search
  const [formState, setFormState] = useState({
    associatedCollectionSearch: ''
  });
  const [searchState, setSearchState] = useState({
    associatedCollectionSearch: ''
  });
  const debouncedSearch = useDebounce(searchState.associatedCollectionSearch, 250);

  const [searchResults, setSearchResults] = useState({} as any);
  const [selectedResult, setSelectedResult] = useState<{ id: string; contractAddr: string; logoUrl: string }>();
  const [error, setError] = useState<boolean | undefined>();

  useEffect(() => {
    if (collectionQueryData?.collection) {
      const { collection } = collectionQueryData;
      setSelectedResult({
        id: collection.id,
        contractAddr: collection.contract,
        logoUrl: collection.logoUrl
      });
      setFormState({
        associatedCollectionSearch: collection.name
      });
    }
  }, [collectionQueryData, setSelectedResult]);

  useEffect(() => {
    if (debouncedSearch?.length) {
      fetchTypesenseSearch({
        index: 'collections',
        q: debouncedSearch,
        query_by: 'contractAddr,contractName',
        filter_by: 'isOfficial:true',
        per_page: 5,
        page: 1
      }).then(results => {
        setSearchResults(results);
      });
    } else {
      setSearchResults({});
    }
  }, [fetchTypesenseSearch, debouncedSearch]);

  const validationHelpContent = useCallback(() => {
    if (isNullOrEmpty(searchState.associatedCollectionSearch)) {
      return null;
    }

    if (error) {
      return (
        <>
          <p className='mt-1 font-noi-grotesk text-xs text-[#DD0F70]'>Please select a collection from the dropdown</p>
          <Warning
            size={25}
            className='absolute right-0 top-[4.7rem] mr-3 box-border rounded-full'
            weight='fill'
            color='#DD0F70'
          />
        </>
      );
    }

    return (
      <>
        <p className='mt-1 font-noi-grotesk text-xs text-[#0E8344]'>Valid collection</p>
        <CheckCircle
          size={25}
          className='absolute right-0 top-[4.7rem] mr-3 box-border rounded-full'
          color='green'
          weight='fill'
        />
      </>
    );
  }, [error, searchState]);

  const hasFormBeenChanged = () => {
    return selectedResult && searchState.associatedCollectionSearch !== '';
  };

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

  const onItemListClickHandler = searchDoc => {
    setFormState({
      associatedCollectionSearch: searchDoc.contractName
    });
    setError(false);
    setSelectedResult(searchDoc);
    setSearchResults({});
  };

  const resetState = () => {
    setSearchState({
      associatedCollectionSearch: ''
    });
    setSearchResults({});
    setError(undefined);
  };

  const onButtonClickHandler = () => {
    if (selectedResult) {
      toast.success('Saved!');
      onAssociatedContract();
      updateProfile({
        id: profileId,
        associatedContract: selectedResult.contractAddr
      });
    }
    resetState();
  };

  return (
    <div className='w-full'>
      <div className='relative mb-3'>
        <h3 className='mb-1 text-base font-semibold tracking-wide text-blog-text-reskin'>Select NFT Collection</h3>
        <form onSubmit={onSubmitHandler}>
          <label htmlFor='associatedCollectionSearch' className='mb-4 inline-block text-blog-text-reskin'>
            Enter Collection address or name
          </label>
          <input
            id='associatedCollectionSearch'
            name='associatedCollectionSearch'
            type='text'
            className={cl(
              'focus:shadow-outline box-border w-full appearance-none rounded-[10px] border border-[#D5D5D5] px-3 py-2 pr-10 leading-tight text-gray-700 shadow  placeholder:font-mono placeholder:text-sm focus:outline-none',
              {
                'indent-7': selectedResult,
                'border-[#DD0F70] focus:border-[#DD0F70] focus:ring-1 focus:ring-[#DD0F70]':
                  hasFormBeenChanged && error,
                'border-[#0E8344] focus:border-[#0E8344] focus:ring-1 focus:ring-[#0E8344]':
                  hasFormBeenChanged() && !error
              }
            )}
            onChange={onChangeHandler}
            value={formState.associatedCollectionSearch}
          />
          {selectedResult && (
            <div className='absolute left-[.2rem] top-[4.36rem] h-[34x] w-[34px] min-w-[34px] overflow-hidden rounded-[16px]'>
              <RoundedCornerMedia
                variant={RoundedCornerVariant.None}
                width={600}
                height={600}
                containerClasses='w-[100%] h-[100%]'
                src={selectedResult.logoUrl}
              />
            </div>
          )}
          {validationHelpContent()}
        </form>
        {!!searchResults?.found && (
          <DynamicResultsDropDown
            isHeader={false}
            searchResults={[searchResults]}
            itemListOnClick={onItemListClickHandler}
          />
        )}
      </div>
      <Button
        type={ButtonType.PRIMARY}
        size={ButtonSize.LARGE}
        label='Display Collection'
        stretch
        disabled={!hasFormBeenChanged()}
        onClick={onButtonClickHandler}
      />
    </div>
  );
}
