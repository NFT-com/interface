import { PartialDeep } from 'type-fest';

import BlurImage from 'components/elements/BlurImage';
import LikeCount from 'components/elements/LikeCount';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { LikeableType, Profile } from 'graphql/generated/types';
import { useProfileLikeQuery } from 'graphql/hooks/useProfileLikeQuery';
import { useProfileVisibleNFTCount } from 'graphql/hooks/useProfileVisibleNFTCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { nftComCdnLoader } from 'lib/image/loader';

import BannerPreview from 'public/banner_1@2x.webp';
import GK from 'public/icons/Badge_Key.svg?svgr';
import ProfilePreview from 'public/profilePreview.webp';

export interface ProfileCardProps {
  profile?: PartialDeep<Profile>;
  isLeaderBoard?: boolean;
  id?: string;
  number?: number;
  itemsVisible?: number;
  photoURL?: string;
  url?: string;
  isGkMinted?: boolean;
}

export function ProfileCard(props: ProfileCardProps) {
  const { isLeaderBoard } = props;
  const defaultChainId = useDefaultChainId();
  const { totalItems } = useProfileVisibleNFTCount([props?.profile?.id], defaultChainId);

  const { profileData: profileLikeData } = useProfileLikeQuery(props?.profile?.url);

  if (isLeaderBoard) {
    return (
      <div className='flex justify-center'>
        <a
          href={`/${props?.url}`}
          className='flex w-full max-w-[320px] cursor-pointer flex-col items-start justify-between overflow-hidden rounded-[16px] px-6 py-4 font-noi-grotesk shadow-lg transition-all hover:scale-[1.01] minmd:h-[6.25rem] minmd:max-w-[100%] minmd:flex-row minmd:items-center minmd:py-0'
        >
          <div className='mb-3 flex items-center justify-start minmd:mb-0'>
            <div className='flex items-center justify-start'>
              <div className='mr-2 minmd:mr-6'>#{props.number + 1}</div>
              <div className='w-10 overflow-hidden rounded-[80px] minmd:w-20'>
                <RoundedCornerMedia
                  variant={RoundedCornerVariant.None}
                  width={600}
                  height={600}
                  containerClasses='w-[100%] object-cover h-[100%]'
                  src={props.photoURL}
                  extraClasses='hover:scale-105 transition'
                />
              </div>
            </div>
            <div className='flex flex-row items-center justify-start pl-3 minmd:pl-8'>
              <span className='pr-2 text-xl font-[500] text-[#000000]'>{props.url}</span>
              {props?.isGkMinted && (
                <div className='h-5 w-5 minlg:h-6 minlg:w-6'>
                  <GK />
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row items-center'>
            <div className='text-base text-[#6A6A6A]'>
              <span className='text-lg font-[600] text-[#000]'>{props.itemsVisible}</span> NFTs collected
            </div>
          </div>
        </a>
      </div>
    );
  }
  return (
    <a
      href={`/${props.profile?.url}`}
      className='cursor-p mb-3 h-[212px] cursor-pointer overflow-hidden rounded-[16px] shadow-lg transition-all minmd:mb-0'
    >
      <div className='relative h-[99px] bg-black'>
        <div className='absolute right-4 top-4 z-50'>
          <LikeCount
            count={profileLikeData?.profile?.likeCount || 0}
            isLiked={profileLikeData?.profile?.isLikedBy || false}
            likeData={{
              id: props?.id ?? props?.profile?.id,
              type: LikeableType.Profile,
              profileName: props?.profile?.url
            }}
          />
        </div>

        {props.profile.bannerURL ? (
          <RoundedCornerMedia
            variant={RoundedCornerVariant.None}
            width={600}
            height={600}
            loader={nftComCdnLoader}
            containerClasses='w-[100%] object-cover h-[100%]'
            src={props.profile.bannerURL}
            extraClasses='hover:scale-105 transition'
          />
        ) : (
          <BlurImage
            fill
            alt='key Splash'
            src={BannerPreview}
            loader={nftComCdnLoader}
            className='h-full object-cover'
          />
        )}
        <div className='absolute -bottom-[27px] left-4 h-[54px]  w-[54px] overflow-hidden rounded-[50%] border-[5px] border-[#ffffff] bg-[#ffffff]'>
          {props.profile.photoURL ? (
            <RoundedCornerMedia
              variant={RoundedCornerVariant.None}
              width={600}
              height={600}
              containerClasses='w-[100%] object-cover h-[100%]'
              src={props.profile.photoURL}
              extraClasses='hover:scale-105 transition'
            />
          ) : (
            <BlurImage fill alt='key Splash' src={ProfilePreview} className='h-full object-cover' />
          )}
        </div>
      </div>
      <div className='h-[113px] bg-white pb-4 pl-5 pr-4 pt-8'>
        <ul className='flex list-none flex-row justify-between'>
          <li className='m-0 flex list-none items-center p-0 text-xl font-[600] text-[#000000]'>
            <span className='pr-2 text-xl font-bold text-[#F9D54C]'>/ </span>
            {props.profile?.url}
            {props?.profile?.isGKMinted && (
              <div className='ml-2 h-5 w-5 minlg:h-6 minlg:w-6'>
                <GK />
              </div>
            )}
          </li>
        </ul>
        <ul className='mt-2 flex list-none flex-row justify-between'>
          <li className='text-5 m-0 list-none p-0 font-[600] leading-7 text-[#000000]'>
            {totalItems} <span className='text-4 font-[400] leading-6 text-[#6A6A6A]'> NFTs collected</span>
          </li>
        </ul>
      </div>
    </a>
  );
}
