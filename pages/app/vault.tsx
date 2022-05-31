import { LoadedContainer } from 'components/elements/LoadedContainer';
import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import DiscordIcon from 'public/discord_black_icon.svg';
import keyImage from 'public/hero-key--static.png';
import keyBg from 'public/key-hero.jpg';
import tokenHeroBg from 'public/token-hero2.jpg';
import TwitterIcon from 'public/twitter_black_icon.svg';
import { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function RoadmapPage() {
  const contentRef = useRef<HTMLDivElement>();
  const [headerBlack, setHeaderBlack] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);

  const listenScrollEvent = () => {
    window.scrollY > 10
      ? setHeaderBlack(true)
      : setHeaderBlack(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
  });

  const { data: account } = useAccount();
  const router = useRouter();
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const { data: ownedGKTokens, loading: loadingOwnedGKs } = useOwnedGenesisKeyTokens(account?.address);
  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);

  const ref = useRef(null);
  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(
        (!loadingOwnedGKs) && ownedGKTokens != null
      );
    }
  }, [firstLoaded, loadingOwnedGKs, ownedGKTokens]);

  const getVaultContent = useCallback(() => {
    return (
      <div className="bg-pagebg-dk text-white rubik vault-lp">
        <div
          style={{
            backgroundImage: `
              radial-gradient(circle at -100% 0, rgba(4, 2, 4, 0.825) 42%, rgba(43, 11, 45, 0.825) 80%, rgba(0,0,0,0)))
            `,
            backgroundSize: `
              100% 200vh,
              auto 200vh
            `,
            backgroundPosition: `
              left top,
              center top
            `,
            backgroundRepeat: `
              no-repeat,
              no-repeat
            `,
          }}
        >
          
          {/* HERO */}
          <div className="token-hero-bg" style={{
            backgroundImage: `
              url("${tokenHeroBg}"),
              radial-gradient(circle at bottom right, rgba(22, 31, 68, 1) 10%, rgba(32, 39, 79, 0), rgba(20, 18, 33, 0) 80%)
            `
          }}>
            <div className="relative z-10 min-h-screen flex items-center justify-start px-8 deprecated_minmd:px-12 deprecated_minlg:px-12 mx-auto deprecated_minmd:w-11/12" >
              <div className="w-full text-center deprecated_minlg:w-1/2 deprecated_minlg:text-left">
                <h1 className="mb-8 text-4xl leading-tight font-medium deprecated_minxl:text-6xl">From all of us at<br />  NFT.com - Thank you. </h1>
                <p className="text-base leading-relaxed opacity-80 max-w-[38rem] mx-auto deprecated_minlg:mx-0 deprecated_minlg:text-lg deprecated_minlg:leading-relaxed">
                  Thank you for believing in what we are building, and becoming a founding community member of this new, creator-led, community-driven NFT hub.
                  <br /><br /><br />
                  In the coming weeks, we will be hosting a number of discussions in our exclusive Genesis Key and Profile holder Discord channels, where we will share more about the future of NFT.com, take community feedback, and status updates about our progress.
                </p>
              </div>
            </div>
          </div>

          {/* FIGURES */}
          <h2 className="mb-8 text-center text-4xl font-medium deprecated_minlg:text-5xl">Auction Metrics</h2>
          <div ref={ref} className="mb-24 flex flex-wrap justify-center mx-auto">
            <div className="vault-lp-fig-box m-3 flex flex-col justify-evenly items-center bg-black w-72 deprecated_min2xl:w-96 rounded-lg h-48 deprecated_min2xl:h-52">
              <div className="flex flex-col space-y-2 justify-around items-center font-thin">
                <div className="text-6xl font-thin">8273</div>
                <div className="text-base tracking-widest text-vault-pink">NUMBER OF BIDDERS</div>
              </div>
            </div>
            <div className="vault-lp-fig-box m-3 flex flex-col justify-around items-center bg-black w-72 deprecated_min2xl:w-96 rounded-lg h-48 deprecated_min2xl:h-52">
              <div className="flex flex-col space-y-2 justify-around items-center font-thin">
                <div className="text-6xl font-thin">94 ETH</div>
                <div className="text-base tracking-widest text-vault-pink">TOP BID</div>
              </div>
            </div>
            <div className="vault-lp-fig-box m-3 flex flex-col justify-around items-center bg-black w-72 deprecated_min2xl:w-96 rounded-lg h-48 deprecated_min2xlh-52">
              <div className="flex flex-col space-y-2 justify-around items-center font-thin">
                <div className="text-6xl font-thin">1.2 ETH</div>
                <div className="text-base tracking-widest text-vault-pink">MEDIAN BID</div>
              </div>
            </div>
          </div>

          {/* WELCOME */}
          <div className="key-hero-bg"
            style={{
              backgroundImage: `
                
                url("${keyBg}")
              `
            }}
          >
            <div className="relative z-10 min-h-screen flex items-center justify-end px-8 deprecated_minmd:px-12 deprecated_minlg:px-12 mx-auto deprecated_minmd:w-11/12 pb-16">
              <div className="w-full text-center deprecated_minlg:text-left deprecated_minlg:w-1/2">
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  To gain access to these private channels, you will need to verify that you are a Genesis Key NFT and/or Profile NFT holder via “collab.land”.
                </p>
                <br /><br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  We have exclusive channels where you can show off your shiny new key and profiles as well as share ideas with other newly-minted community leaders.
                </p>
                <br /><br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  Join the NFT.com Official Discord at: NFT.com/Discord<br />
                  Click the green checkmark on the #verify-rules message to gain access to the server.<br />
                  Once you have verified your role, click on the #collabland-verify channel and press the “Let{'\''}s go!” button.<br />
                </p>
                <br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  Collab-Land will then reply with a “Connect Wallet” button that will lead you to a custom link where you can connect your wallet.
                </p>
                <br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  The bot will only read what you have in your wallet and it will assign you the corresponding roles in our server based on your Genesis Key or Profile holdings.
                </p>
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  Once you have completed these steps and have been assigned your new roles, you should be able to access the private Genesis Key and Profile channels in the NFT.com Official Discord.
                </p>
                <br /><br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  Thank you for being a part of this community, and joining us on this journey. Please stop by and say hello today, and don’t forget to show off your new Genesis Key!
                </p>
                <br /><br />
                <p className="text-base leading-relaxed opacity-80 deprecated_minlg:text-xl deprecated_minlg:leading-relaxed">
                  See you in Discord. Can’t wait to build with all of you. <br />
                  NFT.com Team</p>
              </div>
            </div>
          </div>
         
          {/* SOCIAL */}
          <div className="relative text-center text-white py-8 pb-8"
            style={{
              backgroundColor: '#020204',
              backgroundImage: `url("${keyImage}")`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain'
            }}>
            <div className="py-36 px-8 deprecated_minmd:px-12 deprecated_minlg:px-12 mx-auto deprecated_minmd:w-11/12">
              <h3 className={tw('text-4xl font-medium deprecated_minlg:text-5xl text-always-white text-center',
                'mb-8')}>Welcome to the NFT.com Community</h3>
              <div className="flex justify-center items-center">
                <a className="social-icon p-4" href="https://twitter.com/nftcomofficial" target="_blank" rel="noreferrer">
                  <TwitterIcon className='w-8' />
                </a>
                <a className="ml-4 social-icon p-4" href="https://discord.gg/nftdotcom" target="_blank" rel="noreferrer">
                  <DiscordIcon className='w-8' />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }, []);
  
  return (
    <PageWrapper
      removePinkSides
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
        sidebar: 'hero',
        heroHeader: true,
        heroHeaderBlack: headerBlack,
      }}>
      <div
        ref={contentRef}
        className={tw(
          'relative',
          'overflow-x-hidden bg-black w-screen h-screen')}
        onScroll={(event: React.UIEvent<HTMLDivElement>) => {
          const containerHeight = event.currentTarget.clientHeight;
          const scrollTop = event.currentTarget.scrollTop;
          setHeaderBlack(scrollTop >= containerHeight);
        }}>
        <LoadedContainer loaded={firstLoaded}>
          {
            hasGksOrTokens ?
              getVaultContent() :
              (
                <div className="flex flex-col h-full w-full items-center justify-center">
                  <NullState
                    showImage={true}
                    primaryMessage='Looking for exclusive content?'
                    buttonLabel="Go to NFT.com"
                    onClick={() => {
                      router.replace('/');
                    }}/>
                </div>
              )
          }
        </LoadedContainer>
      </div>

    </PageWrapper>
  );
}
