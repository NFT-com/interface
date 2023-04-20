/* eslint-disable @next/next/no-img-element */
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Toast from 'components/elements/Toast';
import { useEmailSubscribe } from 'hooks/useEmailSubscribe';
import { filterNulls } from 'utils/format';
import { tw } from 'utils/tw';

import DiscordLogo from 'public/icons/discord.svg?svgr';
import TwitterLogo from 'public/icons/twitter.svg?svgr';

const BlurImage = dynamic(import('components/elements/BlurImage'));

gsap.registerPlugin(ScrollTrigger);

export const FooterSmall = () => {
  const { subscribe } = useEmailSubscribe();
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const footerData = [
    {
      title: 'Learn',
      links: filterNulls([
        {
          name: 'Docs',
          link: 'https://docs.nft.com',
          newTab: true
        },
        {
          name: 'Blog',
          link: '/articles',
          newTab: false
        },
        {
          name: 'What is an NFT?',
          link: '/articles/what-is-an-nft',
          newTab: false
        }
      ])
    },
    {
      title: 'Resources',
      links: [
        {
          name: 'Support',
          link: 'https://support.nft.com',
          newTab: true
        },
        {
          name: 'Careers',
          link: 'https://www.linkedin.com/jobs/search/?currentJobId=3361499885&f_C=71294367%2C79896685',
          newTab: true
        }
      ]
    },
    {
      title: 'Policies',
      links: [
        {
          name: 'Terms of Service',
          link: 'https://cdn.nft.com/nft_com_terms_of_service.pdf',
          newTab: true
        },
        {
          name: 'Privacy Policy',
          link: 'https://cdn.nft.com/nft_com_privacy_policy.pdf',
          newTab: true
        },
        {
          name: 'Bug Bounty',
          link: `mailto:bugbounty@nft.com?subject=Bug Bounty for NFT.com ${new Date().toLocaleDateString()}`,
          newTab: true
        }
      ]
    },
    {
      title: 'Social',
      links: [
        {
          name: 'Discord',
          link: 'https://discord.gg/nftdotcom',
          newTab: true
        },
        {
          name: 'Twitter',
          link: 'https://twitter.com/nftcomofficial',
          newTab: true
        }
      ]
    }
  ];

  return (
    <footer>
      <Toast />
      <div className={tw('relative font-noi-grotesk text-primary-txt-dk', 'bg-black')}>
        <div
          className={tw('relative justify-between minlg:flex minlg:flex-row', 'px-5 pb-10 pt-10 minlg:pb-0 minlg:pl-0')}
        >
          <div
            className={tw(
              'flex flex-col minlg:max-w-[35%] minlg:flex-shrink-0 minlg:basis-2/4 minxxl:max-w-[50%]',
              'items-start justify-between text-base minlg:justify-start minlg:pl-14 minlg:pt-4'
            )}
          >
            {/* Logo */}
            <div data-aos='fade-right' data-aos-delay='100' className='mb-12 flex items-center'>
              <Link href='/' passHref>
                <div className='h-[3.8rem] w-[3.8rem]'>
                  <BlurImage
                    localImage
                    src='/icons/LogoFooterWhite.svg'
                    alt='NFT.com white footer logo'
                    className='h-[3.8rem] w-[3.8rem] justify-start'
                    width={60}
                    height={60}
                  />
                </div>
              </Link>

              <svg
                className='ml-3'
                width='87'
                height='23'
                viewBox='0 0 63 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z'
                  fill='white'
                />
                <path
                  d='M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z'
                  fill='white'
                />
                <path d='M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z' fill='white' />
              </svg>
            </div>

            {/* Socials */}
            <div className='flex gap-4'>
              <a
                data-aos='fade-left'
                data-aos-delay='200'
                className={tw('text-white transition-colors hover:text-[#F9D54C]')}
                target='_blank'
                href='https://twitter.com/NFTcomofficial'
                rel='noopener noreferrer'
              >
                <TwitterLogo className={tw('h-8 w-8')} viewBox='0 0 38 32' fill='currentColor' />
              </a>
              <a
                data-aos='fade-left'
                data-aos-delay='300'
                className={tw('text-white transition-colors hover:text-[#F9D54C]')}
                target='_blank'
                href='https://discord.com/invite/nftdotcom'
                rel='noopener noreferrer'
              >
                <DiscordLogo className={tw('h-8 w-8')} viewBox='0 0 39 38' fill='currentColor' />
              </a>
              <button
                onClick={() => setSubscribeModalOpen(true)}
                type='submit'
                className={tw(
                  'text-sm',
                  'rounded-full border-2 border-white',
                  'ml-3 h-8 px-4',
                  'transition-colors hover:border-alert-grey hover:text-alert-grey'
                )}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Nav */}
          <div className='grid w-full grid-cols-2 minmd:ml-0 minmd:flex minmd:space-x-20 minlg:ml-20 minlg:justify-start minlg:pb-14'>
            {filterNulls(footerData)
              .slice(0, 3)
              .map((item, index) => {
                return (
                  <div
                    className={tw(
                      'mt-10 text-base minlg:mt-4',
                      index === 3 && 'col-start-2 minlg:col-auto minlg:row-auto'
                    )}
                    key={index}
                  >
                    <span className='text-lg font-medium'>{item.title}</span>
                    <div
                      className={tw(
                        'flex flex-col text-base minlg:grid minlg:auto-cols-max minlg:text-lg',
                        index === 1
                          ? 'grid-flow-col grid-cols-1 grid-rows-2 gap-2'
                          : 'grid-flow-col grid-cols-[min-content_2fr] grid-rows-2 gap-x-7 gap-y-2'
                      )}
                    >
                      {item.links?.map((item, index) => {
                        return (
                          <Link href={item.link} key={index} legacyBehavior>
                            {item.newTab ? (
                              <a
                                target='_blank'
                                rel='noreferrer noopener'
                                className={tw(
                                  'w-max cursor-pointer text-[#8B8B8B] hover:text-alert-grey',
                                  index === 0 ? 'mt-4 minlg:mt-4' : 'mt-3 minlg:mt-0',
                                  index === 2 && 'minlg:mt-4'
                                )}
                              >
                                {item.name}
                              </a>
                            ) : (
                              <a
                                className={tw(
                                  'w-max cursor-pointer text-[#8B8B8B] hover:text-alert-grey',
                                  index === 0 ? 'mt-4 minlg:mt-4' : 'mt-3 minlg:mt-0',
                                  index === 2 && 'minlg:mt-4'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div
          className={tw('flex flex-col justify-between minlg:flex-row', 'relative px-5 pb-16 minlg:pb-0 minlg:pl-0')}
        >
          <div
            className={tw(
              'w-full text-sm text-[#6A6A6A] minlg:pl-14 minxxl:text-lg',
              'order-1 minmd:flex minlg:-order-1'
            )}
          >
            <p>
              © {new Date().getFullYear()} NFT.com. <br className='minlg:hidden' /> All rights reserved
            </p>
            <span
              className={tw(
                'absolute bottom-0 right-10 minlg:relative',
                'block h-[175px] w-[125px] -skew-x-[20deg] bg-[#F9D54C] minlg:h-[100px]',
                'ml-auto mr-5 minlg:-mt-5 minlg:ml-24 minlg:mr-0'
              )}
            ></span>
          </div>
        </div>
      </div>

      <Transition appear show={subscribeModalOpen} as={Fragment}>
        <Dialog as='div' className='relative z-[105]' onClose={() => setSubscribeModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='relative min-h-[311px] w-full max-w-[547px] overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-xl transition-all'>
                  <X
                    onClick={() => {
                      setSubscribeModalOpen(false);
                    }}
                    className='absolute right-5 top-5 z-10 hover:cursor-pointer'
                    size={30}
                    color='black'
                    weight='fill'
                  />

                  <div className='relative flex h-full w-full flex-col px-10 pb-12 pt-10 minmd:flex-row'>
                    <div className='w-full'>
                      <h2 className='mb-8 mt-2 text-[32px] font-medium'>Get notifications</h2>
                      <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={tw(
                          'w-full min-w-full text-lg',
                          'w-full rounded-lg border-0 px-3 py-3 text-left font-medium',
                          'mb-10 bg-[#F8F8F8]'
                        )}
                        placeholder='Enter your email'
                        autoFocus={true}
                        spellCheck={false}
                        type='email'
                      />
                      <Button
                        stretch
                        onClick={async () => {
                          await subscribe(email)
                            .then(() => {
                              setEmail('');
                              setSubscribeModalOpen(false);
                              toast.success('Success! Please check your email to verify ownership.');
                            })
                            .catch(() => toast.error('Error while submitting email'));
                        }}
                        label='Subscribe'
                        type={ButtonType.PRIMARY}
                        size={ButtonSize.XLARGE}
                        disabled={!email.match(isValidEmail)}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </footer>
  );
};
