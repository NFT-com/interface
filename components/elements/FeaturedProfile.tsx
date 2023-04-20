import { BigNumber } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PartialDeep } from 'type-fest';

import { Nft, ProfileQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import Loader from './Loader/Loader';
import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

interface FeaturedProfileProps {
  profileOwner: ProfileQuery;
  gkId: number;
  featuredNfts: PartialDeep<Nft>[];
}

export const FeaturedProfile = (props: FeaturedProfileProps) => {
  const router = useRouter();

  return (
    <div className='h-full w-full py-4 font-noi-grotesk text-body font-header leading-body text-[#6F6F6F] drop-shadow-2xl minlg:py-12'>
      <p className='mb-4 minlg:mb-2'>Featured Profile</p>
      <div className='flex max-w-[578px] flex-col rounded-md bg-[#B0AFAF26]/20 px-4 py-6 backdrop-blur-xl minmd:max-w-[478px]'>
        <div
          className='mb-5 flex cursor-pointer flex-row items-center'
          onClick={() => router.push(`/${props.profileOwner.profile.url}`)}
        >
          <div className='mr-2 mt-0.5 h-10 w-10'>
            {props.profileOwner ? (
              <Link href={props.profileOwner.profile.url}>
                <Image
                  src={props.profileOwner?.profile?.photoURL ?? 'https://cdn.nft.com/profile-image-default.svg'}
                  alt='featured profile main image'
                  className='rounded-full'
                  width='40'
                  height='40'
                />
              </Link>
            ) : (
              <Loader />
            )}
          </div>
          <p className='font-noi-grotesk text-xl text-[#6F6F6F]'>{props?.profileOwner?.profile?.url}</p>
        </div>
        <div
          className={tw(
            'grid grid-cols-none grid-rows-1 minmd:grid-cols-2 minmd:grid-rows-[49%_49%]',
            'grid-flow-col gap-4 minmd:grid-flow-row minmd:gap-2',
            'auto-cols-[90%] minmd:auto-cols-auto',
            'overflow-x-auto',
            'max-h-max min-h-[410px] minmd:max-h-[400px] minmd:min-h-[250px]',
            'overscroll-x-contain minmd:overscroll-auto'
          )}
        >
          <Link
            href={`/app/nft/${props.featuredNfts[0]?.contract}/${props.featuredNfts[0]?.tokenId}`}
            passHref
            legacyBehavior
          >
            <a className='row-auto flex aspect-square h-full w-full flex-col minmd:row-span-2 minmd:aspect-auto minmd:h-auto'>
              <RoundedCornerMedia
                priority={true}
                src={props.featuredNfts[0]?.previewLink || props.featuredNfts[0]?.metadata?.imageURL}
                variant={RoundedCornerVariant.None}
                extraClasses='relative rounded-t-md object-cover'
                containerClasses='h-full w-full'
              />
              {props.featuredNfts[0] && (
                <div className='rounded-b-md bg-white px-3 py-2'>
                  <p className='text-xxs2 text-[#727272] '>
                    {props.featuredNfts[0]?.metadata?.name ||
                      `#${BigNumber.from(props.featuredNfts[0]?.tokenId).toString()}`}
                  </p>
                  <p className='-mt-1 text-sm text-black'>
                    {props.featuredNfts[0]?.metadata?.name ||
                      `#${BigNumber.from(props.featuredNfts[0]?.tokenId).toString()}`}
                  </p>
                </div>
              )}
            </a>
          </Link>
          <div className='col-span-1 row-span-1 h-full w-full'>
            <Link
              href={`/app/nft/${props.featuredNfts[1]?.contract}/${props.featuredNfts[1]?.tokenId}`}
              passHref
              legacyBehavior
            >
              <a className='row-auto flex aspect-square h-full w-full flex-col justify-start minmd:aspect-auto'>
                <RoundedCornerMedia
                  priority={true}
                  src={props.featuredNfts[1]?.previewLink || props.featuredNfts[1]?.metadata?.imageURL}
                  variant={RoundedCornerVariant.None}
                  extraClasses='relative rounded-t-md object-cover'
                  containerClasses='h-full max-h-[77%] sm:max-h-full sm:w-full'
                />
                {props.featuredNfts[1] && (
                  <div className='... h-max max-h-[50%] overflow-hidden truncate rounded-b-md bg-white px-3 py-2 minmd:px-3 minmd:py-1'>
                    <p className='truncate text-xxs2 text-[#727272] minmd:text-xxs4'>
                      {props.featuredNfts[1]?.metadata?.name ||
                        `#${BigNumber.from(props.featuredNfts[1]?.tokenId).toString()}`}
                    </p>
                    <p className='-mt-1 truncate text-sm text-black minmd:text-xs'>
                      {props.featuredNfts[1]?.metadata?.name ||
                        `#${BigNumber.from(props.featuredNfts[1]?.tokenId).toString()}`}
                    </p>
                  </div>
                )}
              </a>
            </Link>
          </div>
          <div className='col-span-1 row-span-1 h-full w-full'>
            <Link
              href={`/app/nft/${props.featuredNfts[2]?.contract}/${props.featuredNfts[2]?.tokenId}`}
              passHref
              legacyBehavior
            >
              <a className='row-auto flex aspect-square h-full w-full flex-col justify-end minmd:aspect-auto'>
                <RoundedCornerMedia
                  priority={true}
                  src={props.featuredNfts[2]?.previewLink || props.featuredNfts[2]?.metadata?.imageURL}
                  variant={RoundedCornerVariant.None}
                  extraClasses='relative rounded-t-md object-cover'
                  containerClasses='h-full max-h-[77%] sm:max-h-full sm:w-full'
                />
                {props.featuredNfts[2] && (
                  <div className='... h-max max-h-[50%] truncate rounded-b-md bg-white px-3 py-2 minmd:px-3 minmd:py-1'>
                    <p className='truncate text-xxs2 text-[#727272] minmd:text-xxs4'>
                      {props.featuredNfts[2]?.metadata?.name ||
                        `#${BigNumber.from(props.featuredNfts[2]?.tokenId).toString()}`}
                    </p>
                    <p className='-mt-1 truncate text-sm text-black  minmd:text-xs'>
                      {props.featuredNfts[2]?.metadata?.name ||
                        `#${BigNumber.from(props.featuredNfts[2]?.tokenId).toString()}`}
                    </p>
                  </div>
                )}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
