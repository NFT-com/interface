import Loader from 'components/elements/Loader';
import { Maybe } from 'graphql/generated/types';
import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';

import { useRouter } from 'next/router';
import CTAKeyIcon from 'public/key_icon.svg';
import UserIcon from 'public/logo-user-sign-in.svg';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';

export interface SidebarCTA {
  icon: React.ReactElement,
  iconColor: string,
  mainText: string | React.ReactElement,
  secondaryText: string,
  buttonText: string,
  onClick: () => void,
  disabled: boolean,
  secondaryCTA?: {
    title: string,
    subtitle: string,
    onClick: () => void,
    icon: React.ReactElement,
    iconColor: string
  }
}

export function useActiveSidebarCTA(): Maybe<SidebarCTA> {
  const { data: account } = useAccount();
  const router = useRouter();
  
  const { totalRemaining } = useTotalGKPublicRemaining();
  
  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(account?.address);

  const { setHeroSidebarOpen } = useHeroSidebar();

  const gkRecognizedProfilesToMint: SidebarCTA = useMemo(() => {
    return {
      icon: <CTAKeyIcon className='h-8'/>,
      iconColor: 'bg-primary-green',
      mainText: `${totalClaimableForThisAddress} Profile${totalClaimableForThisAddress > 1 ? 's' : ''} Ready to Mint`,
      secondaryText: 'Congratulations! You have profiles ready to mint.',
      buttonText: 'Mint Profiles',
      disabled: false,
      onClick: () => {
        setHeroSidebarOpen(false);
        router.push('/app/claim-profiles');
      }
    };
  }, [router, setHeroSidebarOpen, totalClaimableForThisAddress]);

  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;

  const publicSaleCTA: SidebarCTA = useMemo(() => {
    return {
      icon: <div className='h-8 w-8 rounded-full flex items-center justify-center'><CTAKeyIcon /></div>,
      iconColor: totalRemaining?.gt(100) ? 'bg-primary-button-bckg' : 'bg-primary-pink',
      mainText: totalRemaining ? totalRemaining + ' Keys Left!' : <Loader />,
      secondaryText: 'There\'s still time to buy a key!',
      buttonText: 'Buy Keys',
      disabled: false,
      onClick: () => {
        setHeroSidebarOpen(false);
        router.push('/app/auctions');
      }
    };
  }, [router, setHeroSidebarOpen, totalRemaining]);

  const publicSaleCTAWithMintableProfiles: SidebarCTA = useMemo(() => {
    return {
      ...publicSaleCTA,
      secondaryCTA: {
        title: `${totalClaimableForThisAddress} Profile${totalClaimableForThisAddress > 1 ? 's' : ''} Ready to Mint`,
        subtitle: 'Click here to mint profiles.',
        onClick: () => {
          setHeroSidebarOpen(false);
          router.push('/app/claim-profiles');
        },
        icon: <div className='h-8 w-8 rounded-full flex items-center justify-center'><UserIcon/></div>,
        iconColor: 'bg-primary-green',
      }
    };
  }, [publicSaleCTA, router, setHeroSidebarOpen, totalClaimableForThisAddress]);

  /**
   * If there are no remaining GKs in the public sale, don't show a CTA.
   * Link to profile minting if still relevant.
   */
  if (totalRemaining?.lte(0)) {
    return hasUnclaimedProfiles ? gkRecognizedProfilesToMint : null;
  }

  /**
   * If the sale has started, always show the remaining GKs available to buy.
   * Optionally, also show the remaining mintable profile count.
   */
  return hasUnclaimedProfiles ? publicSaleCTAWithMintableProfiles : publicSaleCTA;
}