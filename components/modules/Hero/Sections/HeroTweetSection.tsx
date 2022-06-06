import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image, { StaticImageData } from 'next/image';
import DefaultLogo from 'public/default_user.svg';
import jade from 'public/jade.jpg';
import kevinoLeary from 'public/kevinoleary.png';
import medici from 'public/medici.png';
import TwitterIcon from 'public/twitter_icon.svg';
import { ExternalLink } from 'styles/theme/Components';

type Tweet = {
  text: string;
  author: string;
  image: StaticImageData;
  twitterURL: string;
};

const TWEETS: Tweet[] = [
  {
    text:
      `I'm thrilled to support NFT.com in their quest to build a 
      true creator-centric platform. We look forward to showcasing 
      The Medici Collection and sharing tales of the works of art.`,
    author: 'Cozomo de Medici',
    image: medici,
    twitterURL: 'https://twitter.com/CozomoMedici'
  },
  {
    text:
    `NFT.com is setting the standard for what we should expect from web3.
    I am proud to be involved with a team that is laser focused on creating value for the NFT space.`,
    author: 'Kevin O\'Leary',
    image: kevinoLeary,
    twitterURL: 'https://twitter.com/kevinolearytv'
  },
  {
    text: `The NFT.com team is a powerhouse and we're thrilled to partner 
    with them. We immediately resonated with their creator-first and 
    community driven approach. Genesis Keys will be a new paradigm for NFTs.`,
    author: 'JADE Protocol',
    image: jade,
    twitterURL: 'https://twitter.com/JadeProtocol'
  },
];

const bgGif = 'https://cdn.nft.com/new_slowroll_gif.gif';

export default function HeroTweetSection() {
  return (
    <div className='flex w-full flex-row'>
      <div className="mt-32 deprecated_lg:mt-16 px-16 w-2/4 deprecated_lg:w-full">
        <div className={tw('deprecated_minxs:w-[80%] deprecated_minxl:mr-6 mb-12 text-4xl deprecated_minmd:text-5xl deprecated_min2xl:text-6xl',
          'text-hero-pink font-hero-heading1'
        )}>
          WHAT OUR <br /> PARTNERS <br /> ARE SAYING
        </div>
        <div
          id="tweetSection"
          className={tw(
            'text-always-white',
          )}
        >
          {TWEETS.map((tweet: Tweet) => {
            return (
              <div key={tweet.author}
                className={tw(
                  'relative flex min-h-72 z-20 mb-6',
                  'rounded-2xl',
                )}
              >
                <div className='flex flex-col'>
                  <div
                    className='flex w-16 h-16 mr-6'
                    key={tweet.author}>
                    {
                      isNullOrEmpty(tweet.image.src) ?
                        <DefaultLogo />
                        :
                        <Image
                          src={tweet.image.src}
                          alt={tweet.author}
                          width={'64px'}
                          height={'64px'}
                          className='border-2 rounded-full object-cover border-[#010101]'
                        />
                    }
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className="flex text-4xl deprecated_md:text-3xl deprecated_sm:text-2xl font-hero-heading2 font-medium text-always-white tracking-wide">
                    {tweet.author}
                    <div className='flex h-full items-center px-4'>
                      <ExternalLink href={tweet.twitterURL}>
                        <TwitterIcon
                          className={'cursor-pointer flex shrink-0 w-6'}
                        />
                      </ExternalLink>
                    </div>
                  </div>
                  <div className={tw(
                    'text-lg deprecated_md:text-base',
                    'text-grey-txt',
                    'mt-4'
                  )}>
                    {tweet.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='flex flex-col justify-center w-2/4 deprecated_lg:hidden relative'>
        <div
          className={tw(
            'absolute top-32 left-0 w-full h-32',
            'bg-gradient-to-b from-black to-transparent z-50',
          )}
        >
          {/* adds overlay transition  */}
        </div>
        <div
          className={tw(
            'absolute bottom-0 left-0 w-full h-32',
            'bg-gradient-to-t from-black to-transparent z-50',
          )}
        >
          {/* adds overlay transition  */}
        </div>
        <Image
          src={bgGif}
          alt="tweet gif"
          className='w-full mt-32 block aspect-square bg-cover bg-no-repeat bg-center'
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
}
