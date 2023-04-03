import Loader from './Loader';

import React from 'react';

export default function LoaderPageFallback() {
  return (
    <div className='flex justify-center items-center py-10 h-full w-full' >
      <span className="flex flex-col gap-4">
        <h2 className="text-3xl font-black">
          Loading...
        </h2>
        <Loader title="Loading..." stroke='stroke-[#707070]' size='h-32' />
      </span>
    </div>
  );
}
