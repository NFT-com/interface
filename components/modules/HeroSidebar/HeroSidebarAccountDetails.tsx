import { ConnectedAddress } from 'components/elements/ConnectedAddress';
import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import useCopyClipboard from 'hooks/useCopyClipboard';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import CopyIcon from 'public/hero_copy.svg';
import { isMobile } from 'react-device-detect';
import { CheckCircle } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
interface HeroSidebarAccountDetailsProps {
  ENSName?: string;
  openOptions?: () => void;
}

export default function HeroSidebarAccountDetails(
  { ENSName, openOptions }: HeroSidebarAccountDetailsProps
) {
  const { data: account } = useAccount();
  const { activeChain, chains } = useNetwork();
  const { disconnect } = useDisconnect();
  const { secondaryIcon } = useThemeColors();
  const [isCopied, setCopied] = useCopyClipboard();
  const router = useRouter();
  const { setHeroSidebarOpen, toggleHeroSidebar } = useHeroSidebar();
  const { setSignOutDialogOpen } = useSignOutDialog();

  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);

  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);
  const showHeaderNav = process.env.NEXT_PUBLIC_PREFERENCE_COLLECTION_FLOW_ENABLED === 'true';
  const isChainAvailable = chains.some((item) => item.id === activeChain?.id);
  return (
    <>
      <div className="px-5 pb-5 flex flex-col">
        {!isChainAvailable && (
          <div className="text-center text-red-1 font-bold mb-6">Please switch to Mainnet</div>
        )}
        <div className='flex w-full justify-between items-center'>
          <ConnectedAddress ensName={ENSName} color='link'/>
          <div className='flex h-full items-center sm:px-5 sm:py-0 py-3'>
            {isCopied ?
              <CheckCircle
                className='flex-shrink-0 h-5 aspect-square'
                color={secondaryIcon}
              /> :
              <CopyIcon
                className='h-5 aspect-square cursor-pointer hover:opacity-90 flex-shrink-0'
                onClick={() => {
                  setCopied(account?.address);
                }}
              />
            }
          </div>
        </div>
      </div>
      <div
        className={tw(
          'w-full border-t border-accent-border-dk px-5',
          'font-rubik font-bold'
        )}
      >
        {showHeaderNav &&
        <>
          <div
            className={tw(
              isMobile ? '' : 'sm:block hidden',
              'pt-2.5 text-link cursor-pointer hover:underline'
            )}
            onClick={() => {
              setHeroSidebarOpen(false);
              router.push('/app/gallery');
            }}
          >
            Gallery
          </div>
          <div
            className={tw(
              isMobile ? '' : 'sm:block hidden',
              'pt-2.5 text-link cursor-pointer hover:underline'
            )}
            onClick={() => {
              setHeroSidebarOpen(false);
              window.open('https://docs.nft.com', '_open');
            }}
          >
            Docs
          </div>
          {hasGksOrTokens && <div
            className={tw(
              isMobile ? '' : 'sm:block hidden',
              'pt-2.5 text-link cursor-pointer hover:underline'
            )}
            onClick={() => {
              setHeroSidebarOpen(false);
              router.push('/app/vault');
            }}
          >
            Vault
          </div>}
        </>
        }
        <div
          className='py-2.5 text-primary-pink cursor-pointer hover:underline'
          onClick={() => {
            disconnect();
            setSignOutDialogOpen(true);
            toggleHeroSidebar();
          }}
        >
          Sign Out
        </div>
      </div>
    </>
  );
}
