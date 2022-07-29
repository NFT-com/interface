import { Button, ButtonType } from 'components/elements/Button';
import { OptionGrid } from 'components/elements/OptionGrid';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import HeroSidebarAccountDetails from 'components/modules/HeroSidebar/HeroSidebarAccountDetails';
import HeroSidebarFunds from 'components/modules/HeroSidebar/HeroSidebarFunds';
import { HeroSidebarProfiles } from 'components/modules/HeroSidebar/HeroSidebarProfiles';
import { SidebarCTA, useActiveSidebarCTA } from 'components/modules/HeroSidebar/useActiveSidebarCTA';
import LoginResults from 'components/modules/Sidebar/LoginResults';
import SignIn from 'components/modules/Sidebar/SignIn';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useSidebar } from 'hooks/state/useSidebar';
import useENSName from 'hooks/useENSName';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export const Sidebar = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const profileValue = localStorage.getItem('selectedProfileUrl');
  const { address: currentAddress } = useAccount();
  const { ENSName } = useENSName(currentAddress);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { primaryIcon, alwaysBlack } = useThemeColors();
  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();

  useEffect(() => {
    sidebarOpen && promoteZIndex('sidebar');
    return () => {
      restoreZIndex();
    };
  }, [promoteZIndex, sidebarOpen, restoreZIndex]);
  
  const activeCTA: SidebarCTA = useActiveSidebarCTA();

  const getSidebarContent = useCallback(() => {
    if(currentAddress && myOwnedProfileTokens.findIndex(e => e.title === profileValue) !== -1 || !getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED) || currentAddress && !myOwnedProfileTokens.length) {
      return (
        <motion.div
          layout
          key='sidebarContent'
          className='flex flex-col pt-5 dark bg-pagebg-dk dark'
        >
          {isMobile &&
          <motion.div
            key='sidebarMobileXIcon'
            className='flex justify-end pt-6 px-4'
          >
            <XIcon
              color={primaryIcon}
              className="block h-8 w-8 mb-8"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen(false);
              }}
            />
          </motion.div>
          }
          <motion.div
            layout
            key='sidebarAccountDetails'
            className='w-full border-b border-accent-border-dk'
          >
            <HeroSidebarAccountDetails ENSName={ENSName} />
          </motion.div>
          {activeCTA &&
        <motion.div
          key='activeCTA'
          layout
        >
          <div className='mx-5 text-primary-txt-dk text-2xl mb-4 mt-2.5'>
          Notifications
          </div>
          <div
            className={tw(
              'px-7 pt-7 items-center mx-5 shrink-0',
              'px-4 rounded-xl mb-3.5 border',
              'bg-accent-dk',
              'border-accent-border-dk',
            )}
          >
            {activeCTA && <div
              key={activeCTA.iconColor}
              className={tw(
                'flex items-center m-auto rounded-full',
                activeCTA.iconColor,
                'text-white w-16',
                'aspect-square items-center justify-center'
              )}>
              {activeCTA.icon}
            </div>}
            <div className="flex items-center m-auto justify-center">
              <div className={tw(
                'flex flex-col py-3 text-center text-primary-txt dark:text-primary-txt-dk'
              )}>
                {activeCTA ? activeCTA.mainText : ''}
                <div className={tw(
                  'flex items-center text-secondary-txt',
                  'text-base py-3 whitespace-normal break-normal'
                )}>
                  {activeCTA ? activeCTA.secondaryText : ''}
                </div>
              </div>
            </div>
          </div>
        </motion.div>}
          {activeCTA &&
          <motion.div key='activeCTAButton' className='px-5 mb-4'>
            <Button
              stretch
              color={alwaysBlack}
              label={activeCTA.buttonText}
              disabled={activeCTA.disabled}
              onClick={activeCTA.onClick}
              type={ButtonType.PRIMARY}
            />
          </motion.div>
          }
          {
            activeCTA?.secondaryCTA && <div className={tw(
              'border rounded-xl flex items-center py-4 mx-5',
              'bg-accent-dk border-action-primary cursor-pointer',
              'motion-safe:animate-pulse-border mb-5 hover:animate-none'
            )}
            onClick={activeCTA?.secondaryCTA.onClick}
            >
              <div className={tw(
                'flex rounded-full w-8 h-8 aspect-square items-center justify-center',
                'mx-4',
                activeCTA?.secondaryCTA.iconColor,
              )}>
                {activeCTA?.secondaryCTA?.icon}
              </div>
              <div className="flex flex-col text-always-white text-lg">
                {activeCTA?.secondaryCTA?.title}
                <span className='text-base text-secondary-txt'>
                  {activeCTA?.secondaryCTA?.subtitle}
                </span>
              </div>
            </div>
          }
          <motion.div layout key='sidebarProfiles'>
            <HeroSidebarProfiles />
          </motion.div>
          <motion.div className='pb-6' layout key='sidebarFunds'>
            <HeroSidebarFunds />
          </motion.div>
        </motion.div>
      );}

    if(myOwnedProfileTokens.findIndex(e => e.title === profileValue) < 0){
      return (
        <LoginResults
          profileValue={profileValue}
        />
      );
    }
  }, [primaryIcon, ENSName, activeCTA, alwaysBlack, setSidebarOpen, profileValue, currentAddress, myOwnedProfileTokens]);

  const getSidebarPanel = useCallback(() => {
    if(!showWalletOptions && !isNullOrEmpty(currentAddress)) {
      return (
        <motion.div
          key='sidebarMainContentPanel'
          initial={{ x: '-100%' }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.4
          }}
          className="h-full"
        >
          {getSidebarContent()}
        </motion.div>
      );
    }
    if(showWalletOptions || isNullOrEmpty(currentAddress)) {
      return (
        <motion.div
          layout
          key='sidebarWalletOptionsPanel'
          initial={{
            // mobile browsers can't handle this animation
            x: isMobile ? 0 : '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.4
          }}
          className='h-full'
        >
          {isMobile &&
            <motion.div
              layout
              key='sidebarWalletOptionsMobileXIcon'
              className='flex justify-end py-6 px-4'
            >
              <XIcon
                color={primaryIcon}
                className="block h-8 w-8"
                aria-hidden="true"
                onClick={() => {
                  setSidebarOpen(false);
                }}
              />
            </motion.div>
          }
          {!isNullOrEmpty(currentAddress) &&
            <motion.div
              layout
              key='sidebarWalletOptionsBack'
              className="cursor-pointer text-primary-txt-dk mb-4 hover:underline"
              onClick={() => {
                setShowWalletOptions(false);
              }}>
                Back
            </motion.div>
          }

          {!getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED) ?
            (
              <>
                <div className='text-primary-txt-dk text-2xl mb-4 pl-1'>
                  My Wallet
                </div>
                <div className='text-secondary-txt mb-8 pl-1'>
                  Connect with one of our available wallet providers.
                </div>
                <motion.div layout key='sidebarOptionGrid'>
                  <OptionGrid>
                    <motion.div layout key='sidebarWalletOptions'>
                      <WalletRainbowKitButton signInButton />
                    </motion.div>
                  </OptionGrid>
                </motion.div>
              </>
            )
            :
            (
              <SignIn
                // profileValue={profileValue}
              // setProfileValue={setProfileValue}
              />
            )
          }
        </motion.div>
      );
    }
  }, [currentAddress, getSidebarContent, primaryIcon, setSidebarOpen, showWalletOptions]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <Dialog
          layout
          key='sidebarDialog'
          static
          as={motion.div}
          open={sidebarOpen}
          className="fixed inset-0 overflow-hidden"
          onClose={() => {
            !addFundsDialogOpen && setSidebarOpen(false);
          }}
          style={{ zIndex: getZIndex('sidebar') }}
        >
          <Dialog.Overlay
            layout
            key='sidebarDialogOverlay'
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: 'backInOut',
              duration: 0.4
            }}
            className={tw(
              'absolute inset-0',
              'backdrop-filter backdrop-blur-sm backdrop-saturate-150 bg-pagebg-dk bg-opacity-40'
            )}
          />
          <motion.div
            key='sidebarWrapperPanel'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.4
            }}
            className={
              tw(
                'flex flex-col fixed inset-y-0 right-0',
                'w-screen max-w-md h-full',
                'shadow-xl overflow-y-scroll overflow-x-hidden',
                'bg-pagebg-dk',
                'border-l border-accent-border-dk')
            }
          >
            {getSidebarPanel()}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};