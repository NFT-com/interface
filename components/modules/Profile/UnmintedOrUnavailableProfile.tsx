import { Footer } from 'components/elements/Footer';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useProfileBlocked } from 'hooks/useProfileBlocked';

import { LinksToSection } from './LinksToSection';

import Image from 'next/image';

export interface UnmintedOrUnavailableProps {
  profileURI: string;
  notAvailable?: boolean;
}

export function UnmintedOrUnavailableProfile(props: UnmintedOrUnavailableProps) {
  const { profileURI, notAvailable } = props;
  const { blocked: currentURIBlocked } = useProfileBlocked(profileURI, true);

  return (
    <div className="mt-20 h-screen bg-pagebg dark:bg-pagebg-dk">
      <BannerWrapper />
      <div
        className='md:mb-0 mb-8 flex justify-center'
        style={{
          zIndex: 103,
        }}
      >
        <div className="flex items-center md:flex-col">
          <div className="flex items-end md:mt-[-30px] lg:mt-[-86px] mt-[-125px]">
            <section>
              <div className='relative outline-none rounded-full md:h-[72px] lg:h-[160px] h-60 md:w-[72px] lg:w-[160px] w-60'>
                <Image
                  src={'https://cdn.nft.com/profile-image-default.svg'}
                  alt="profilePicture"
                  draggable={false}
                  className="object-center"
                  layout="fill"
                  objectFit="cover"
                  style={{ zIndex: 49, }}
                />
              </div>
            </section>
          </div>
          <div className="flex items-center md:my-0 my-6 mx-4 w-full md:flex-col">
            <div className="flex flex-col w-full">
              <div className="font-bold lg:text-2xl text-4xl text-primary-txt dark:text-primary-txt-dk md:text-center md:mb-4">
                @{profileURI}
              </div>
            </div>
          </div>

        </div>
      </div>
      <main className='w-full justify-start space-y-4 flex flex-col bg-pagebg dark:bg-pagebg-dk'>
        <div className='lg:text-sm text-xl text-primary-txt dark:text-primary-txt-dk w-full flex justify-center cursor-pointer flex-col'>
          <div className="text-center font-bold mx-auto w-full">
            {(notAvailable || currentURIBlocked) ? 'This profile is not available.' : 'This profile is available and is ready to be minted!' }
          </div>
        </div>
        <div className='text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col'>
          <div className="lg:text-sm text-xl sm:mb-8 md:mx-0 lg:mx-auto mx-auto mb-10 text-center">
            <p>
              {`Learn how to claim ${(notAvailable || currentURIBlocked) ? 'a' : 'this'} profile for your own by visiting either NFT.com or our Support knowledge base.`}
            </p>
          </div>
          <div className="md:mt-0 lg:mt-10 mt-20 w-full flex justify-center lg:mb-0 mb-24">
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
