import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { useNetwork } from 'wagmi';

export interface NFTDetailFeaturedByProps {
  contract: string,
  tokenId: string
}

export function NFTDetailFeaturedBy(props: NFTDetailFeaturedByProps) {
  const router = useRouter();
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
    <div className='flex items-center overflow-x-scroll py-2'>
      {profiles?.map((profile, index) => {
        return <div className={tw(
          'flex flex-col h-full w-72 shrink-0 p-2 border border-[#D5D5D5] rounded-md cursor-pointer mr-4',
        )}
        key={index}
        onClick={() => {
          router.push('/' + profile?.url);
        }}
        >
          <RoundedCornerMedia
            containerClasses='w-full aspect-square'
            variant={RoundedCornerVariant.All}
            amount={RoundedCornerAmount.Medium}
            src={processIPFSURL(profile?.photoURL)}
          />
          <div className="flex w-full font-grotesk font-semibold m-2">
            {profile?.url}
          </div>
        </div>;
      })}
    </div>
  </div>;
}