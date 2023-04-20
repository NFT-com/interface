/* eslint-disable @next/next/no-img-element */
import { isMobile } from 'react-device-detect';

import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { tw } from 'utils/tw';

import { LinksToSection } from './LinksToSection';

export interface UnmintedOrUnavailableProps {
  profileURI: string;
  notAvailable?: boolean;
}

export function UnmintedOrUnavailableProfile(props: UnmintedOrUnavailableProps) {
  const { profileURI, notAvailable } = props;
  const { blocked: currentURIBlocked } = useProfileBlocked(profileURI, true);

  return (
    <div className='flex h-max w-full flex-col bg-pagebg pb-10 minlg:mt-20'>
      <BannerWrapper alt='unminted or unavailable banner image' />
      <div
        className={tw(
          'mx-16 mb-0 flex justify-start minlg:mb-8',
          'min-w-[60%] max-w-7xl',
          isMobile ? 'mx-2' : 'mx-2 minmd:mx-8 minxl:mx-auto'
        )}
        style={{
          zIndex: 103
        }}
      >
        <div className='flex items-center md:flex-col'>
          <div className='mt-[-30px] flex items-end minlg:mt-[-86px] minxl:mt-[-125px]'>
            <section>
              <div className={tw('relative outline-none', 'h-32 w-32 minlg:h-52 minlg:w-52')}>
                <img
                  src={'https://cdn.nft.com/profile-image-default.svg'}
                  alt='profilePicture'
                  draggable={false}
                  className={tw('rounded-full object-center', 'h-full w-full', 'aspect-square shrink-0')}
                  style={{ zIndex: 101 }}
                />
              </div>
            </section>
          </div>
          <div className='mx-4 my-0 flex w-full flex-col items-center minlg:my-6 minlg:flex-row'>
            <div className='flex w-full flex-col'>
              <div className='mb-4 text-center text-2xl font-bold text-primary-txt dark:text-primary-txt-dk minlg:mb-0 minlg:text-left minxl:text-4xl'>
                {profileURI}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full max-w-nftcom flex-col items-center space-y-4 self-center'>
        <div className='mt-8 flex w-full flex-col justify-center text-sm text-primary-txt dark:text-primary-txt-dk minmd:mt-0 minxl:text-xl'>
          <div className='mx-auto w-full text-center font-bold'>
            {notAvailable || currentURIBlocked
              ? 'This profile is not available.'
              : 'This profile is available and is ready to be minted!'}
          </div>
        </div>
        <div className='flex w-full flex-col items-center justify-center text-primary-txt dark:text-primary-txt-dk'>
          <div className='mx-0 mb-8 text-center text-sm minmd:mb-10 minxl:mx-auto  minxl:text-xl'>
            <p>
              {`Learn how to claim ${
                notAvailable || currentURIBlocked ? 'a' : 'this'
              } profile for your own by visiting either NFT.com or our Support knowledge base.`}
            </p>
          </div>
          <div className='my-0 flex w-full justify-center minlg:mt-10 minxl:mb-24 minxl:mt-20'>
            <LinksToSection isAddressOwner={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
