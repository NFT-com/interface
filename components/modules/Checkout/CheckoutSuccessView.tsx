/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Check } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { tw } from 'utils/tw';

import NullProfile from 'public/icons/null_profile.svg?svgr';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PartialErrorView } from './PartialErrorView';

const BlurImage = dynamic(import('components/elements/BlurImage'));

export enum SuccessType {
  Purchase = 'Purchase',
  Listing = 'Listing'
}
export interface CheckoutSuccessViewProps {
  userAddress: string;
  type: SuccessType;
  subtitle?: string;
  hasError?: boolean;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CheckoutSuccessView(props: CheckoutSuccessViewProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const router = useRouter();
  const { clear, closeCartSidebar, toList } = useContext(NFTListingsContext);

  const { toBuy, toBuyNow, buyNowActive } = useContext(NFTPurchasesContext);

  const list = props.type === SuccessType.Listing ? toList : buyNowActive ? toBuyNow : toBuy;

  const images = () => {
    if (list.length === 1) {
      return (
        <div className='relative'>
          <RoundedCornerMedia
            containerClasses='w-[130px] h-[130px] mb-10 z-10'
            src={list[0]?.nft?.metadata?.imageURL}
            variant={RoundedCornerVariant.Success}
          />
          <Check
            className={
              'absolute right-[-12px] top-[-12px] z-20 -ml-4 aspect-square h-7 w-7 shrink-0 rounded-full bg-[#26AA73] p-1 font-medium text-white'
            }
          />
        </div>
      );
    }
    if (list.length > 1) {
      return (
        <div className='relative'>
          <div className='mb-5 ml-16 flex flex-row items-center justify-center'>
            {list?.slice(3).map((item, i) => (
              <RoundedCornerMedia
                key={i}
                containerClasses={`w-[${130 - i * 10}px] h-[${130 - i * 10}px] z-${50 - i * 10} -ml-16 shadow-xl`}
                src={item?.nft?.metadata?.imageURL}
                variant={RoundedCornerVariant.Success}
              />
            ))}
            {list.length > 3 && (
              <div className='z-10 -ml-16 flex h-[90px] w-[90px] items-center justify-end rounded-[18px] bg-[#F9D54C] pr-2'>
                +{list.length - 3}
              </div>
            )}
          </div>
          <Check
            className={`absolute ${
              list.length >= 3 ? 'top-0' : 'top-[-10px]'
            } right-[-13px] z-[100] -ml-4 aspect-square h-7 w-7 shrink-0 rounded-full bg-[#26AA73] p-1 font-medium text-white`}
          />
        </div>
      );
    }
  };

  const message = () => {
    const nfts = props.hasError
      ? (list as StagedListing[]).filter(item => item.targets.some(target => !target.listingError))
      : list;
    return nfts.length > 1
      ? `You have successfully ${props.type === SuccessType.Listing ? 'listed' : 'purchased'} ${list.length} NFTs`
      : `You have successfully ${props.type === SuccessType.Listing ? 'listed your' : 'purchased a'} NFT`;
  };

  return myOwnedProfileTokens?.length > 0 ? (
    <div
      className={tw(
        'flex h-screen items-center overflow-auto font-noi-grotesk md:flex-col',
        props?.hasError ? 'h-full min-h-[650px] minlg:max-h-[744px]' : 'h-[596px] md:h-screen'
      )}
    >
      <div
        onClick={() => router.push('/app/mint-profiles')}
        className='absolute bottom-5 left-7 z-50 flex items-center text-[16px] font-medium underline hover:cursor-pointer md:hidden'
      >
        <NullProfile className='mr-2' />
        Create a NFT Profile
      </div>
      <div className='relative left-0 h-full w-2/5 bg-gradient-to-br from-[#FAC213] to-[#FF9B37] md:h-2/5 md:w-full'>
        <div className='flex w-full items-center justify-center'>
          <BlurImage
            alt='desktop success profile background'
            src='/images/desktop_success_profile.webp'
            className='h-full w-full shrink-0 object-cover md:h-auto md:w-2/5'
            fill
          />
        </div>
        <div className='relative hidden items-center justify-center md:flex'>
          <div
            onClick={() => router.push('/app/mint-profiles')}
            className='absolute bottom-2 z-50 flex items-center text-[16px] font-medium underline hover:cursor-pointer'
          >
            <NullProfile className='mr-2' />
            Create a NFT Profile
          </div>
        </div>
      </div>
      <div className='relative right-0 h-full w-3/5 md:h-max md:w-full'>
        <div
          className={tw(
            'flex h-full w-full flex-col items-center justify-center px-10 md:mt-5',
            props?.hasError && 'pb-3 pt-14'
          )}
        >
          {!props.hasError && images()}
          <div className='text-[34px] font-medium'>Congratulations!</div>
          <div className='mt-4 text-[18px] font-medium'>{message()}</div>
          <div className='mt-10 text-[16px]'>Let&apos;s continue your web3 journey</div>
          <Button
            size={ButtonSize.LARGE}
            type={ButtonType.PRIMARY}
            label='Share'
            onClick={() => {
              closeCartSidebar();
              props.onClose();
              router.push(`/app/nft/${list[0]?.nft?.contract}/${list[0]?.nft?.tokenId}`);
              window.open(
                `https://twitter.com/intent/tweet?` +
                  `text=${encodeURIComponent(
                    `Check out my latest NFT ${props.type === SuccessType.Listing ? 'listing' : 'purchase'}: ` +
                      `https://${window.location.host}/app/nft/${list[0]?.nft?.contract}/${list[0]?.nft?.tokenId}`
                  )}`,
                '_blank'
              );
            }}
          />
          <div
            onClick={() => {
              closeCartSidebar();
              props.onClose();
              props.type === SuccessType.Listing ? router.push('/app/assets') : router.push('/app/discover/nfts');
            }}
            className='cursor-pointer text-[14px] font-medium text-[#E4BA18] underline'
          >
            {props.type === SuccessType.Listing ? 'List' : 'Purchase'} another NFT
          </div>
          {props.hasError && (
            <div className='mt-3 flex min-h-[200px] w-full flex-col space-y-[10px] overflow-auto rounded border border-[#ECECEC] p-[10px]'>
              {list.map(item => (
                <PartialErrorView key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className='flex h-[646px] flex-col items-center font-noi-grotesk md:h-screen'>
      <div className='relative top-0 z-10 h-2/5 w-full bg-gradient-to-br from-[#FAC213] to-[#FF9B37]'>
        <div className='flex w-full items-center justify-center'>
          <BlurImage
            alt='desktop no profile background'
            src='/images/desktop_no_profile.webp'
            className='h-full w-full shrink-0 object-cover'
          />
        </div>
      </div>
      <div className='relative bottom-0 z-20 h-3/5 w-full bg-white'>
        <div className='flex h-full w-full flex-col items-center justify-center px-10 md:justify-start md:pt-10'>
          <div className='mt-10 w-[380px] text-center text-[30px] font-medium md:mt-0 md:w-full md:text-[26px]'>
            Get access to lower fees by creating an NFT Profile
          </div>
          <div className='mt-4 text-[18px] font-medium'>{message()}</div>
          <div className='mb-8 mt-6 flex w-[277px] flex-col text-[16px]'>
            <div className='item-center flex justify-between py-3'>
              <div className='text-[#6A6A6A]'>With an NFT Profile</div>
              <div className='bg-gradient-to-br from-[#FAC213] to-[#FF9B37] bg-clip-text font-medium text-transparent'>
                0% fee
              </div>
            </div>
            <div className='item-center flex justify-between border-t border-[#ECECEC] py-3'>
              <div className='text-[#111010]'>Without an NFT Profile</div>
              <div className='font-medium line-through'>2.5% fee</div>
            </div>
          </div>
          <Button
            type={ButtonType.PRIMARY}
            size={ButtonSize.LARGE}
            label='Create a Profile'
            onClick={() => {
              props.onClose();
              clear();
              closeCartSidebar();
              router.push('/app/mint-profiles');
            }}
          />
        </div>
      </div>
    </div>
  );
}
