/* eslint-disable @next/next/no-img-element */
import { Footer } from 'components/elements/Footer';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useProfileBlocked } from 'hooks/useProfileBlocked';

import { LinksToSection } from './LinksToSection';

export interface UnmintedOrUnavailableProps {
  profileURI: string;
  notAvailable?: boolean;
}

export function UnmintedOrUnavailableProfile(props: UnmintedOrUnavailableProps) {
  const { profileURI, notAvailable } = props;
  const { blocked: currentURIBlocked } = useProfileBlocked(profileURI, true);

  return (
    <div className="mt-20 h-screen bg-pagebg">
      <BannerWrapper />
      <div
        className='mb-0 minlg:mb-8 mx-16 flex justify-start max-w-nftcom'
        style={{
          zIndex: 103,
        }}
      >
        <div className="flex items-center md:flex-col">
          <div className="flex items-end mt-[-30px] minlg:mt-[-86px] minxl:mt-[-125px]">
            <section>
              <div className='relative outline-none'>
                <img
                  src={'https://cdn.nft.com/profile-image-default.svg'}
                  alt="profilePicture"
                  draggable={false}
                  className="object-center rounded-full h-[72px] minlg:h-[160px] minxl:h-60 w-[72px] minlg:w-[160px] minxl:w-60"
                  style={{ zIndex: 101, }}
                />
              </div>
            </section>
          </div>
          <div className="flex flex-col minlg:flex-row items-center my-0 minlg:my-6 mx-4 w-full">
            <div className="flex flex-col w-full">
              <div className="font-bold text-2xl minxl:text-4xl text-primary-txt dark:text-primary-txt-dk text-center minlg:text-left mb-4 minlg:mb-0">
                {profileURI}
              </div>
            </div>
          </div>

        </div>
      </div>
      <main className='justify-start space-y-4 w-full mx-16 max-w-nftcom flex flex-col'>
        <div className='text-sm minxl:text-xl text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col'>
          <div className="text-center font-bold mx-auto w-full">
            {(notAvailable || currentURIBlocked) ? 'This profile is not available.' : 'This profile is available and is ready to be minted!' }
          </div>
        </div>
        <div className='text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col'>
          <div className="text-sm minxl:text-xl mb-8 minmd:mb-10 mx-0 minxl:mx-auto  text-center">
            <p>
              {`Learn how to claim ${(notAvailable || currentURIBlocked) ? 'a' : 'this'} profile for your own by visiting either NFT.com or our Support knowledge base.`}
            </p>
          </div>
          <div className="mt-0 minlg:mt-10 minxl:mt-20 w-full flex justify-center mb-0 minxl:mb-24">
            <LinksToSection isAddressOwner={false} />
          </div>
        </div>
        <div className='w-full items-center bottom-0'>
          <Footer />
        </div>
      </main>
    </div>
  );
}
