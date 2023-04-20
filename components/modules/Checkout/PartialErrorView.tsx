import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { tw } from 'utils/tw';

import { ExternalProtocol } from 'types';

import LooksrareIcon from 'public/icons/looksrare-icon.svg?svgr';
import NFTLogo from 'public/icons/nft_logo_yellow.svg?svgr';
import OpenseaIcon from 'public/icons/opensea-icon.svg?svgr';
import X2Y2Icon from 'public/icons/x2y2-icon.svg?svgr';

import { StagedListing } from './NFTListingsContext';
import { PartialErrorItem } from './PartialErrorItem';

export interface PartialErrorViewProps {
  listing: StagedListing;
}

export function PartialErrorView({ listing }: PartialErrorViewProps) {
  return (
    <>
      <div>
        <div
          className={tw(
            'flex rounded bg-[#F8F8F8] p-[10px]',
            listing.targets.some(target => target.listingError) && 'border border-[#E43D20] bg-[#FFF8F7]'
          )}
          key={listing.nft?.metadata?.name}
        >
          <RoundedCornerMedia
            containerClasses='w-[82px] h-[82px] z-10 mr-5'
            src={listing?.nft?.metadata?.imageURL}
            variant={RoundedCornerVariant.Success}
          />
          <div className='w-full'>
            <div className='flex flex-col justify-between minmd:flex-row'>
              <div className='mt-2'>
                <p className='truncate text-sm font-medium'>{listing.nft?.metadata?.name}</p>
                <p className='truncate text-xs text-[#6A6A6A]'>{listing.collectionName}</p>
              </div>
              <div>
                <div className='flex flex-row items-center'>
                  {listing?.targets?.some(t => !t.listingError) && (
                    <p className='mr-1.5 mt-1 text-xs font-medium text-[#26AA73]'>Completed</p>
                  )}
                  <div className='flex flex-row -space-x-2'>
                    {listing.targets.map(
                      target =>
                        !target.listingError && (
                          <>
                            {target.protocol === ExternalProtocol.Seaport && (
                              <OpenseaIcon
                                className='relative -mr-1 h-7 w-7 shrink-0 rounded-full outline outline-2 -outline-offset-4 outline-[#F8F8F8]'
                                alt='Opensea logo redirect'
                                layout='fill'
                              />
                            )}
                            {target.protocol === ExternalProtocol.LooksRare && (
                              <LooksrareIcon
                                className='relative -mr-1 h-7 w-7 shrink-0 rounded-full outline outline-2 -outline-offset-4 outline-[#F8F8F8]'
                                alt='Opensea logo redirect'
                                layout='fill'
                              />
                            )}
                            {target.protocol === ExternalProtocol.NFTCOM && (
                              <NFTLogo
                                className='relative mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-[#F8F8F8]'
                                alt='Opensea logo redirect'
                                layout='fill'
                              />
                            )}
                            {target.protocol === ExternalProtocol.X2Y2 && (
                              <X2Y2Icon
                                className='relative mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-[#F8F8F8]'
                                alt='Opensea logo redirect'
                                layout='fill'
                              />
                            )}
                          </>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              {listing.targets.map(
                (target, index) =>
                  target.listingError && (
                    <PartialErrorItem key={`listingError-${index}`} listing={listing} target={target} />
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
