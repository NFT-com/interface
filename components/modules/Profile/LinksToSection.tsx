import Image from 'next/image';
import { useRouter } from 'next/router';
import LinkToGreenKey from 'public/link-to-green-key.png';
import LinkToKey from 'public/link-to-key.png';
import LinkToNFTCOM from 'public/link-to-nftcom.png';
import LinkToOpensea from 'public/link-to-opensea.png';
// import LinkToWhitePaper from 'assets/images/link-to-whitepaper.png';
import LinkToYou from 'public/link-to-you.png';

export interface LinksToSectionParams {
  isAddressOwner: boolean;
}

export function LinksToSection(props: LinksToSectionParams) {
  const { isAddressOwner } = props;
  const router = useRouter();

  const ownerlinksContents = [
    {
      image: LinkToNFTCOM,
      section: 'DOCUMENT',
      title: 'NFT.COM Summary',
      description: 'Learn more about Genesis Keys and Profiles in this PDF.',
      linkTo: () => { router.push('/about'); }
    },
    // {
    //   image: LinkToWhitePaper,
    //   section: 'COMING SOON',
    //   title: 'NFT.COM Whitepaper',
    //   description: 'Learn more about Genesis Keys and Profiles in this PDF.',
    //   linkTo: () => {
    //     // todo: whitepaper link
    //   }
    // },
    {
      image: LinkToYou,
      section: 'KNOWLEDGE BASE',
      title: 'NFT.COM Support',
      description: 'Learn about the different ways you can obtain your own NFT.com Profile.',
      linkTo: () => { router.push('/about'); }
    },
    {
      image: LinkToGreenKey,
      section: 'GALLERY',
      title: 'NFT.COM Gallery',
      description: 'Explore all Genesis Keys and existing NFT.com Profiles in our Gallery.',
      linkTo: () => { router.push('/about'); }
    },
    {
      image: LinkToOpensea,
      section: 'MARKET PLACE',
      title: 'Opensea.io',
      description: 'View our Genesis Key and NFT.com Profile Collections on Opensea',
      linkTo: () => { router.push('/about'); }
    }
  ];
  
  const notOwnerlinksContents = [
    {
      image: LinkToKey,
      section: 'EVENTS',
      title: 'NFT.COM Public Release',
      description: 'Buy a Genesis Keys and receive four Profiles to make your own.',
      linkTo: () => { router.push('/app/sale'); }
    },
    {
      image: LinkToYou,
      section: 'KNOWLEDGE BASE',
      title: 'NFT.COM Support',
      description: 'Learn about the different ways you can obtain your own NFT.com Profile.',
      linkTo: () => { router.push('/about'); }
    },
    {
      image: LinkToGreenKey,
      section: 'GALLERY',
      title: 'NFT.COM Gallery',
      description: 'Explore all Genesis Keys and existing NFT.com Profiles in our Gallery.',
      linkTo: () => { router.push('/app/gallery'); }
    },
    {
      image: LinkToOpensea,
      section: 'MARKET PLACE',
      title: 'Opensea.io',
      description: 'View our Genesis Key and NFT.com Profile Collections on Opensea',
      linkTo: () => {
        window.open('https://opensea.io', '_blank');
      }
    }
  ];

  return (
    <div className="flex flex-row lg:flex-col lg:space-y-4 space-y-0 lg:space-x-0 space-x-4 lg:w-auto w-[70%]">
      {
        (isAddressOwner ? ownerlinksContents : notOwnerlinksContents)
          .map((item) =>
            (
              <div
                key={item.section}
                onClick={item.linkTo}
                className="bg-modal-overlay-dk rounded-xl lg:w-full w-52 grow cursor-pointer">
                <div className="lg:text-sm text-lg md:p-2 p-4">{item.section}</div>
                <div className="w-full">
                  <Image src={item.image}
                    layout="fill"
                    objectFit="contain"
                    className="object-center object-cover w-full"
                    alt="link to section" />
                </div>
                <div className="md:p-3 p-4">
                  <div className="mb-1 lg:text-base text-xl">{item.title}</div>
                  <div className="lg:text-xs text-base">{item.description}</div>
                </div>
              </div>
            )
          )
      }
    </div>
  );
}