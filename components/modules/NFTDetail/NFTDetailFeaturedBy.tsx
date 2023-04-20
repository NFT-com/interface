import Link from 'next/link';

import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useProfileVisibleNFTCount } from 'graphql/hooks/useProfileVisibleNFTCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useProfileTokenOwner } from 'hooks/userProfileTokenOwner';
import { isNullOrEmpty } from 'utils/format';

import GK from 'public/icons/Badge_Key.svg?svgr';
import NoActivityIcon from 'public/icons/no_activity.svg?svgr';

export interface NFTDetailFeaturedByProps {
  contract: string;
  tokenId: string;
}

export function NFTDetailFeaturedBy(props: NFTDetailFeaturedByProps) {
  const defaultChainId = useDefaultChainId();
  const { data: profiles } = useProfilesByDisplayedNft(props.contract, props.tokenId, defaultChainId, true);

  if (profiles == null) {
    return null;
  }

  return (
    <div className='flex w-full flex-col px-[16px]'>
      <span className='mb-2 font-noi-grotesk text-[28px] font-semibold md:text-[24px]'>
        Profiles that feature this NFT
      </span>
      {profiles?.map((profile, index) => {
        return (
          <div key={index} className='flex h-[70px] items-center justify-between border-b border-gray-200 py-1'>
            <div className='flex w-max items-center'>
              <RoundedCornerMedia
                priority={true}
                containerClasses='w-[44px] h-[44px] w-full aspect-square'
                variant={RoundedCornerVariant.Full}
                amount={RoundedCornerAmount.Medium}
                src={profile?.photoURL}
              />
              <div className='my-4 ml-12 flex w-full items-center font-noi-grotesk text-[20px] font-medium md:ml-3'>
                <span className='font-dm-mono text-primary-yellow'>/</span>
                <span className='ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-[#4D4D4D]'>
                  {profile?.url}
                </span>
                <ShowGk profile={profile?.url} />
              </div>
            </div>

            <div className='flex items-center'>
              <PublicProfileNftsCount id={profile?.id} />
              <Link href={`/${profile?.url}`} passHref>
                <div className='md:text-[14px[ flex cursor-pointer items-center justify-center rounded-[8px] bg-[#F9D54C] px-10 py-2 text-[18px] font-medium text-black md:px-7 md:py-1.5'>
                  View
                </div>
              </Link>
            </div>
          </div>
        );
      })}
      {profiles.length === 0 && (
        <div>
          <div className='flex items-center justify-center'>
            <NoActivityIcon className='mt-10 h-[300px]' />
          </div>
          <span className='mb-2 mt-5 flex items-center justify-center font-noi-grotesk text-[28px] font-medium leading-10 text-[#4D4D4D] md:text-[20px]'>
            Not Featured on a NFT.com Profile yet
          </span>
        </div>
      )}
    </div>
  );
}

const ShowGk = ({ profile }: { profile: string }) => {
  const { profileTokenId } = useProfileTokenQuery(profile, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  });
  const { profileOwner } = useProfileTokenOwner(profileTokenId, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  });
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(profileOwner);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);

  return hasGks && <GK className='ml-3 h-[24px] w-[24px]' />;
};

const PublicProfileNftsCount = ({ id }: { id: string }) => {
  const defaultChainId = useDefaultChainId();
  const { totalItems } = useProfileVisibleNFTCount([id], defaultChainId);

  return (
    <div className='mr-36 flex w-full font-noi-grotesk text-[18px] lg:hidden'>
      <span className='mr-1 font-bold'>{totalItems}</span>
      <span className='text-[#6A6A6A]'>NFTs Displayed</span>
    </div>
  );
};
