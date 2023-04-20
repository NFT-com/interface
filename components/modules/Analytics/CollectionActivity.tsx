import { useCallback, useEffect, useState } from 'react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useGetTxByContractQuery } from 'graphql/hooks/useGetTxByContractQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { usePaginator } from 'hooks/usePaginator';
import { filterNulls, isNullOrEmpty } from 'utils/format';

import DetailPageTableRow from './DetailPageTableRow';

export type CollectionActivityProps = {
  contract: string;
};
export const CollectionActivity = ({ contract }: CollectionActivityProps) => {
  const defaultChainId = useDefaultChainId();
  const [collectionData, setCollectionData] = useState([]);
  const [lastAddedPage, setLastAddedPage] = useState('');
  const { nextPage, afterCursor, setTotalCount, cachedTotalCount } = usePaginator(25);

  const txs = useGetTxByContractQuery(contract, {
    first: 25,
    afterCursor
  });

  const loadMoreActivities = useCallback(() => {
    nextPage(txs?.data?.pageInfo?.lastCursor);
  }, [nextPage, txs?.data?.pageInfo?.lastCursor]);

  useEffect(() => {
    if (txs?.data?.items?.length > 0 && lastAddedPage !== txs?.data?.pageInfo?.firstCursor) {
      setCollectionData([...collectionData, ...filterNulls(txs?.data?.items)]);
      setLastAddedPage(txs?.data?.pageInfo?.firstCursor);
      setTotalCount(txs?.data?.totalItems);
    } else {
      setTotalCount(txs?.data?.totalItems || 0);
    }
  }, [
    lastAddedPage,
    setTotalCount,
    afterCursor,
    txs?.data?.items,
    txs?.data?.pageInfo?.firstCursor,
    txs?.data?.totalItems,
    collectionData
  ]);

  useEffect(() => {
    if (!collectionData && txs) {
      setCollectionData(txs?.data?.items);
    }
  }, [defaultChainId, collectionData, txs, setTotalCount]);

  return (
    <div className='my-8 overflow-x-auto rounded-md p-4 font-noi-grotesk'>
      {isNullOrEmpty(collectionData) && (
        <>
          <p className='flex h-[200px] items-center justify-center rounded-[10px] border text-[#6F6F6F]'>
            No activity available
          </p>{' '}
          &#58;
          <table className='w-full table-auto border-collapse'>
            <thead className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>
              <tr className='... p-4 pb-3 pt-0 text-left'>
                <th className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Type</th>
                <th className='whitespace-nowrap p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Token ID</th>
                <th className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>From</th>
                <th className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>To</th>
                <th className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Marketplace</th>
                <th className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Price</th>
                <th className='whitespace-nowrap p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>USD Value</th>
                <th className='whitespace-nowrap p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Timestamp</th>
                <th className='whitespace-nowrap p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>Transaction Hash</th>
              </tr>
            </thead>
            <tbody className='p-4'>
              {collectionData?.map((tx, index) => (
                <DetailPageTableRow key={tx?.id} tx={tx} index={index} />
              ))}
            </tbody>
          </table>
        </>
      )}
      {cachedTotalCount > collectionData?.length && !isNullOrEmpty(collectionData) && (
        <div className='flex w-full items-center justify-center'>
          <Button
            type={ButtonType.PRIMARY}
            size={ButtonSize.LARGE}
            onClick={() => loadMoreActivities()}
            label='Load More'
          />
        </div>
      )}
    </div>
  );
};
