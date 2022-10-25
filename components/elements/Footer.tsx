import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DiscordLogo from 'public/discord.svg';
import Logo from 'public/LogoFooterWhite.svg';
import TwitterLogo from 'public/twitter.svg';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const { address: currentAddress } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { profileTokens } = useMyNftProfileTokens();
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      disable: function() {
        const maxWidth = 900;
        return window.innerWidth >= maxWidth;
      },
      duration : 700
    });

    const matchMedia = gsap.matchMedia();

    matchMedia.add('(min-width: 900px)', () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#FooterContainer',
          start: '70% bottom',
          end: '+=50px',
          toggleActions: router.pathname === '/' ? 'play none reverse none' : 'none none none none',
        }
      })
        .to('#footer-content', {
          y: 0,
          duration: 1.8,
          ease: 'power2.out'
        });
    });
  });

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
      <footer id="FooterContainer" className={`overflow-hidden ${router.pathname === '/' ? '-mt-[28.8rem]' : '-mt-[17rem]'}`}>
        <div id='footer-content' className={tw(
          'font-noi-grotesk text-primary-txt-dk relative',
          'bg-black rounded-t-[40px] minlg:rounded-t-[75px]',
          'minlg:translate-y-1/2 transform-gpu'
        )}>
          <div className={tw(
            'minlg:flex minlg:flex-row relative justify-between',
            'pt-16 pb-10 px-5 minlg:pl-0 minlg:pr-32'
          )}>
            <div className={tw(
              'minlg:max-w-[50%] minlg:flex-shrink-0 minlg:basis-2/4 flex flex-col',
              'items-start justify-between text-base minlg:pl-14 minlg:pt-[2.35rem]'
            )}>
              {/* Logo */}
              <div data-aos="fade-right" data-aos-delay="100" className='flex items-center mb-[2.625rem] minlg:mb-0'>
                <Link href='/' passHref>
                  <div className='w-[3.8rem] h-[3.8rem]'>
                    <Logo className='w-[3.8rem] h-[3.8rem] justify-start' />
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
                    'w-7 h-7 minxxl:w-9 minxxl:h-9'
                  )} viewBox="0 0 38 32" fill="currentColor" />
                </a>
                <a data-aos="fade-left" data-aos-delay="300" className={tw(
                  'transition-colors text-white hover:text-[#F9D54C]'
                )}
                target="_blank" href="https://discord.com/invite/nftdotcom" rel="noopener noreferrer">
                  <DiscordLogo className={tw(
                    'w-7 h-7 minxxl:w-9 minxxl:h-9'
                  )} viewBox="0 0 39 38" fill="currentColor" />
                </a>
              </div>
            </div>

            {/* Nav */}
            <div data-aos="fade-up" data-aos-delay="100" className="w-full minlg:w-1/2 grid minmd:grid-cols-3 grid-cols-2 minmd:pb-14">
              {filterNulls(footerData).slice(0, 3).map((item, index) => {
                return (
                  <div className={tw(
                    'text-base minxxl:text-xl mt-12 minlg:mt-0 minmd:pl-[35%] minlg:pl-0',
                    index === 3 && 'col-start-2 minlg:row-auto minlg:col-auto',
                  )} key={index}>
                    <span className="font-medium text-[0.9375rem] minxxl:text-[1.5rem]">
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
            'flex flex-col minlg:flex-row justify-between',
            'relative px-5 minlg:pl-0 minlg:pr-32'
          )}>
            <div data-aos="fade-right" data-aos-delay="200" className={tw(
              'w-full text-sm minxxl:text-lg text-[#8B8B8B] minlg:pl-14',
              'order-1 minlg:-order-1'
            )}>
              <p className='mb-6 minlg:mb-[6.8rem]'>© {new Date().getFullYear()} NFT.com. <br className='minlg:hidden' /> All rights reserved</p>
              <span className={tw(
                '-skew-x-[20deg] w-[115px] h-[110px] bg-[#F9D54C] block',
                'mr-5 ml-auto minlg:ml-24 minlg:mr-0'
              )}></span>
            </div>

            <div data-aos="fade-up" data-aos-delay="100" className='w-full minlg:max-w-[50%] minlg:pt-[4.5rem] flex-shrink-0 basis-2/4'>
              <h4 className='minlg:text-[.9375rem] minxxl:text-[1.5rem] mb-4 text-[#8B8B8B]'>Subscribe to our notifications</h4>

              <div className='flex border-b border-b-[#2A2A2A] pb-4'>
                <input type="email" placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} className={tw(
                  'minxxl:text-xl',
                  'bg-transparent border-none px-0 w-full',
                  'shadow-none focus:border-transparent focus:ring-0'
                )} />
                <button type="submit" onClick={async () => {
                  try {
                    await fetch(`${getEnv(Doppler.NEXT_PUBLIC_GRAPHQL_URL).replace('/graphql', '')}/subscribe/${email?.toLowerCase()}`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                    alert('success!');
                  } catch (err) {
                    console.log('error while subscribing: ', err);
                  }
                }} className={tw(
                  'text-sm minxxl:text-lg',
                  'rounded-full border-2 border-white',
                  'px-4 h-9 minxxl:px-6 minxxl:h-11 ml-6',
                  'transition-colors hover:bg-white hover:text-black'
                )}>Subscribe</button>
              </div>
              <span className='text-[.875rem] minlg:text-xs minxxl:text-sm text-key-gray/50 block pt-3 mb-[3.75rem] minlg:mb-0'>Subscribe to our notifications</span>
            </div>
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
