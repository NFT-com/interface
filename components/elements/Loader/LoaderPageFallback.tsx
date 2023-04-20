import React from 'react';

import ClientOnly from 'components/elements/ClientOnly';

import Loader from './Loader';

export default function LoaderPageFallback() {
  return (
    <ClientOnly>
      <div className='flex min-h-screen w-full items-center justify-center py-10'>
        <span className='flex flex-col gap-4'>
          <h2 className='text-3xl font-black'>Loading...</h2>
          <Loader title='Loading...' stroke='stroke-[#707070]' size='h-32' />
        </span>
      </div>
    </ClientOnly>
  );
}
