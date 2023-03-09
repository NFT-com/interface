import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Profile } from 'graphql/generated/types';

import Image from 'next/image';
import GK from 'public/Badge_Key.svg';
import BannerPreview from 'public/banner_1@2x.png';
import ProfilePreview from 'public/profilePreview.png';
import { PartialDeep } from 'type-fest';

export interface ProfileCardProps {
  name?: string,
  nftCounter?: string,
  followLink?: string,
  btnName?: string
  isLeaderBoard?: boolean
  bgImg?: string,
  id?: string,
  number?: number,
  index?: number,
  itemsVisible?: number,
  numberOfCollections?: number,
  numberOfGenesisKeys?: number,
  photoURL?: string,
  url?: string,
  profile?: PartialDeep<Profile>,
  isGkMinted?: boolean,
}

export function ProfileCard(props: ProfileCardProps) {
  const isLeaderBoard = props.isLeaderBoard;

  if (isLeaderBoard) {
    return (
      <div className='flex justify-center'>
        <a href={'/' + props?.url} className="max-w-[320px] minmd:max-w-[100%] flex-col minmd:flex-row py-4 minmd:py-0 px-6 font-noi-grotesk w-full flex justify-between items-start minmd:items-center hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] minmd:h-[6.25rem] shadow-lg overflow-hidden">
          <div className="mb-3 minmd:mb-0 flex justify-start items-center">
            <div className="flex justify-start items-center">
              <div className="mr-2 minmd:mr-6">
                #{props.number + 1}
              </div>
              <div className="w-10 minmd:w-20 rounded-[80px] overflow-hidden">
                <RoundedCornerMedia
                  variant={RoundedCornerVariant.None}
                  width={600}
                  height={600}
                  containerClasses='w-[100%] object-cover h-[100%]'
                  src={props.photoURL}
                  extraClasses="hover:scale-105 transition"
                />
              </div>
            </div>
            <div className="pl-3 minmd:pl-8 flex flex-row items-center justify-start">
              <span className="pr-2 text-xl text-[#000000] font-[500]">{props.url}</span>
              {props?.isGkMinted && <div className='h-5 w-5 minlg:h-6 minlg:w-6'>
                <GK />
              </div>}
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="text-[#6A6A6A] text-base"><span className="text-lg font-[600] text-[#000]">{props.itemsVisible}</span> NFTs collected</div>
          </div>
        </a>
      </div>
    );
  } else {
    return (
      <a href={'/' + props.profile?.url} className="mb-3 minmd:mb-0 transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden cursor-p h-[212px]">
        <div className="bg-black h-[99px] relative">
          {
            props.profile.bannerURL
              ? (
                <RoundedCornerMedia
                  variant={RoundedCornerVariant.None}
                  width={600}
                  height={600}
                  containerClasses='w-[100%] object-cover h-[100%]'
                  src={props.profile.bannerURL}
                  extraClasses="hover:scale-105 transition"
                />
              )
              : (
                <Image
                  src={BannerPreview}
                  className="h-full"
                  alt="key Splash"
                  layout="fill"
                  objectFit="cover"
                />
              )
          }
          <div className="w-[54px] h-[54px] bg-[#ffffff] overflow-hidden  border-[5px] border-[#ffffff] rounded-[50%] absolute left-4 -bottom-[27px]">
            {
              props.profile.photoURL
                ? (
                  <RoundedCornerMedia
                    variant={RoundedCornerVariant.None}
                    width={600}
                    height={600}
                    containerClasses='w-[100%] object-cover h-[100%]'
                    src={props.profile.photoURL}
                    extraClasses="hover:scale-105 transition"
                  />
                )
                : (
                  <Image
                    src={ProfilePreview}
                    className="h-full"
                    alt="key Splash"
                    layout="fill"
                    objectFit="contain"
                  />
                )
            }
          </div>
        </div>
        <div className="h-[113px] bg-white pt-8 pl-5 pr-4 pb-4">
          <ul className="list-none flex flex-row justify-between">
            <li className="m-0 p-0 list-none text-xl text-[#000000] font-[600] flex items-center">
              <span className='text-[#F9D54C] text-xl font-bold pr-2'>/ </span>
              {props.profile?.url}
              {props?.profile?.isGKMinted && <div className='h-5 w-5 minlg:h-6 minlg:w-6 ml-2'>
                <GK />
              </div>}
            </li>
          </ul>
          <ul className="mt-2 list-none flex flex-row justify-between">
            <li className="m-0 p-0 list-none text-5 leading-7 text-[#000000] font-[600]">{props.profile.visibleNFTs} <span className="text-[#6A6A6A] text-4 leading-6 font-[400]"> NFTs collected</span></li>
          </ul>
        </div>
      </a>
    );
  }
}
