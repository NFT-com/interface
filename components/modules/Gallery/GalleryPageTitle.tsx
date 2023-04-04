import Loader from 'components/elements/Loader/Loader';
import { Maybe } from 'graphql/generated/types';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { AlchemyOwnedNFT } from 'types/alchemy';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface GalleryPageTitleProps {
  itemType: string | 'profile' | 'gk';
  showMyStuff: boolean;
  currentFilter: Maybe<string>;
  totalGKSupply: Maybe<BigNumber>;
}

export function GalleryPageTitle(props: GalleryPageTitleProps) {
  const { address: currentAddress } = useAccount();

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);

  const gkIDFilter: (token: AlchemyOwnedNFT) => boolean = useCallback((token: AlchemyOwnedNFT) => {
    if (isNullOrEmpty(props.currentFilter)) {
      return true;
    }
    return BigNumber.from(token?.id?.tokenId).toString() === props.currentFilter;
  }, [props.currentFilter]);

  return (
    <div className={tw(
      'w-full flex flex-col minmd:flex-row justify-between items-center minmd:items-start',
      'text-black dark:text-white',
    )}>
      <span className={tw('text-4xl flex items-center minmd:flex-row flex-col px-4')}>
        {props.itemType === 'profile' ? 'Profiles' : 'Genesis Keys'}
        {
          props.itemType === 'gk' &&
          <>
            {' '}/{' '}
            {
              props.totalGKSupply == null ?
                <Loader /> :
                <span className='text-secondary-txt ml-2 font-bold'>
                  {(props.showMyStuff ?
                    (ownedGKTokens?.filter(gkIDFilter)?.length ?? 0) :
                    props.totalGKSupply
                  )?.toString()}
                </span>}
          </>
        }
      </span>
    </div>
  );
}
