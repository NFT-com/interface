import { tw } from 'utils/tw';

import NoActivityIcon from 'public/icons/no_activity.svg?svgr';
import React from 'react';

export default function NoComments(){
  return (
    <div className='w-full'>
      <div className={tw(
        'flex justify-start items-start w-full flex-col mb-3'
      )}>
      </div>
      <div className={tw(
        'flex justify-center items-center w-full flex-col'
      )}>
        <NoActivityIcon className='mt-10 h-[176px]' />
        <div className={tw(
          'text-lg mt-8'
        )}>Be the first to comment on this NFT for this owner!</div>
      </div>
    </div>
  );
}
