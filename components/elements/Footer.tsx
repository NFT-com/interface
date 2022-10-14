import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Link from 'next/link';
import DiscordLogo from 'public/discord.svg';
import Logo from 'public/LogoFooterWhite.svg';
import TwitterLogo from 'public/twitter.svg';
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
      <footer id="FooterContainer" className='bg-black rounded-t-[75px] -mt-[75px] font-noi-grotesk text-primary-txt-dk relative'>
        <div className={tw(
          'flex flex-col minlg:flex-row relative justify-between',
          'pt-16 pb-10 pr-32'
        )}>
          <div className={tw(
            'minlg:max-w-[50%] flex-shrink-0 basis-2/4 flex flex-col',
            'items-start justify-between text-base minlg:pl-14 minlg:pt-[3.25rem]'
          )}>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' passHref>
                <div className='w-10 h-10'>
                  <Logo className='w-10 h-10 justify-start' />
                </div>
              </Link>

              <svg className='ml-3' width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z" fill="white" />
                <path d="M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z" fill="white" />
                <path d="M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z" fill="white" />
              </svg>
            </div>

            {/* Socials */}
            <div className='flex gap-6'>
              <a className={tw(
                'transition-colors text-white hover:text-[#F9D54C]'
              )}
              target="_blank" href="https://twitter.com" rel="noopener noreferrer">
                <TwitterLogo width='28' height='28' viewBox="0 0 38 32" fill="currentColor" />
              </a>
              <a className={tw(
                'transition-colors text-white hover:text-[#F9D54C]'
              )}
              target="_blank" href="https://discord.com/" rel="noopener noreferrer">
                <DiscordLogo width='28' height='28' viewBox="0 0 39 38" fill="currentColor" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="w-full minlg:w-1/2 grid minmd:grid-cols-3 grid-cols-2 minmd:pb-14">
            {filterNulls(footerData).slice(0, 3).map((item, index) => {
              return (
                <div className={tw(
                  'text-base mt-12 minlg:mt-0 pl-[30%] minmd:pl-[35%] minlg:pl-0',
                  index === 3 && 'col-start-2 minlg:row-auto minlg:col-auto',
                )} key={index}>
                  <span className="font-medium text-[0.9375rem]">
                    {item.title}
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
                              className="mt-4 cursor-pointer text-[#8B8B8B] hover:text-white"
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
                              className="mt-4 cursor-pointer text-[#8B8B8B] hover:text-white"
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

        <div className={tw(
          'flex flex-col minlg:flex-row relative justify-between',
          'pr-32'
        )}>
          <div className="w-full text-[14px] text-[#8B8B8B] minlg:pl-14">
            <p className='minlg:mb-16'>© {new Date().getFullYear()} NFT.com. All rights reserved</p>
            <span className='-skew-x-[20deg] w-[115px] h-[110px] bg-[#F9D54C] block ml-24'></span>
          </div>

          <div className='w-full minlg:max-w-[50%] minlg:pt-8 flex-shrink-0 basis-2/4'>
            <h4 className='text-[.9375rem] text-[#8B8B8B]'>Subscribe to our notifications</h4>

            <div className='flex border-b border-b-[#2A2A2A] pb-4'>
              <input type="email" placeholder='Enter your email' className={tw(
                'bg-transparent border-none px-0 w-full',
                'shadow-none focus:border-transparent focus:ring-0'
              )} />
              <button type="submit" className={tw(
                'rounded-full border-2 border-white',
                'px-4 h-9 ml-6'
              )}>Subscribe</button>
            </div>
            <span className='text-xs text-key-gray/50 block pt-3'>Subscribe to our notifications</span>
          </div>
        </div>
      </footer>
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