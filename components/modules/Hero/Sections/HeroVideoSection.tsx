import { Button, ButtonSize, ButtonType } from 'components/modules/Hero/HeroButton';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { ExternalLink } from 'styles/theme/Components';

const videos = [
  {
    title: 'WHAT IS NFT.COM',
    description: `How NFT.com Is Doing It Different | The Community Driven NFT 
    Marketplace For The Future`,
    location: '10x Conference',
    date: 'March 30th, 2022',
    videoUrl: 'https://cdn.nft.com/nft-vision-thumb_01.jpg',
    videoExternalUrl: 'https://www.youtube.com/watch?v=Q0Zaz0HMbZA&t=1s',
  },
  {
    title: 'GENESIS KEYS: THE UTILITY / ART HYBRID NFT COLLECTION',
    description: 'Founder Of NFT.com Jordan Fried Talks HBAR, Genesis Keys, NFTs And more!',
    location: 'Exclusive Jordan Fried Interview w/ Noaty Crypto',
    date: 'April 4th, 2022',
    videoUrl: 'https://cdn.nft.com/welcome-to-nft-thumb_02.jpg',
    videoExternalUrl: 'https://www.youtube.com/watch?v=KUEE49XOZFQ&t=58s',
  },
  {
    title: 'WHAT\'S COMING FROM NFT.COM WITH CO-FOUNDER JORDAN FRIED',
    description: 'Discussing Progress Updates, Community Questions, And More!',
    location: 'Fireside Chat With Jordan Fried',
    date: 'March 28th, 2022',
    videoUrl: 'https://cdn.nft.com/discord-thumb_01.jpg',
    videoExternalUrl: 'https://www.youtube.com/watch?v=iaYrOpxz9Ak',
  }
];

export default function HeroVideoSection() {
  return (
    <div id="herovideosection" className="deprecated_minlg:mt-16">
      {videos.map(({
        title,
        description,
        videoUrl,
        videoExternalUrl,
        date,
        location
      }: any, index: number) => (
        <div id={`video${index}`} key={index}
          className={tw('relative flex flex-col-reverse mb-8 pt-16 px-8 deprecated_minmd:px-12 deprecated_minlg:px-12',
            'text-always-white overflow-y-scroll',
            'deprecated_minlg:flex-row min-lg:items-center deprecated_minlg:justify-between deprecated_minlg:pt-2',
            'mx-auto deprecated_minmd:w-11/12'
          )}
        >
          <div className="deprecated_minxs:w-[80%]
          deprecated_min2xl:w-1/2 deprecated_minxl:flex deprecated_minxl:justify-between deprecated_minxl:gap-10">
            <div className="mt-5 deprecated_minxl:mt-0 w-full deprecated_min2xl:w-1/2">
              <div className={tw('text-4xl font-black text-always-white',
                'font-hero-heading2 tracking-wider')}
              >
                { title }
              </div>
              <p className="mt-5 text-lg font-medium text-grey-txt">
                { description }
              </p>
              <div className="mt-8">
                <Button
                  type={ButtonType.PRIMARY}
                  size={ButtonSize.SMALL}
                  label={'GO TO VIDEO'}
                  textColor="black"
                  onClick={() => {
                    window.open(
                      videoExternalUrl,
                      '_blank'
                    );
                  }} />
              </div>
            </div>
          </div>
          <div className={tw('w-full deprecated_minxl:w-2/3 mb-12 aspect-video',
            'relative deprecated_minlg:mr-32 deprecated_minlg:mb-4')}>
            <ExternalLink href={videoExternalUrl}>
              <Image
                className={tw('top-0 left-0',
                  'w-full h-full object-cover'
                )}
                alt={'preview'}
                src={videoUrl}
                layout='fill'
              />
            </ExternalLink>
          </div>
        </div>
      ))}
    </div>
  );
}