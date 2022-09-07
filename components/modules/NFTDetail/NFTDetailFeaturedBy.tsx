import { ProfileCard } from 'components/modules/Profile/ProfileCard';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString } from 'utils/helpers';

import { useNetwork } from 'wagmi';

export interface NFTDetailFeaturedByProps {
  contract: string,
  tokenId: string
}

export function NFTDetailFeaturedBy(props: NFTDetailFeaturedByProps) {
  const { chain } = useNetwork();
  const { data: profiles } = useProfilesByDisplayedNft(
    props.contract,
    props.tokenId,
    getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)
  );

  if (profiles == null) {
    return null;
  }

  return <div className='flex flex-col w-full'>
    <span className="text-2xl font-bold font-grotesk mb-2">
        Profiles that feature this NFT
    </span>
    <div className='flex items-center snap-x overflow-x-auto sm:no-scrollbar py-2'>
      {profiles?.map((profile, index) => {
        return <ProfileCard key={index} profile={profile} />;
      })}
    </div>
  </div>;
}