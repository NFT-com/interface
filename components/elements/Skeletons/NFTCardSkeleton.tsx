import { tw } from 'utils/tw';

import Heart from 'public/icons/heart.svg?svgr';

export function NFTCardSkeleton() {
  return (
    <div className='relative h-full w-full animate-pulse'>
      <div
        className={tw(
          'group/ntfCardSkeleton relative h-full w-full cursor-pointer overflow-visible rounded-2xl shadow-xl transition-all minmd:mb-0'
        )}
      >
        <div className={tw('relative mb-10 flex h-max w-full flex-col object-cover')}>
          <div className='relative aspect-square w-full rounded-t-2xl bg-[#E6E6E6]'>
            <div className={tw('absolute right-4 top-4', 'bg-footer-bg', ' h-10 w-max rounded-[10px]  px-3')}>
              <div className='flex h-full flex-row items-center justify-center space-x-2'>
                <div className='flex h-5 w-[18px]'>
                  <Heart fill={'#B2B2B2'} />
                </div>
                <div className='h-2 w-4 rounded-full bg-[#B2B2B266]'></div>
              </div>
            </div>
          </div>
          <div className='w-full px-5'>
            <div className='mt-6 h-3 w-full rounded-full bg-[#F2F3F5]'></div>
            <div className='mt-5 h-3 w-1/3 rounded-full bg-[#F2F3F5]'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
