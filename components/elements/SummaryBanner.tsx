import { HeaderDropdown } from 'components/elements/HeaderDropdown';
import { HeaderNavItem } from 'components/elements/HeaderNavItem';
import { TAB_ICON_EXTRA_CLASSES } from 'constants/misc';
import { useUser } from 'hooks/state/useUser';
import { tw } from 'utils/tw';

import CircleDollar from 'public/circle_dollar.svg';
import logoMoon from 'public/moon.svg';
import logoSun from 'public/sun.svg';

export interface SummaryBannerProps {
  walletPopup?: boolean;
  removeBackground?: boolean;
  hideAnalytics?: boolean;
}

export const SummaryBanner = (props: SummaryBannerProps) => {
  const { isDarkMode, updateDarkMode } = useUser();

  return (
    <nav
      className={`${
        props.removeBackground
          ? 'transparent'
          : 'bg-headerbg dark:bg-headerbg-dk'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className={tw('flex items-center max-w-full',
        'justify-between h-sumBanner deprecated_sm:flex-wrap',
        'deprecated_sm:h-full deprecated_sm:px-0 deprecated_sm:pl-1')}>
        <div
          className={tw(
            'flex-1 flex items-center',
            'items-stretch justify-start',
          )}
        >
          {props.hideAnalytics !== true && <div className="block ml-6">
            <div className="flex space-x-4">
              <div className="px-3">
                <span className="text-header-txt font-normal deprecated_2xl:text-sm deprecated_md:text-xs">
                    NFT&apos;s:{' '}
                </span>
                <span
                  className={tw('text-header-pink font-medium',
                    'dark:font-normal deprecated_2xl:text-sm deprecated_md:text-xs')}>
                    1,000,000
                </span>
              </div>
              <div className="px-3">
                <span className="text-header-txt font-normal deprecated_2xl:text-sm deprecated_md:text-xs">
                    Collections:{' '}
                </span>
                <span
                  className={tw('text-header-pink font-medium',
                    'dark:font-normal deprecated_2xl:text-sm deprecated_md:text-xs')}>
                    90,000
                </span>
              </div>
              <div className="px-3">
                <span
                  className="text-header-txt font-normal deprecated_2xl:text-sm deprecated_md:text-xs">24h Vol: </span>
                <span
                  className={tw('text-header-pink font-medium',
                    'dark:font-normal deprecated_2xl:text-sm deprecated_md:text-xs')}>
                    $100,000,000
                </span>
              </div>
            </div>
          </div>}
        </div>
        <div className={tw('flex items-center deprecated_sm:justify-evenly',
          'deprecated_md:ml-2 deprecated_sm:ml-5 deprecated_sm:my-3 deprecated_sm:w-full')}>
          {
            props.hideAnalytics !== true &&
              <>
                <div className="mx-2 deprecated_2xl:text-sm">
                  <HeaderDropdown
                    dropDownOptions={[
                      {
                        label: 'English',
                      },
                    ]}
                  />
                </div>
                <div className="mx-2 deprecated_2xl:text-sm">
                  <HeaderDropdown
                    dropDownOptions={[
                      {
                        label: 'USD',
                        image: CircleDollar,
                      },
                    ]}
                  />
                </div>
              </>
          }
          { !(process.env.NEXT_PUBLIC_FORCE_DARK_MODE === 'true') && <div className="ml-2 mr-7">
            <HeaderNavItem
              alt="Dark/Light Toggle"
              active={false}
              logoActive={isDarkMode ? logoSun : logoMoon}
              logoInactive={isDarkMode ? logoSun : logoMoon}
              styleClasses={TAB_ICON_EXTRA_CLASSES.slice()}
              overrideBorder={true}
              onClick={() => updateDarkMode(!isDarkMode)}
            />
          </div>}
        </div>
      </div>
    </nav>
  );
};
