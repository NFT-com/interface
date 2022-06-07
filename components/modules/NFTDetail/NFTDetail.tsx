import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Nft } from 'graphql/generated/types';
import { getEtherscanLink, isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface NFTDetailProps {
  nft: PartialDeep<Nft>
}

export const NFTDetail = (props: NFTDetailProps) => {
  const { nft } = props;
  console.log(nft?.metadata?.imageURL);
  const { activeChain } = useNetwork();
  return (
    <div className="flex flex-row md:flex-col">
      {nft?.metadata?.imageURL &&
        <div className="basis-1/3 aspect-square rounded-xl relative md:w-full w-96 rounded-xl z-50">
          <Image
            className="w-full h-full rounded-xl"
            layout="fill"
            objectFit="cover"
            src={processIPFSURL(nft?.metadata?.imageURL)}
            alt="nft-profile-pic"
          />
        </div>
      }
      <div className={tw(
        'flex flex-col text-left md:basis-auto basis-2/3',
        'px-12 md:px-0 mt-10 md:my-0 my-auto'
      )}>
        <div className="font-bold text-3xl md:text-2xl tracking-wide dark:text-white mt-8">
          {isNullOrEmpty(nft?.metadata?.name) ? 'Unknown Name' : nft?.metadata?.name}
        </div>
        <div className="mt-4 mt-4 text-base tracking-wide mb-8 md:mb-0">
          <div className="mt-2">
            <span className="font-bold dark:text-white">Owner: </span>
            <span className="text-link">{nft?.wallet?.address ?? 'Unknown'}</span>
          </div>
          <div className="text-sm mt-3">
            <span className="text-link cursor-pointer"
              onClick={() => {
                window.open(getEtherscanLink(
                  activeChain?.id,
                  nft?.contract,
                  'address'
                ), '_blank');
              }}>
                View on Etherscan
            </span>
          </div>
        </div>
        <div className="block md:hidden sm:w-auto w-2/4 text-sm sm:mt-3">
          <Button
            stretch={true}
            type={ButtonType.PRIMARY}
            label={'View on Etherscan'}
            accent={AccentType.OPACITY}
            onClick={() => {
              window.open(
                getEtherscanLink(
                  activeChain?.id,
                  nft?.contract,
                  'address'
                ),
                '_blank'
              );
            }} />
        </div>
      </div>
    </div>
  );
};
