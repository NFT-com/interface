import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import { NullState } from 'components/elements/NullState';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

import DiscordIcon from 'public/icons/discord_black_icon.svg?svgr';
import TwitterIcon from 'public/icons/twitter_black_icon.svg?svgr';
import tokenHeroBg from 'public/token-hero2.jpg';

export default function RoadmapPage() {
  const contentRef = useRef<HTMLDivElement>();
  const [firstLoaded, setFirstLoaded] = useState(false);

  const { address: currentAddress } = useAccount();
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const { data: ownedGKTokens, loading: loadingOwnedGKs } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);

  const ref = useRef(null);
  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(!loadingOwnedGKs && ownedGKTokens != null);
    }
  }, [firstLoaded, loadingOwnedGKs, ownedGKTokens]);

  const getVaultContent = useCallback(() => {
    return (
      <div className='vault-lp bg-pagebg-dk font-noi-grotesk text-white'>
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
            `
          }}
        >
          {/* HERO */}
          <div
            className='token-hero-bg'
            style={{
              backgroundImage: `
              radial-gradient(circle at bottom right, rgba(22, 31, 68, 1) 10%, rgba(32, 39, 79, 0), rgba(20, 18, 33, 0) 80%)
            `
            }}
          >
            <Image src={tokenHeroBg} alt='Token Hero' layout='fill' objectFit='cover' />
            <div className='relative z-10 mx-auto flex min-h-screen items-center justify-start px-8 minmd:w-11/12 minmd:px-12'>
              <div className='w-full text-center minlg:w-1/2 minlg:text-left'>
                <h1 className='mb-8 text-4xl font-medium leading-tight minxl:text-6xl'>
                  From all of us at
                  <br /> NFT.com - Thank you.{' '}
                </h1>
                <p className='mx-auto max-w-[38rem] text-base leading-relaxed opacity-80 minlg:mx-0 minlg:text-lg minlg:leading-relaxed'>
                  Thank you for believing in what we are building, and becoming a founding community member of this new,
                  creator-led, community-driven NFT hub.
                  <br />
                  <br />
                  <br />
                  In the coming weeks, we will be hosting a number of discussions in our exclusive Genesis Key and
                  Profile holder Discord channels, where we will share more about the future of NFT.com, take community
                  feedback, and status updates about our progress.
                </p>
              </div>
            </div>
          </div>

          {/* FIGURES */}
          <h2 className='mb-8 text-center text-4xl font-medium minlg:text-5xl'>Auction Metrics</h2>
          <div ref={ref} className='mx-auto mb-24 flex flex-wrap justify-center'>
            <div className='vault-lp-fig-box m-3 flex h-48 w-72 flex-col items-center justify-evenly rounded-lg bg-black minxl:h-52 minxl:w-96'>
              <div className='flex flex-col items-center justify-around space-y-2 font-thin'>
                <div className='text-6xl font-thin'>8273</div>
                <div className='text-base tracking-widest text-vault-pink'>NUMBER OF BIDDERS</div>
              </div>
            </div>
            <div className='vault-lp-fig-box m-3 flex h-48 w-72 flex-col items-center justify-around rounded-lg bg-black minxl:h-52 minxl:w-96'>
              <div className='flex flex-col items-center justify-around space-y-2 font-thin'>
                <div className='text-6xl font-thin'>94 ETH</div>
                <div className='text-base tracking-widest text-vault-pink'>TOP BID</div>
              </div>
            </div>
            <div className='vault-lp-fig-box m-3 flex h-48 w-72 flex-col items-center justify-around rounded-lg bg-black minxl:h-52 minxl:w-96'>
              <div className='flex flex-col items-center justify-around space-y-2 font-thin'>
                <div className='text-6xl font-thin'>1.2 ETH</div>
                <div className='text-base tracking-widest text-vault-pink'>MEDIAN BID</div>
              </div>
            </div>
          </div>

          {/* WELCOME */}
          <div
            className='key-hero-bg'
            style={{
              backgroundImage: `
              url("/key-hero.jpg")
            `
            }}
          >
            <div className='relative z-10 mx-auto flex min-h-screen items-center justify-end px-8 pb-16 minmd:w-11/12 minmd:px-12'>
              <div className='w-full text-center minlg:w-1/2 minlg:text-left'>
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  To gain access to these private channels, you will need to verify that you are a Genesis Key NFT
                  and/or Profile NFT holder via “collab.land”.
                </p>
                <br />
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  We have exclusive channels where you can show off your shiny new key and profiles as well as share
                  ideas with other newly-minted community leaders.
                </p>
                <br />
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  Join the NFT.com Official Discord at: NFT.com/Discord
                  <br />
                  Click the green checkmark on the #verify-rules message to gain access to the server.
                  <br />
                  Once you have verified your role, click on the #collabland-verify channel and press the “Let{"'"}s
                  go!” button.
                  <br />
                </p>
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  Collab-Land will then reply with a “Connect Wallet” button that will lead you to a custom link where
                  you can connect your wallet.
                </p>
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  The bot will only read what you have in your wallet and it will assign you the corresponding roles in
                  our server based on your Genesis Key or Profile holdings.
                </p>
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  Once you have completed these steps and have been assigned your new roles, you should be able to
                  access the private Genesis Key and Profile channels in the NFT.com Official Discord.
                </p>
                <br />
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  Thank you for being a part of this community, and joining us on this journey. Please stop by and say
                  hello today, and don’t forget to show off your new Genesis Key!
                </p>
                <br />
                <br />
                <p className='text-base leading-relaxed opacity-80 minlg:text-xl minlg:leading-relaxed'>
                  See you in Discord. Can’t wait to build with all of you. <br />
                  NFT.com Team
                </p>
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div
            className='relative py-8 text-center text-white'
            style={{
              backgroundColor: '#020204',
              backgroundImage: 'url("/hero-key--static.webp")',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className='mx-auto px-8 py-36 minmd:w-11/12 minmd:px-12'>
              <h3 className={tw('text-center text-4xl font-medium text-always-white minlg:text-5xl', 'mb-8')}>
                Welcome to the NFT.com Community
              </h3>
              <div className='flex items-center justify-center'>
                <a
                  className='social-icon p-4'
                  href='https://twitter.com/nftcomofficial'
                  target='_blank'
                  rel='noreferrer'
                >
                  <TwitterIcon />
                </a>
                <a
                  className='social-icon ml-4 p-4'
                  href='https://discord.gg/nftdotcom'
                  target='_blank'
                  rel='noreferrer'
                >
                  <DiscordIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div ref={contentRef} className={tw('relative', 'h-screen w-screen overflow-x-hidden bg-black')}>
      <LoadedContainer loaded={firstLoaded}>
        {hasGksOrTokens ? (
          getVaultContent()
        ) : (
          <div className='flex h-full w-full flex-col items-center justify-center'>
            <NullState
              showImage={true}
              primaryMessage='Looking for exclusive content?'
              buttonLabel='Go to NFT.com'
              href='/'
            />
          </div>
        )}
      </LoadedContainer>
    </div>
  );
}

RoadmapPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
