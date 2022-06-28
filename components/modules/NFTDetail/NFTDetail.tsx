/* eslint-disable @next/next/no-img-element */
import { Nft } from 'graphql/generated/types';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { getEtherscanLink, isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import DefaultProfileImage from 'public/profile-image-default.svg';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';
export interface NFTDetailProps {
  nft: PartialDeep<Nft>;
  onRefreshSuccess?: () => void;
}

export const NFTDetail = (props: NFTDetailProps) => {
  const router = useRouter();

  const { activeChain } = useNetwork();
  const { profileTokens } = useNftProfileTokens(props.nft?.wallet?.address);
  const { profileData } = useProfileQuery(profileTokens?.at(0)?.uri?.split('/').pop());
  const { refreshNft, loading } = useRefreshNftMutation();

  const refreshNftCallback = useCallback(() => {
    (async () => {
      const result = await refreshNft(props.nft?.id);
      if (result) {
        props.onRefreshSuccess && props.onRefreshSuccess();
      }
    })();
  }, [props, refreshNft]);
  
  return (
    <div className="flex flex-row md:flex-col w-full pb-10" id="NFTDetailContainer" key={props.nft?.id}>
      {props.nft?.metadata?.imageURL &&
        <div className="w-96 md:w-full px-4 aspect-square">
          <div className="rounded-xl h-full object-contain relative">
            <img
              className="rounded-xl"
              src={processIPFSURL(props.nft?.metadata?.imageURL)}
              alt="nft-profile-pic"
            />
          </div>
        </div>
      }
      <div className={tw(
        'flex flex-col text-left md:basis-auto basis-2/3',
        'px-4 justify-end relative'
      )}>
        <div className="font-bold text-3xl md:text-2xl tracking-wide dark:text-white mt-8">
          {isNullOrEmpty(props.nft?.metadata?.name) ? 'Unknown Name' : props.nft?.metadata?.name}
        </div>
        <div className="mt-4 text-base tracking-wide">
          <div className="mt-2 flex items-center justify-between">
            <div className='flex items-center h-full'>
              <span className="font-bold dark:text-white">Owner: </span>
              {
                profileTokens?.length > 0 ?
                  <div
                    className="flex rounded-full ml-2 py-0.5 px-2 bg-white dark:bg-secondary-bg-dk items-center cursor-pointer"
                    onClick={() => {
                      router.push('/' + profileData?.profile?.url);
                    }}
                  >
                    <div className="relative rounded-full h-5 w-5 aspect-square">
                      {profileData?.profile?.photoURL ?
                        <img
                          className='rounded-full aspect-square h-full w-full'
                          src={profileData?.profile?.photoURL}
                          alt='owner-profile-pic'
                        />
                        :
                        <DefaultProfileImage className='rounded-full aspect-square h-full w-full' />
                      }
                    </div>
                    <span className="text-base text-link ml-1">
                    @{profileData?.profile?.url ?? 'unknown'}
                    </span>
                  </div> :
                  <span className="text-link">
                    {props.nft?.wallet?.address ?? 'Unknown'}
                  </span>
              }
            </div>
            <div
              id="refreshNftButton"
              onClick={refreshNftCallback}
              className={tw(
                'rounded-full bg-white dark:bg-secondary-bg-dk h-8 w-8 flex items-center justify-center cursor-pointer',
                'lg:relative absolute top-0 right-0 mr-4',
                loading ? 'animate-spin' : null
              )}
            >
              <ArrowClockwise className='text-link h-5 w-5'/>
            </div>
          </div>
          <div className="text-sm mt-3">
            <span className="text-link cursor-pointer hover:underline"
              onClick={() => {
                window.open(getEtherscanLink(
                  activeChain?.id,
                  props.nft?.contract,
                  'address'
                ), '_blank');
              }}>
                View on Etherscan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
