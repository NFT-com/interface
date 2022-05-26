import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import { use100vh } from 'react-div-100vh';

export default function HeroRoadmapSection() {
  const { width } = useWindowDimensions();
  const height = use100vh();

  const viewportHeight = () => {
    if (width > 1279) {
      return height;
    } else {
      return 'auto';
    }
  };

  return (
    <div id="RoadmapSection"
      className={tw(`min-h-${viewportHeight()}`,
        'bg-center bg-cover',
        'flex flex-col mt-24 mb-8 pt-16 px-8 deprecated_minmd:px-12 deprecated_minlg:px-12',
        'text-always-white overflow-y-scroll',
        'deprecated_minxl:flex-row deprecated_minxl:justify-between deprecated_minxl:items-center',
        'mx-auto deprecated_minmd:w-11/12'
      )}>
      <div className={tw(
        'absolute top-0 left-0 w-full h-16 mb-8 deprecated_minlg:absolute deprecated_minlg:top-0',
        'bg-gradient-to-b from-[rgba(0,0,0,1)] to-[rgb(0,0,0,0)]'
      )}>
        {/* adds overlay transition between bg sections  */}
      </div>
      <div className={tw('deprecated_minxl:mr-24 mb-12 text-4xl deprecated_minmd:text-5xl deprecated_min2xl:text-6xl',
        'font-black text-hero-pink font-hero-heading1 pl-4',
      )}>
        ROADMAP
      </div>

      <div className="pl-4
      deprecated_minxs:w-[80%] deprecated_minmd:w-1/2 deprecated_minlg:w-2/3 deprecated_min2xl:w-1/2 deprecated_minxl:flex
      deprecated_minxl:justify-between deprecated_minxl:gap-10">
        <div className="mt-5 deprecated_minxl:mt-0 w-full deprecated_min2xl:w-1/2">
          <div className={tw('text-4xl font-medium mt-4 font-bold',
            'text-always-white font-hero-heading2 tracking-wider')}>
          Q1 2022
          </div>
          <ul>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Initial NFT.com website launched
            </li>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Pre-Launch community growth (100,000+ emails, 20,000+ discord members)
            </li>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Team Members Revealed
            </li>
          </ul>
        </div>

        <div className="mt-16 deprecated_minxl:mt-0 w-full deprecated_min2xl:w-1/2">
          <div className={tw('text-4xl font-medium mt-4 font-bold',
            'text-always-white font-hero-heading2 tracking-wider')}>
          Q2 2022
          </div>
          <ul>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Blind Auction of 3,000 Genesis Keys
            </li>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Public Sale of 6,750 Genesis Keys
            </li>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Genesis Key Holders eligible to mint four (4) NFT.com Profile NFTs (for example NFT.com/hello)
            </li>
            <li className="mt-5 text-lg font-medium text-grey-txt">
            Launch of NFT.com (Profile Gallery, Analytics Features, and Marketplace)
            </li>
          </ul>
          <p
            className={tw('mt-4 mb-4 justify-left',
              'text-lg font-medium text-grey-txt')}>
            We are building NFT.com to become the beacon for the NFT community and
            the epicenter of the creator-driven NFT ecosystem. Over time and
            with community feedback and participation, we intend to become the
            ultimate NFT hub for Web3.
          </p>
        </div>
      </div>
    </div>
  );
}
