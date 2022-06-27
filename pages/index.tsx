import { Button, ButtonType } from 'components/elements/Button';
import { FeaturedProfile } from 'components/elements/FeaturedProfile';
import { NFTCard } from 'components/elements/NFTCard';
import { ProfileFeed } from 'components/elements/ProfileFeed';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { LeaderBoard } from 'components/modules/Profile/LeaderBoard';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { tw } from 'utils/tw';

import type { NextPage } from 'next';
import Ticker from 'react-ticker';

const HomePage: NextPage = () => {
  const { data: nft } = useNftQuery(
    '0xa5a9a6576303a1e3608fabeb0f64872e0bfbd9f4',
    '1');

  const { profileData: featuredProfile } = useProfileQuery('anthony');

  return (
    <main className='flex flex-col'>
      <div className={tw('flex flex-row items-center justify-left mt-20 p-6 w-screen h-full bg-secondary-dk break-after-all')}>
        <div className='break-after-all space-y-2'>
          <div className={tw(
            'font-rubik text-always-white text-header leading-header font-header',
            'break-after-all space-y-2'
          )}>
            <div>
              OWNERSHIP,
            </div>
            <div>
              FOR EVERYONE
            </div>
          </div>
          <div className='w-full h-full inline-flex grow space-x-2 ...'>
            <WalletRainbowKitButton signInButton showWhenConnected={false} />
            <button
              onClick={() => {
                console.log('clicked');
              }}
              className={tw(
                'w-max',
                'block',
                'font-medium bg-transparent rounded-xl text-secondary-txt-light',
                'flex flex-row items-center cursor-pointer opacity-80 hover:opacity-100',
                'font-rubik font-body',
                'py-2 px-5'
              )}
              type="button">
                  Learn More
            </button>
          </div>
          <FeaturedProfile
            profileOwner={featuredProfile}
            gkId={1}
            pfpUrl={'https://cdn.nft.com/profiles/1653690187501-ghoool.webp'}
          />
        </div>
      </div>
      <div className='space-y-6 p-6 ...'>
        <div className='h-full text-header leading-header font-header justify-center ...'>
        Learn, discover, and own digital items.
          <div className='text-body leading-body font-body py-2 ...'>
            {'We\'re building the hub that is all things Web3.'}
            <div className='...'>
            Do more with your NFT
            </div>
          </div>
          <div className="w-full h-full inline-flex grow space-x-6 ...">
            <Button
              bgColor={'#222222'}
              color={'#ffffff'}
              label="Discover"
              stretch
              onClick={() => {
                console.log('hello');
              }}
              type={ButtonType.SECONDARY}
            />
            <Button
              bgColor='always-white'
              color='secondary-dk'
              stretch
              outline='secondary-dk'
              label="Start Learning"
              onClick={() => {
                console.log('hello');
              }}
              type={ButtonType.SECONDARY}
            />
          </div>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
              Profile Feed
            <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <ProfileFeed
              profiles={[
                'https://cdn.nft.com/profiles/1653690187501-ghoool.webp',
                'https://cdn.nft.com/profiles/1656228209273-1.PNG']}
            />
            <Button
              bgColor={'#222222'}
              color={'#ffffff'}
              label='Discover'
              stretch
              onClick={() => {
                console.log('hello');
              }}
              type={ButtonType.SECONDARY}
            />
          </div>
        </div>
        <div className='h-full w-screen -ml-6 bg-always-black py-6 ...'>
          <Ticker>
            {({ index }) => (
              <div className=' text-always-white text-header leading-header font-header justify-center px-12 ...'>
                  Hello world {index}
              </div>
            )}
          </Ticker>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center mb-6 mt-14 ...'>
              Profile leaderboard
          </div>
          <LeaderBoard />
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
            How NFT.com works
            <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <NFTCard
              title={'NFT Card'}
              images={[nft?.metadata?.imageURL]}
              imageLayout="row"
              onClick={() => console.log('clicked')}
              contractAddress={nft?.contract}
            />
          </div>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
            Get your Profile
            <div className='text-body leading-body font-body py-2 ...'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <NFTCard
              title={'NFT Card'}
              images={[nft?.metadata?.imageURL]}
              imageLayout="row"
              onClick={() => console.log('clicked')}
              contractAddress={nft?.contract}
            />
          </div>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
            Customize Your Profile
            <div className='text-body leading-body font-body py-2 ...'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <NFTCard
              title={'NFT Card'}
              images={[nft?.metadata?.imageURL]}
              imageLayout="row"
              onClick={() => console.log('clicked')}
              contractAddress={nft?.contract}
            />
          </div>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
            Contribute to the Community
            <div className='text-body leading-body font-body py-2 ...'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </div>
        <div className='h-full ...'>
          <div className='text-header leading-header font-header justify-center ...'>
            Learn
            <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <NFTCard
              title={'NFT Card'}
              images={[nft?.metadata?.imageURL]}
              imageLayout="row"
              onClick={() => console.log('clicked')}
              contractAddress={nft?.contract}
            />
          </div>
        </div>
      </div>
    </main>);
};

export default HomePage;