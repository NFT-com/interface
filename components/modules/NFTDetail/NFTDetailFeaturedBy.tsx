import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import Link from 'next/link';
import GK from 'public/hasGk.svg';
import NoActivityIcon from 'public/no_activity.svg';
import { useAccount } from 'wagmi';
export interface NFTDetailFeaturedByProps {
  contract: string,
  tokenId: string
}

export function NFTDetailFeaturedBy(props: NFTDetailFeaturedByProps) {
  const defaultChainId = useDefaultChainId();
  const { data: profiles } = useProfilesByDisplayedNft(
    props.contract,
    props.tokenId,
    defaultChainId,
    true
  );

  const { address: currentAddress } = useAccount();
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);

  if (profiles == null) {
    return null;
  }

  return profiles.length > 0 ?
    <div className='flex flex-col w-full px-[16px]'>
      <span className="text-[28px] font-semibold font-noi-grotesk mb-2">
        Profiles that feature this NFT
      </span>
      {profiles?.map((profile, index) => {
        return (
          <div key={index} className='py-1 flex items-center justify-between h-[70px] border-b border-gray-200'>
            <div className='flex items-center w-max'>
              <RoundedCornerMedia
                priority={true}
                containerClasses='w-[44px] h-[44px] w-full aspect-square'
                variant={RoundedCornerVariant.Full}
                amount={RoundedCornerAmount.Medium}
                src={processIPFSURL(profile?.photoURL)}
              />
              <div className="flex w-full items-center text-[20px] font-medium ml-12 font-noi-grotesk my-4">
                <span className='font-dm-mono text-primary-yellow'>/</span>
                <span className='ml-1 whitespace-nowrap text-[#4D4D4D] text-ellipsis overflow-hidden'>{profile?.url}</span>
                {hasGks && <GK className='w-[24px] h-[24px] ml-3' />}
              </div>
            </div>

            <div className='flex items-center'>
              <PublicProfileNftsCount id={profile?.id} />
              <Link href={'/' + profile?.url} passHref>
                <a>
                  <div className='cursor-pointer rounded-[8px] px-10 py-2 bg-[#F9D54C] flex items-center text-black font-medium text-[18px] justify-center'>
                    View
                  </div>
                </a>
              </Link>
            </div>
          </div>
        );
      })}
    </div> :
    (
      <div className='flex flex-col w-screen'>
        <span className="text-2xl font-bold font-grotesk mb-2 w-full px-[16px]">
          Not Featured on a NFT Profile yet
        </span>
        <div className='flex items-center justify-center'>
          <NoActivityIcon className='mt-5' />
        </div>
      </div>
    );
}

const PublicProfileNftsCount = ({ id }: { id: string }) => {
  const defaultChainId = useDefaultChainId();
  const {
    totalItems: publicProfileNftsCount,
  } = useProfileNFTsQuery(
    id,
    defaultChainId,
    1000
  );

  return (
    <div className='flex w-full text-[18px] font-noi-grotesk mr-36'>
      <span className='font-bold mr-1'>{publicProfileNftsCount}</span>
      <span className='text-[#6A6A6A]'>NFTs Displayed</span>
    </div>
  );
};