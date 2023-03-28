/* eslint-disable @next/next/no-img-element */
import Toast from 'components/elements/Toast';
import { filterNulls, getStaticAsset } from 'utils/helpers';
import { tw } from 'utils/tw';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';
import DiscordLogo from 'public/discord.svg?svgr';
import TwitterLogo from 'public/twitter.svg?svgr';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

export const FooterSmall = () => {
  const footerData = [
    {
      title: 'Learn',
      links: filterNulls([
        {
          name: 'Gallery',
          link: '/app/gallery',
          newTab: false,
        },
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
          link: 'https://www.linkedin.com/jobs/search/?currentJobId=3361499885&f_C=71294367%2C79896685',
          newTab: true,
        }
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

  return (
    <footer >
      <Toast />
      <div className={tw(
        'font-noi-grotesk text-primary-txt-dk relative',
        'bg-black'
      )}>
        <div className={tw(
          'minlg:flex minlg:flex-row relative justify-between',
          'pt-10 pb-10 minlg:pb-0 px-5 minlg:pl-0'
        )}>
          <div className={tw(
            'minlg:max-w-[35%] minlg:flex-shrink-0 minlg:basis-2/4 flex flex-col',
            'items-start justify-between minlg:justify-start text-base minlg:pl-14 minlg:pt-4'
          )}>
            {/* Logo */}
            <div data-aos="fade-right" data-aos-delay="100" className='flex items-center mb-12'>
              <Link href='/' passHref>
                <div className='w-[3.8rem] h-[3.8rem]'>
                  <img src={getStaticAsset('public/LogoFooterWhite.svg')} alt='public/LogoFooterWhite.svg' className='w-[3.8rem] h-[3.8rem] justify-start' />
                </div>
              </Link>

              <svg className='ml-3' width="87" height="23" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z" fill="white" />
                <path d="M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z" fill="white" />
                <path d="M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z" fill="white" />
              </svg>
            </div>

            {/* Socials */}
            <div className='flex gap-4'>
              <a data-aos="fade-left" data-aos-delay="200" className={tw(
                'transition-colors text-white hover:text-[#F9D54C]'
              )}
              target="_blank" href="https://twitter.com/NFTcomofficial" rel="noopener noreferrer">
                <TwitterLogo className={tw(
                  'w-8 h-8'
                )} viewBox="0 0 38 32" fill="currentColor" />
              </a>
              <a data-aos="fade-left" data-aos-delay="300" className={tw(
                'transition-colors text-white hover:text-[#F9D54C]'
              )}
              target="_blank" href="https://discord.com/invite/nftdotcom" rel="noopener noreferrer">
                <DiscordLogo className={tw(
                  'w-8 h-8'
                )} viewBox="0 0 39 38" fill="currentColor" />
              </a>
              <button
                type="submit"
                className={tw(
                  'text-sm',
                  'rounded-full border-2 border-white',
                  'px-4 h-8 ml-3',
                  'transition-colors hover:bg-white hover:text-black'
                )}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Nav */}
          <div
            className="w-full grid grid-cols-2 minmd:flex minlg:justify-start minmd:ml-0 minlg:ml-20 minmd:space-x-20 minlg:pb-14">
            {filterNulls(footerData).slice(0, 3).map((item, index) => {
              return (
                <div className={tw(
                  'text-base mt-10 minlg:mt-4',
                  index === 3 && 'col-start-2 minlg:row-auto minlg:col-auto',
                )} key={index}>
                  <span className="font-medium text-lg">
                    {item.title}
                  </span>
                  <div className={tw(
                    'flex flex-col text-base minlg:grid minlg:auto-cols-max',
                    index === 1 ? 'grid-cols-1 grid-rows-2 grid-flow-col gap-2' : 'grid-cols-[min-content_2fr] grid-rows-2 grid-flow-col gap-y-2 gap-x-7'
                  )}>
                    {item.links?.map((item, index) => {
                      return (
                        <Link
                          href={item.link}
                          key={index}
                          legacyBehavior
                        >
                          {item.newTab ?
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              className={tw(
                                'cursor-pointer text-[#8B8B8B] hover:text-white w-max',
                                index === 0 ? 'mt-4 minlg:mt-4' : 'mt-3 minlg:mt-0',
                                index === 2 && 'minlg:mt-4'
                              )}
                            >
                              {item.name}
                            </a>
                            :
                            <a
                              className={tw(
                                'cursor-pointer text-[#8B8B8B] hover:text-white w-max',
                                index === 0 ? 'mt-4 minlg:mt-4' : 'mt-3 minlg:mt-0',
                                index === 2 && 'minlg:mt-4'
                              )}
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
          'flex flex-col minlg:flex-row justify-between',
          'relative px-5 pb-16 minlg:pb-0 minlg:pl-0'
        )}>
          <div className={tw(
            'w-full text-sm minxxl:text-lg text-[#6A6A6A] minlg:pl-14',
            'order-1 minlg:-order-1 minmd:flex'
          )}>
            <p>© {new Date().getFullYear()} NFT.com. <br className='minlg:hidden' /> All rights reserved</p>
            <span className={tw(
              'absolute minlg:relative bottom-0 right-10',
              '-skew-x-[20deg] w-[125px] h-[175px] minlg:h-[100px] bg-[#F9D54C] block',
              'mr-5 ml-auto minlg:ml-24 minlg:-mt-5 minlg:mr-0'
            )}></span>
          </div>

        </div>
      </div>
    </footer>
  );
};
