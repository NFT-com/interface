import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useActivitiesForAddressQuery } from 'graphql/hooks/useActivitiesForAddressQuery';
import { useUpdateReadByIdsMutation } from 'graphql/hooks/useUpdateReadByIdsMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { usePaginator } from 'hooks/usePaginator';
import { filterNulls, isNullOrEmpty } from 'utils/format';

import ActivityTableRow from './ActivityTableRow';

const ACTIVITY_LOAD_COUNT = 50;

export default function ActivityPages() {
  const { nextPage, afterCursor, setTotalCount, cachedTotalCount } = usePaginator(ACTIVITY_LOAD_COUNT);
  const [lastAddedPage, setLastAddedPage] = useState('');
  const [activityData, setActivityData] = useState([]);
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const { updateReadbyIds } = useUpdateReadByIdsMutation();

  const { data: loadedActivitiesNextPage } = useActivitiesForAddressQuery(currentAddress, defaultChainId, {
    first: ACTIVITY_LOAD_COUNT,
    afterCursor
  });

  const loadMoreActivities = useCallback(() => {
    nextPage(loadedActivitiesNextPage?.getActivities?.pageInfo?.lastCursor);
  }, [loadedActivitiesNextPage?.getActivities?.pageInfo?.lastCursor, nextPage]);

  useEffect(() => {
    if (activityData.length) {
      updateReadbyIds({ ids: [] });
    }
  }, [updateReadbyIds, currentAddress, activityData]);

  useEffect(() => {
    setActivityData([]);
  }, [currentAddress]);

  useEffect(() => {
    if (
      loadedActivitiesNextPage?.getActivities?.items?.length > 0 &&
      lastAddedPage !== loadedActivitiesNextPage?.getActivities?.pageInfo?.firstCursor
    ) {
      setActivityData([...activityData, ...filterNulls(loadedActivitiesNextPage?.getActivities?.items)]);
      setLastAddedPage(loadedActivitiesNextPage?.getActivities?.pageInfo?.firstCursor);
      setTotalCount(loadedActivitiesNextPage?.getActivities?.totalItems);
    } else if (loadedActivitiesNextPage?.getActivities?.items?.length > 0 && isNullOrEmpty(activityData)) {
      setActivityData(filterNulls(loadedActivitiesNextPage?.getActivities?.items));
      setLastAddedPage(loadedActivitiesNextPage?.getActivities?.pageInfo?.firstCursor);
      setTotalCount(loadedActivitiesNextPage?.getActivities?.totalItems);
    } else {
      setTotalCount(loadedActivitiesNextPage?.getActivities?.totalItems || 0);
    }
  }, [
    lastAddedPage,
    setTotalCount,
    activityData,
    loadedActivitiesNextPage,
    afterCursor,
    loadedActivitiesNextPage?.getActivities?.items
  ]);

  return (
    <div className='flex flex-col justify-between px-4 font-noi-grotesk minlg:pt-28'>
      <div className='relative mx-auto w-full max-w-nftcom'>
        <h2 className='mb-6 text-[40px] font-bold text-black'>
          <span className='text-[#F9D963]'>/</span>
          My Activity
        </h2>
        <div className='my-8 min-h-[380px] overflow-x-auto rounded-md pb-8 pt-4 font-noi-grotesk'>
          <table className='w-full table-auto border-collapse'>
            <thead className='p-4 text-sm font-medium leading-6 text-[#6F6F6F]'>
              <tr className='... pb-3 pt-0 text-left'>
                <th className='px-8 pb-3 pt-0 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>Name</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>Status</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>Marketplace</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>Price</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>USD Value</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>Time</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>From</th>
                <th className='pb-4 pr-8 text-sm font-medium leading-6 text-[#6F6F6F] minmd:pr-4'>To</th>
              </tr>
            </thead>
            <tbody className='p-4'>
              {activityData?.map((item, i) => (
                <ActivityTableRow key={item.id} item={item} index={i} />
              ))}
            </tbody>
          </table>
          {!activityData ||
            (!activityData?.length && (
              <p className='flex h-[400px] items-center justify-center rounded-[10px] border text-[#6F6F6F]'>
                No activity available
              </p>
            ))}

          {cachedTotalCount > activityData?.length && (
            <div className='flex w-full justify-center'>
              <Button
                onClick={() => loadMoreActivities()}
                type={ButtonType.PRIMARY}
                size={ButtonSize.LARGE}
                label='Load More'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
