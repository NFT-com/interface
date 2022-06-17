import { useMyPhotoQuery } from 'graphql/hooks/useMyPhotoQuery';
import { joinClasses } from 'utils/helpers';

import Jazzicon from '@metamask/jazzicon';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Identicon1 from 'react-identicons';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export interface LoggedInIdenticonProps {
  large?: boolean;
  round?: boolean;
  border?: boolean;
}

export default function LoggedInIdenticon({ large, round, border }: LoggedInIdenticonProps) {
  const ref = useRef<HTMLDivElement>();

  const { data: account } = useAccount();
  const { myPhoto, loading } = useMyPhotoQuery();
  const { primaryIcon } = useThemeColors();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(Jazzicon(16, parseInt(account?.address.slice(2, 10), 16)));
    }
  }, [account]);

  if (myPhoto && !loading) {
    return (
      <Image
        className={joinClasses(
          account == null ? 'hidden' : '',
          round === true ? 'rounded-full' : '',
          large === true ? 'h-32 w-32' : 'h-10 w-10',
          border === true ? 'border-4' : ''
        )}
        style={{ borderColor: primaryIcon }}
        src={myPhoto}
        alt={account?.address}
      />
    );
  }

  // 'polkadot', 'substrate', 'beachball' or 'jdenticon'
  return <Identicon1 size={large === true ? 120 : 32} string={ethers.utils.getAddress(account?.address)} />;
}
