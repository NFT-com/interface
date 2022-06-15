import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { tw } from 'utils/tw';

import type { NextPage } from 'next';
import { isMobile } from 'react-device-detect';

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <main
        className={tw(
          'absolute w-full h-full',
          isMobile ? 'overflow-x-hidden' : ''
        )}
        style={{
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <div className="flex flex-row items-center justify-center w-screen h-96 bg-always-black ">
          <WalletRainbowKitButton signInButton showWhenConnected={false} />
        </div>
        <div className='space-y-6 py-6 ...'>
          <div className='h-full ...'>
        Learn, discover, and own digital items.
          </div>
          <div className='h-full ...'>
        profile feed
          </div>
          <div className='h-full ...'>
        ticker
          </div>
          <div className='h-full ...'>
        leaderboard
          </div>
          <div className='h-full ...'>
        how NFT.com works
          </div>
          <div className='h-full ...'>
        get your profile
          </div>
          <div className='h-full ...'>
        customize your profile
          </div>
          <div className='h-full ...'>
        contribute to the Community
          </div>
          <div className='h-full ...'>
        learn
          </div>
        </div>
      </main>
    </div>);
};

export default HomePage;