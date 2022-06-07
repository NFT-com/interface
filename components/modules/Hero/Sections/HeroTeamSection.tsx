import { tw } from 'utils/tw';

import { Person, PersonTile } from './PersonTile';

import alecHeadshot from 'public/alecNFT.jpg';
import andrewHeadshot from 'public/andrewNFT.png';
import gavinHeadshot from 'public/gavinNFT.png';
import teamBg from 'public/hero-team-bg.png';
import jeannaHeadshot from 'public/jeannaNFT.png';
import jordanHeadshot from 'public/jordannft.jpg';
import kentHeadshot from 'public/kentNFT.png';
import khurramHeadshot from 'public/KhurramNFT.jpg';
import kyleHeadshot from 'public/kyleNFT.jpeg';

const PEOPLE_LEFT: Person[] = [
  {
    name: 'JORDAN FRIED',
    bioItems: [
      'Chairman, CEO of Immutable Holdings',
      'Founding Team Member and SVP of Hedera Hashgraph, ' +
      'led recruitment of Google, IBM, Boeing, LG and more',
      'Founded Buffered VPN in 2013, exited in 2017',
      'Lifetime banned from Runescape at 13 for RMT. Cannot 1v1 in wildy'
    ],
    pictureUrl: jordanHeadshot,
    twitterUrl: 'https://twitter.com/jordanfried',
    linkedInUrl: 'https://linkedin.com/in/jordanfried'
  },
  {
    name: 'JEANNA LIU',
    bioItems: [
      'COO of Immutable Holdings',
      'Reformed Wall Street Banker, advised over $15B' +
        ' of media/tech deals',
      'B.S. Economics, MIT',
      'Spent her bitcoin on bar stools in 2014'
    ],
    pictureUrl: jeannaHeadshot,
    twitterUrl: 'https://twitter.com/JeannaQLiu',
    linkedInUrl: 'https://www.linkedin.com/in/jeannaqliu/'
  },
  {
    name: 'ANDREW MASANTO',
    bioItems: [
      'Founding CMO of Hedera Hashgraph and Reserve',
      '5x Entrepreneur, started Hedera, Reserve, Nillion, PetLab, Higher Click',
      'Extensive E-commerce and D2C marketing experience at scale',
      'Once lost a coin toss for the rarest pepe NFT'
    ],
    pictureUrl: andrewHeadshot,
    twitterUrl: 'https://twitter.com/AndrewMasanto',
    linkedInUrl: 'https://linkedin.com/in/andrewmasanto'
  },
  {
    name: 'GAVIN MAI',
    bioItems: [
      'Cofounder at Carbon-12 Labs (Y Combinator W20)',
      'Pioneered early algorithmic stablecoin research ' +
        'and built global compliant fiat-crypto payment rails',
      'B.S. Symbolic Systems, Stanford University',
      '"Gas man" 100+ ETH spent on gas according to fees.wtf'
    ],
    pictureUrl: gavinHeadshot,
    twitterUrl: 'https://twitter.com/gmaijoe',
    linkedInUrl: 'https://www.linkedin.com/in/gavinmai/'
  }
];

const PEOPLE_RIGHT: Person[] = [
  {
    name: 'KENT MAKISHIMA',
    bioItems: [
      'Blockchain Project Manager: Animoca Brands, a gaming company',
      'Cofounder/CEO: Armada Chain, a supply chain data platform',
      'Managing Partner: ZS Blockchain, a DLT consulting company',
      'Lived in a closet in SF, will compete in hackathons for food',
      '**No longer lives in a closet'
    ],
    pictureUrl: kentHeadshot,
    twitterUrl: 'https://twitter.com/kentmakishima',
    linkedInUrl: 'https://www.linkedin.com/in/kent-makishima/'
  },
  {
    name: 'KYLE ARMOUR',
    bioItems: [
      'Founding Team Member of Hedera Hashgraph',
      'CEO/Founder of LeadArtists, creative marketing agency',
      'Only invests in two modes - 100x or lose everything'
    ],
    pictureUrl: kyleHeadshot,
    twitterUrl: 'https://twitter.com/ImmutableArmour',
    linkedInUrl: 'https://linkedin.com/in/kylearmour'
  },
  {
    name: 'ALEC OTTO',
    bioItems: [
      'Founding Team Member of Hedera Hashgraph',
      'Led community scaling for Hedera & e-commerce startups',
      '100% certified emotional crypto trader'
    ],
    pictureUrl: alecHeadshot,
    twitterUrl: 'https://twitter.com/AlecSaysThings',
    linkedInUrl: 'https://www.linkedin.com/in/alecotto/'
  },
  {
    name: 'KHURRAM DARA',
    bioItems: [
      'Previous General Counsel at AirSwap/Fluidity',
      'Advised blockchain/crypto startups at Orrick, Herrington & Sutcliffe LLP',
      'Does not approve of any of the copy on this website'
    ],
    pictureUrl: khurramHeadshot,
    twitterUrl: 'https://www.twitter.com/khurramdara',
    linkedInUrl: 'https://www.linkedin.com/in/khurram-dara/'
  },
];

export default function HeroTeamSection() {
  return (
    <div>
      <div
        id="teamSection"
        className="w-full relative pb-36"
        style={{
          backgroundImage: `url(${teamBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className={tw(
          'absolute top-0 left-0 w-full h-16 mb-8 deprecated_minlg:absolute deprecated_minlg:top-0',
          'bg-gradient-to-b from-[rgba(0,0,0,1)] to-[rgb(0,0,0,0)]'
        )}>
          {/* adds overlay transition between bg sections  */}
        </div>
        {/* TEAM OG Component */}
        <div className={tw(
          'deprecated_minlg:flex deprecated_minlg:items-start mt-24 mb-8 pt-16 px-8',
          'deprecated_minmd:px-12 deprecated_minlg:px-12 mx-auto deprecated_minmd:w-11/12'
        )}>
          {/* team header section */}
          <div className={tw(
            'z-50 mt-20 deprecated_minlg:sticky deprecated_minlg:top-1/2 deprecated_minlg:align-self deprecated_minlg:mt-48 deprecated_minlg:px-0',
            'deprecated_minlg:transform deprecated_minlg:-translate-y-1/2 deprecated_minlg:mr-12 deprecated_minlg:shrink-0'
          )}>
            <div className={tw(
              'mt-24',
              'text-hero-pink font-hero-heading1 text-6xl',
              'deprecated_minxl:mr-24 mb-12 text-4xl deprecated_minmd:text-5xl deprecated_min2xl:text-6xl'
            )}>
              TEAM
            </div>
            <p className={tw(
              'text-always-white font-hero-heading2 mt-6',
              'text-4xl leading-tight tracking-[0.015em] max-w-sm',
            )}
            >
              A TEAM WITH A TRACK RECORD OF
              BUILDING CRYPTO UNICORNS TOGETHER
            </p>
          </div>

          <div className={'flex flex-col flex-1 pt-7 deprecated_minsm:mt-20 deprecated_minlg:mt-20 deprecated_minlg:pt-0'} >
            {[...PEOPLE_LEFT, ...PEOPLE_RIGHT]
              .map((person: Person, index: any) => (
                <PersonTile
                  key={person.name}
                  person={person}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
          </div>

          <div className={tw('absolute bottom-0 left-0 w-full h-16',
            'bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgb(0,0,0,1)]'
          )}>
            {/* adds overlay transition between bg sections  */}
          </div>
        </div>
      </div>
    </div>
  );
}
