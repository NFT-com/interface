import Loader from 'components/elements/Loader';
import { Maybe } from 'graphql/generated/types';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
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
  const { data: account } = useAccount();

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);

  const gkIDFilter: (id: number) => boolean = useCallback((id: number) => {
    if (isNullOrEmpty(props.currentFilter)) {
      return true;
    }
    return String(id) === props.currentFilter;
  }, [props.currentFilter]);

  return (
    <div className='w-full flex deprecated_sm:flex-col justify-between deprecated_sm:items-center'>
      <span className={tw('text-4xl flex items-center deprecated_sm:flex-col px-4')}>
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