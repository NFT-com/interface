import { ReactComponent as CTAKeyIcon } from 'assets/images/key_icon.svg';
import { ReactComponent as UserIcon } from 'assets/images/logo-user-sign-in.svg';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question_mark.svg';
import { ReactComponent as HourglassIcon } from 'assets/images/simple_hourglass.svg';
import Loader from 'components/elements/Loader';
import { Maybe } from 'graphql/generated/types';
import { useMyGenesisKeyBid } from 'graphql/hooks/useMyGenesisKeyBid';
import { useGenesisKeyBlindMerkleCheck } from 'hooks/merkle/useGenesisKeyBlindMerkleCheck';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useTotalGKClaimed } from 'hooks/useTotalGKClaimed';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { useWhitelistCheck } from 'hooks/useWhitelistCheck';

import { ClipboardListIcon } from '@heroicons/react/solid';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
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

export function useActiveSidebarCTA(
  onScrollToSchedule: () => void
): Maybe<SidebarCTA> {
  const { data: account } = useAccount();
  const router = useRouter();
  const location = router.pathname;

  const { isWhitelisted } = useWhitelistCheck(account?.address);
  // The IDs of the GK tokens the user currently has in their wallet
  const { data: myGKTokens } = useOwnedGenesisKeyTokens(account?.address);
  const merkleData = useGenesisKeyBlindMerkleCheck(account?.address);
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(account?.address);
  // The number of ClaimedGenesisKey events emitted by the contract for this address.
  const { totalClaimed: myClaimedGKCount } = useTotalGKClaimed(account?.address);

  const { bid: myGenesisKeyBid } = useMyGenesisKeyBid();
  const { totalRemaining } = useTotalGKPublicRemaining();
  
  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(account?.address);

  const auctionStarted = process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME === 'blind' ?
    Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START) <= new Date().getTime() :
    Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START) <= new Date().getTime();

  const { setHeroSidebarOpen } = useHeroSidebar();

  const whitelistedScrollDown: SidebarCTA = useMemo(() => {
    return {
      icon: <ClipboardListIcon className='h-8'/>,
      iconColor: 'bg-primary-green',
      mainText: 'Address Recognized',
      secondaryText: 'You\'re on the Whitelist!\n Good luck!',
      buttonText: 'Learn about the Auctions',
      disabled: false,
      onClick: () => {
        // todo: open FAQ site in new tab ... faq.nft.com
        onScrollToSchedule && onScrollToSchedule();
      }
    };
  }, [onScrollToSchedule]);

  const nonwhitelistedScrollDown: SidebarCTA = useMemo(() => {
    const whitelistClosed = 1650970800000 <= new Date().getTime();
    return {
      icon: <ClipboardListIcon className='h-8'/>,
      iconColor: 'bg-primary-pink',
      mainText: 'You\'re not Whitelisted',
      secondaryText: whitelistClosed ?
        'Sorry, we don\'t recognize your address. ' +
        ' You can still buy a Genesis Key in our Public Sale 48' +
        ' hours after the auction has ended.' :
        'You\'re not on the Whitelist. You can still join until April 26th, at 7AM EDT.',
      buttonText: whitelistClosed ? 'Learn about the Auctions' : 'Join the Whitelist',
      disabled: false,
      onClick: () => {
        if (whitelistClosed) {
          onScrollToSchedule && onScrollToSchedule();
          setHeroSidebarOpen(false);
        } else {
          window.open(
            'https://whitelist.nft.com',
            '_blank'
          );
        }
      }
    };
  }, [onScrollToSchedule, setHeroSidebarOpen]);

  const calculatingResults: SidebarCTA = useMemo(() => {
    return {
      icon: <HourglassIcon className='h-8'/>,
      iconColor: 'bg-primary-button-bckg',
      mainText: (process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true') ?
        'Check Results' :
        'Calculating Results',
      secondaryText: (process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true') ?
        'Results are in! Check and see if you won.' :
        'The auction has ended and we are calculating the results. In the mean time,'+
        ' hang out in our Discord and we\'ll'+
        ' let you know when the results are in!',
      buttonText: 'See Results',
      disabled: !(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true'),
      onClick: () => {
        setHeroSidebarOpen(false);
        router.push('/app/auctions');
      }
    };
  }, [router, setHeroSidebarOpen]);

  const whitelistedBlindAuction: SidebarCTA = useMemo(() => {
    return {
      icon: <ClipboardListIcon className='h-8'/>,
      iconColor: 'bg-primary-green',
      mainText: myGenesisKeyBid ? 'Bid Placed' : 'Address Recognized',
      secondaryText: myGenesisKeyBid ?
        'You\'ve bid ' + ethers.utils.formatEther(myGenesisKeyBid?.price ?? 0) + ' ETH.' +
          ' Increase your bid or check back here to see the results. Good Luck!' :
        'You\'re on the Whitelist. \n Good luck!',
      buttonText: 'Go to Auction',
      disabled: !auctionStarted,
      onClick: () => {
        setHeroSidebarOpen(false);
        router.push('/app/auctions');
      }
    };
  }, [auctionStarted, myGenesisKeyBid, router, setHeroSidebarOpen]);

  const nonwhitelistedBlindAuction: SidebarCTA = useMemo(() => {
    const whitelistClosed = 1650970800000 <= new Date().getTime();

    return {
      icon: <ClipboardListIcon className='h-8'/>,
      iconColor: 'bg-primary-pink',
      mainText: 'Address not Recognized',
      secondaryText: !whitelistClosed ?
        'You\'re not on the Whitelist. You can still join until April 26th, at 7AM EDT.' :
        'You\'re not on the Whitelist. '+
          'You can still buy a profile in our Public Sale.',
      buttonText: !whitelistClosed ? 'Join the Whitelist' : 'Learn About the Public Sale',
      disabled: false,
      onClick: () => {
        if (!whitelistClosed) {
          setHeroSidebarOpen(false);
          window.open(
            'https://whitelist.nft.com',
            '_blank'
          );
          return;
        }
        if(location === '/app/auctions') {
          setHeroSidebarOpen(false);
          router.push('/schedule');
        } else {
          setHeroSidebarOpen(false);
          onScrollToSchedule && onScrollToSchedule();
        }
      }
    };
  }, [location, onScrollToSchedule, router, setHeroSidebarOpen]);

  const postBlindGKToClaim: SidebarCTA = useMemo(() => {
    const isInsider = insiderMerkleData != null;
    return {
      icon: isInsider ? <ClipboardListIcon className='h-8'/> : <QuestionMarkIcon className='h-8'/>,
      iconColor: isInsider ? 'bg-primary-green' : 'bg-primary-button-bckg',
      mainText: isInsider ?
        'Partner Recognized' :
        'The Results Are In!',
      secondaryText: isInsider ?
        'Thank you for supporting the NFT.com vision and being a foundational part' +
        ' of our community. You can now claim your Genesis Key.' :
        'Check to see if you have won a Genesis Key!',
      buttonText: isInsider ? 'Claim Genesis Key' : 'See Results',
      disabled: false,
      onClick: () => {
        setHeroSidebarOpen(false);
        // the claim-genesis-key page should be mostly reserved for insiders,
        // since it runs extra checks on the owned GK IDs.
        router.push(isInsider ? '/app/claim-genesis-key' : '/app/auctions');
      }
    };
  }, [insiderMerkleData, router, setHeroSidebarOpen]);

  const postBlindNoBid: SidebarCTA = useMemo(() => {
    return {
      icon: <CTAKeyIcon className='aspect-square h-8' />,
      disabled: false,
      mainText: 'Didn\'t join the Auction?',
      secondaryText: 'It\'s not too late to get a Genesis Key.'+
        ' You can still buy one during the Public Sale',
      buttonText: 'Learn About the Public Sale',
      iconColor: 'bg-primary-pink',
      onClick: () => {
        onScrollToSchedule && onScrollToSchedule();
      }
    };
  }, [onScrollToSchedule]);

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

  const genesisKeyRecognized = myGKTokens?.length > 0;
  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;
  const hasUnclaimedGKs = (merkleData != null || insiderMerkleData != null) &&
    myClaimedGKCount === 0;

  const publicSaleCTA: SidebarCTA = useMemo(() => {
    return {
      icon: <CTAKeyIcon className='h-8'/>,
      iconColor: totalRemaining?.gt(100) ? 'bg-primary-button-bckg' : 'bg-primary-pink',
      mainText: totalRemaining ? totalRemaining + ' Keys Left!' : <Loader />,
      secondaryText: 'There\'s still time to buy a key!',
      buttonText: 'Buy Keys',
      disabled: !auctionStarted,
      onClick: () => {
        setHeroSidebarOpen(false);
        router.push('/app/auctions');
      }
    };
  }, [auctionStarted, router, setHeroSidebarOpen, totalRemaining]);

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
        icon: <UserIcon className='h-8'/>,
        iconColor: 'bg-primary-green',
      }
    };
  }, [publicSaleCTA, router, setHeroSidebarOpen, totalClaimableForThisAddress]);
  
  if(!(process.env.NEXT_PUBLIC_GK_FLOWS_ENABLED === 'true')) {
    /**
     * This is after the auction and public sale have both long ended, and the auction
     * surface has been disabled. REACT_APP_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED will remain true
     * after it's initially set to true, so we use it as a proxy to say that there are no more
     * auction/sale related CTAs to show.
     */
    if (process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true') {
      return null;
    }
    /**
     * This is after we've enabled wallet connections and finished the whitelist phase,
     * but before we're opening up access to the GK auctions route. 
     * This is just to see if you're on the whitelist or not.
     */
    return isWhitelisted ? whitelistedScrollDown : nonwhitelistedScrollDown;
  } else if (
    process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME === 'blind' &&
    !(process.env.NEXT_PUBLIC_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true')
  ) {
    // "Calculating Results" stage. CTA is disabled if the results aren't ready yet.
    if (Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END) <= new Date().getTime()) {
      if (myGenesisKeyBid == null) {
        return postBlindNoBid;
      }
      return calculatingResults;
    }

    /**
     * GK flows have been enabled and the Auctions route is live. Whitelisted
     * users should be linked to the gk auction route. No users have any GKs
     * to claim at this point because the blind auction is still live, or
     * we are still calculating results.
     */
    return isWhitelisted ? whitelistedBlindAuction : nonwhitelistedBlindAuction;
  } else if (
    process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME === 'blind' &&
    (process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true')
  ) {
    /**
     * the Blind GK auction is over. Some users need to claim their GKs,
     * and some have already claimed and need to claim profiles. If neither
     * is true for this user, we link to information about the public sale.
     */
    if (hasUnclaimedGKs) {
      return postBlindGKToClaim;
    } else if (genesisKeyRecognized) {
      return hasUnclaimedProfiles ? gkRecognizedProfilesToMint : null;
    } else {
      return postBlindNoBid;
    }
  } else if (process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME === 'public') {
    /**
     * The public sale phase has begun. If the sale hasn't started yet,
     * just check if they have profiles to mint.
     */
    if (!auctionStarted && hasUnclaimedProfiles) {
      return gkRecognizedProfilesToMint;
    }

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
  return null;
}