import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NftType } from 'graphql/generated/types';
export interface OffersRowProps {
  nft?: NftType;
}

export function OffersRow(props: OffersRowProps) {
  return (
    <div className='font-noi-grotesk flex items-start justify-between mb-2'>
      <div className='flex items-start w-full'>
        <RoundedCornerMedia
          variant={RoundedCornerVariant.None}
          containerClasses='w-[36px] h-[36px]  overflow-hidden'
          src={'https://cdn2.nft.com/AaUUFf8lHoAVhmM5kTU7wt18ohoBNIZoMxKoKJdufPg/rs:fit:1000:1000:0/g:no/aHR0cHM6Ly9jZG4uZ2VuLmFydC8xMDAwMTAwODE1XzE2MzM4MzgxOTQucG5nP3dpZHRoPTYwMA.webp'}
          extraClasses='aspect-square rounded-full'
        />
        <div className='ml-3 w-full'>
          <div className='flex items-center'>
            <div className='mr-1.5 font-semibold'>John Will</div>
            <div className='mr-1.5 font-medium text-[#6A6A6A]'>made an offer on</div>
            <div className='mr-1.5 font-semibold'>NFT Name</div>
          </div>
          <div className='mt-2 rounded-[22px] p-4 border border-[#EFEFEF] w-full h-full'>
            <div className='flex items-start'>
              <RoundedCornerMedia
                variant={RoundedCornerVariant.None}
                containerClasses='w-[64px] h-[64px] overflow-hidden'
                src={'https://cdn2.nft.com/AaUUFf8lHoAVhmM5kTU7wt18ohoBNIZoMxKoKJdufPg/rs:fit:1000:1000:0/g:no/aHR0cHM6Ly9jZG4uZ2VuLmFydC8xMDAwMTAwODE1XzE2MzM4MzgxOTQucG5nP3dpZHRoPTYwMA.webp'}
                extraClasses='aspect-square rounded-[6px]'
              />
              <div className='ml-3'>
                <div className='border-b border-[#E3E3E3] mb-3 text-[14px]'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-[#4D4D4D]'>Bid Amount</div>
                    <div className='font-medium text-[#585757]'>@ 1.50 ETH</div>
                  </div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-[#4D4D4D]'>Bid Expiration</div>
                    <div className='font-medium text-black'>7 Days</div>
                  </div>
                </div>
                <div className='flex items-center font-medium mt-3'>
                  <div onClick={() => {
                    alert('something');
                  }} className='cursor-pointer rounded-[12px] text-center px-10 py-1.5 text-[15px] text-white bg-[#26AA73]'>
                    Accept
                  </div>
                  <div onClick={() => {
                    alert('something');
                  }} className='cursor-pointer ml-3 rounded-[12px] text-center px-10 py-1.5 text-[15px] text-white bg-[#6A6A6A]'>
                    Decline
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='text-[#B2B2B2] ml-5 whitespace-nowrap'>
        1d ago
      </div>
    </div>
  );
}
