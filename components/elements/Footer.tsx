import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import Link from 'next/link';
import Logo from 'public/LogoFooterWhite.svg';
import { useAccount } from 'wagmi';

export const Footer = () => {
  const { address: currentAddress } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { profileTokens } = useMyNftProfileTokens();

  const footerData = [
    {
      title: 'Learn',
      links: filterNulls([
        {
          name: 'Gallery',
          link: '/app/gallery',
          newTab: false,
        },
        !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(profileTokens)
          ? {
            name: 'Vault',
            link: '/app/vault',
            newTab: false,
            stylize: true,
          }
          : null,
        {
          name: 'Docs',
          link: 'https://docs.nft.com',
          newTab: true,
        },
        {
          name: 'Blog',
          link: '/articles',
          newTab: false,
        },
        {
          name: 'What is an NFT?',
          link: '/articles/what-is-an-nft',
          newTab: false,
        },
      ])
    },
    {
      title: 'Resources',
      links: [
        {
          name: 'Support',
          link: 'https://support.nft.com',
          newTab: true,
        },
        {
          name: 'Careers',
          link: 'https://jobs.lever.co/Nft.com',
          newTab: true,
        },
        {
          name: 'Business Inquiries',
          link: 'mailto:info@nft.com',
          newTab: true,
        },
      ]
    },
    {
      title: 'Policies',
      links: [
        {
          name: 'Terms of Service',
          link: 'https://cdn.nft.com/nft_com_terms_of_service.pdf',
          newTab: true,
        },
        {
          name: 'Privacy Policy',
          link: 'https://cdn.nft.com/nft_com_privacy_policy.pdf',
          newTab: true,
        },
        {
          name: 'Bug Bounty',
          link: 'mailto:bugbounty@nft.com?subject=Bug Bounty for NFT.com ' + new Date().toLocaleDateString(),
          newTab: true,
        },
      ]
    },
    {
      title: 'Social',
      links: [
        {
          name: 'Discord',
          link: 'https://discord.gg/nftdotcom',
          newTab: true,
        },
        {
          name: 'Twitter',
          link: 'https://twitter.com/nftcomofficial',
          newTab: true,
        },
      ]
    },
  ];

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <div id="FooterContainer" className='bg-black rounded-t-[75px] -mt-[75px] pb-6 font-grotesk text-primary-txt-dk relative'>
        <div className={tw(
          'flex flex-col minlg:flex-row relative content-between minlg:content-center pt-16'
        )}>
          <div className={tw(
            'minlg:w-max w-full flex-shrink-0 flex',
            'items-start justify-between flex-col text-base minlg:pl-14 pl-0 minlg:items-start'
          )}>
            <Link href="/">
              <div className={tw(
                'font-hero-heading1 flex items-center mb-0 minlg:mb-8',
              )}>
                <Link href='/' passHref>
                  <div className='w-10 h-10'>
                    <Logo className='w-10 h-10 justify-start' />
                  </div>
                </Link>
              </div>
            </Link>
          </div>
          <div className="w-full grid minlg:grid-cols-4 minmd:grid-cols-3 grid-cols-2 minlg:ml-20 minxl:pl-24">
            {filterNulls(footerData).map((item, index) => {
              return (
                <div className={tw(
                  'text-base mt-12 minlg:mt-0 pl-[30%] minmd:pl-[35%] minlg:pl-0',
                  index === 3 && 'col-start-2 minlg:row-auto minlg:col-auto',
                )} key={index}>
                  <span className="font-medium">
                    <b>{item.title}</b>
                  </span>
                  <div className='flex flex-col'>
                    {item.links?.map((item, index) => {
                      return (
                        <Link
                          href={item.link}
                          key={index}
                        >
                          {item.newTab ?
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mt-4 font-normal list-none cursor-pointer hover:font-bold"
                              style={item?.stylize
                                ? {
                                  background: 'linear-gradient(-45deg, #F03290, #03C1FD, #B755AB, #8076C4)',
                                  backgroundSize: '200% 200%',
                                  animation: 'gradient 20s ease infinite',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }
                                : null}
                            >
                              {item.name}
                            </a>
                            :
                            <a
                              className="mt-4 font-normal list-none cursor-pointer hover:font-bold"
                              style={item?.stylize
                                ? {
                                  background: 'linear-gradient(-45deg, #F03290, #03C1FD, #B755AB, #8076C4)',
                                  backgroundSize: '200% 200%',
                                  animation: 'gradient 20s ease infinite',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }
                                : null}
                            >
                              {item.name}
                            </a>
                          }
                        </Link>
                      );
                    })}
                  </div>
                </div>);
            })}
          </div>
        </div>
        <div className="w-full mx-auto text-xs text-center minlg:text-left minlg:pl-14 mt-9 minlg:mt-4">
          © {new Date().getFullYear()} NFT.com. All rights reserved
        </div>
      </div>
    );
  } else {
    return (
      <div id="FooterContainer" className='bg-[#222222] pb-6 font-grotesk text-primary-txt-dk'>
        <div className={tw(
          'flex flex-col minlg:flex-row relative content-between minlg:content-center pt-12'
        )}>
          <div className={tw(
            'minlg:w-max w-full flex-shrink-0 flex',
            'items-start justify-between flex-col text-base minlg:pl-5 pl-0 minlg:items-start'
          )}>
            <Link href="/">
              <div className={tw(
                'font-hero-heading1 flex items-center mb-0 minlg:mb-8',
              )}>
                <Link href='/' passHref>
                  <div className='w-10 h-10'>
                    <Logo className='w-10 h-10 justify-start' />
                  </div>
                </Link>
              </div>
            </Link>
          </div>
          <div className="w-full grid minlg:grid-cols-4 minmd:grid-cols-3 grid-cols-2 minlg:ml-20 minxl:pl-24">
            {filterNulls(footerData).map((item, index) => {
              return (
                <div className={tw(
                  'text-base mt-12 minlg:mt-0 pl-[30%] minmd:pl-[35%] minlg:pl-0',
                  index === 3 && 'col-start-2 minlg:row-auto minlg:col-auto',
                )} key={index}>
                  <span className="font-medium">
                    <b>{item.title}</b>
                  </span>
                  <div className='flex flex-col'>
                    {item.links?.map((item, index) => {
                      return (
                        <Link
                          href={item.link}
                          key={index}
                        >
                          {item.newTab ?
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mt-4 font-normal list-none cursor-pointer hover:font-bold"
                              style={item?.stylize
                                ? {
                                  background: 'linear-gradient(-45deg, #F03290, #03C1FD, #B755AB, #8076C4)',
                                  backgroundSize: '200% 200%',
                                  animation: 'gradient 20s ease infinite',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }
                                : null}
                            >
                              {item.name}
                            </a>
                            :
                            <a
                              className="mt-4 font-normal list-none cursor-pointer hover:font-bold"
                              style={item?.stylize
                                ? {
                                  background: 'linear-gradient(-45deg, #F03290, #03C1FD, #B755AB, #8076C4)',
                                  backgroundSize: '200% 200%',
                                  animation: 'gradient 20s ease infinite',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }
                                : null}
                            >
                              {item.name}
                            </a>
                          }
                        </Link>
                      );
                    })}
                  </div>
                </div>);
            })}
          </div>
        </div>
        <div className="w-full mx-auto text-xs text-center minlg:text-left minlg:pl-4 mt-9 minlg:mt-4">
          © {new Date().getFullYear()} NFT.com. All rights reserved
        </div>
      </div>
    );
  }
};