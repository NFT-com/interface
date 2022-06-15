import { Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { tw } from 'utils/tw';

import type { NextPage } from 'next';
import Ticker from 'react-ticker';

const HomePage: NextPage = () => {
  const { data: nft } = useNftQuery(
    '0xa5a9a6576303a1e3608fabeb0f64872e0bfbd9f4',
    '1');

  return (
    <div className="flex flex-col h-screen">
      <main
        className={tw(
          'absolute w-full h-full sm:overflow-x-hidden',
        )}
        style={{
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <div className="flex flex-row items-center justify-center w-screen h-96 bg-always-black ">
          <WalletRainbowKitButton signInButton showWhenConnected={false} />
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
              <NFTCard
                title={'NFT Card'}
                images={[nft?.metadata?.imageURL]}
                imageLayout="row"
                onClick={() => console.log('clicked')}
                contractAddress={nft?.contract}
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
          <div className='h-full bg-always-black py-6'>
            <Ticker>
              {({ index }) => (
                <div className=' text-always-white text-header leading-header font-header justify-center px-12 ...'>
                  Hello world {index}
                </div>
              )}
            </Ticker>
          </div>
          <div className='h-full ...'>
        leaderboard
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
      </main>
    </div>);
};

export default HomePage;