/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export interface LinksToSectionParams {
  isAddressOwner: boolean;
}

export function LinksToSection(props: LinksToSectionParams) {
  const { isAddressOwner } = props;

  const ownerlinksContents = [
    {
      image: '/link-to-nftcom.png',
      section: 'DOCUMENT',
      title: 'NFT.COM Summary',
      description: 'Learn more about Genesis Keys and Profiles in this PDF.',
      linkTo: '/about'
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
      image: '/link-to-you.png',
      section: 'KNOWLEDGE BASE',
      title: 'NFT.COM Support',
      description: 'Learn about the different ways you can obtain your own NFT.com Profile.',
      linkTo: '/about'
    },
    {
      image: '/link-to-green-key.png',
      section: 'GALLERY',
      title: 'NFT.COM Gallery',
      description: 'Explore all Genesis Keys and existing NFT.com Profiles in our Gallery.',
      linkTo: '/app/gallery'
    },
    {
      image: '/link-to-opensea.png',
      section: 'MARKET PLACE',
      title: 'Opensea.io',
      description: 'View our Genesis Key and NFT.com Profile Collections on Opensea',
      linkTo: 'https://opensea.io/collection/genesiskey'
    }
  ];
  
  const notOwnerlinksContents = [
    {
      image: '/link-to-key.png',
      section: 'EVENTS',
      title: 'NFT.COM Public Release',
      description: 'Buy a Genesis Keys and receive four Profiles to make your own.',
      linkTo: '/app/sale'
    },
    {
      image: '/link-to-you.png',
      section: 'KNOWLEDGE BASE',
      title: 'NFT.COM Support',
      description: 'Learn about the different ways you can obtain your own NFT.com Profile.',
      linkTo: '/about'
    },
    {
      image: '/link-to-green-key.png',
      section: 'GALLERY',
      title: 'NFT.COM Gallery',
      description: 'Explore all Genesis Keys and existing NFT.com Profiles in our Gallery.',
      linkTo: '/app/gallery'
    },
    {
      image: '/link-to-opensea.png',
      section: 'MARKET PLACE',
      title: 'Opensea.io',
      description: 'View our Genesis Key and NFT.com Profile Collections on Opensea',
      linkTo: 'https://opensea.io/collection/genesiskey'
    }
  ];

  return (
    <div className="flex flex-col minxl:flex-row space-y-4 minxl:space-y-0 space-x-0 minxl:space-x-4 w-auto minxl:w-full">
      {
        (isAddressOwner ? ownerlinksContents : notOwnerlinksContents)
          .map((item) =>
            (
              <Link href={item.linkTo}
                key={item.section}
              >
                <a
                  target='_blank'
                  key={item.section}
                  className="bg-footer-bg rounded-xl lg:w-full w-52 grow cursor-pointer">
                  <div className="text-sm minxl:text-lg p-2 minlg:p-4">{item.section}</div>
                  <div className="w-full">
                    <img src={item.image} className="object-center object-cover w-full" alt="link to section" />
                  </div>
                  <div className="p-3 minlg:p-4">
                    <div className="mb-1 text-base minxl:text-xl">{item.title}</div>
                    <div className="text-xs minxl:text-base">{item.description}</div>
                  </div>
                </a>
              </Link>
            )
          )
      }
    </div>
  );
}