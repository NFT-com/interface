/* eslint-disable @next/next/no-img-element */
import { Nft, Profile } from 'graphql/generated/types';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { getEtherscanLink, isNullOrEmpty, processIPFSURL, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';
export interface NFTDetailProps {
  nft: PartialDeep<Nft>;
  onRefreshSuccess?: () => void;
}

export const NFTDetail = (props: NFTDetailProps) => {
  const router = useRouter();

  const { chain } = useNetwork();
  const { profileTokens } = useNftProfileTokens(props.nft?.wallet?.address);
  
  const { profileData } = useProfileQuery(
    props.nft?.wallet?.preferredProfile == null ?
      profileTokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const profileOwnerToShow: PartialDeep<Profile> = props.nft?.wallet?.preferredProfile ?? profileData?.profile;

  const { refreshNft, loading } = useRefreshNftMutation();
  const { refreshNftOrders } = useRefreshNftOrdersMutation();

  const refreshNftCallback = useCallback(() => {
    (async () => {
      const result = await refreshNft(props.nft?.id);
      await refreshNftOrders(props.nft?.id);
      if (result) {
        props.onRefreshSuccess && props.onRefreshSuccess();
      }
    })();
  }, [props, refreshNft, refreshNftOrders]);
  
  return (
    <div className="flex flex-col minmd:flex-row w-full" id="NFTDetailContainer" key={props.nft?.id}>
      {props.nft?.metadata?.imageURL &&
        <div className="w-full minlg:w-96 p-4 aspect-square">
          <div className="flex rounded-xl h-full object-contain">
            <video
              autoPlay
              muted
              loop
              poster={processIPFSURL(props.nft?.metadata?.imageURL)}
              className="rounded-xl"
              src={processIPFSURL(props.nft?.metadata?.imageURL)}
              key={props.nft?.id}
            />
          </div>
        </div>
      }
      <div className={tw(
        'flex flex-col text-left basis-2/3 minlg:basis-auto',
        'p-4 minlg:ml-8 justify-end relative'
      )}>
        <div className="font-bold text-2xl minlg:text-3xl  tracking-wide dark:text-white mt-8">
          {isNullOrEmpty(props.nft?.metadata?.name) ? 'Unknown Name' : props.nft?.metadata?.name}
        </div>
        <div className="mt-4 text-base tracking-wide">
          <div className="mt-2 flex items-center justify-between">
            <div className='flex items-center h-full'>
              <span className="font-bold dark:text-white">Owner: </span>
              {
                profileTokens?.length > 0 ?
                  <div
                    className={tw(
                      'flex rounded-full ml-2 py-0.5 px-2 bg-white dark:bg-secondary-bg-dk items-center',
                      profileOwnerToShow?.url != null && 'cursor-pointer'
                    )}
                    onClick={() => {
                      if (profileOwnerToShow?.url == null) {
                        return;
                      }
                      router.push('/' + profileOwnerToShow?.url);
                    }}
                  >
                    {profileOwnerToShow?.photoURL && <div className="relative rounded-full h-5 w-5 aspect-square">
                      <img
                        className='rounded-full aspect-square h-full w-full'
                        src={profileOwnerToShow?.photoURL}
                        alt='owner-profile-pic'
                      />
                    </div>}
                    <span className="text-base text-link ml-1">
                      {profileOwnerToShow?.url == null ?
                        shortenAddress(props.nft?.wallet?.address) :
                        '@' + profileOwnerToShow?.url
                      }
                    </span>
                  </div> :
                  <span className="text-link">
                    {shortenAddress(props.nft?.wallet?.address) ?? 'Unknown'}
                  </span>
              }
            </div>
            <div
              id="refreshNftButton"
              onClick={refreshNftCallback}
              className={tw(
                'rounded-full bg-white dark:bg-secondary-bg-dk h-8 w-8 flex items-center justify-center cursor-pointer',
                'relative minmd:absolute top-4 right-0 mr-4',
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
                  chain?.id,
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
