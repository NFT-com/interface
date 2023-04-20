import Link from 'next/link';

export default function MintProfileCardSkeleton() {
  return (
    <div className='relative z-50 mt-16 minlg:mt-12'>
      <div>
        <div className='h-10 animate-pulse rounded-xl bg-gray-300'></div>
        <div className='mt-9 h-8 animate-pulse rounded-xl bg-gray-300'></div>

        <div className='mt-9 h-8 animate-pulse rounded-xl bg-gray-300'></div>
        <div className='mt-12 minlg:mt-[59px]'>
          <div className='h-16 animate-pulse rounded-xl bg-gray-300'></div>
        </div>
        <Link href='https://docs.nft.com/nft-profiles/what-is-a-nft-profile' passHref className='mt-4'>
          <p className='mt-4 text-left text-xl font-normal text-[#727272] minlg:text-center minlg:text-base'>
            Learn more about <span className='inline font-medium text-black'>NFT Profiles</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
