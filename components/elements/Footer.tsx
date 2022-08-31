import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from 'public/LogoFooterWhite.svg';
import { useAccount } from 'wagmi';

export const Footer = () => {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { profileTokens } = useMyNftProfileTokens();

  const footerData = [
    {
      title: 'Learn',
      links: filterNulls([
        {
          name: 'Gallery',
          onClick: () => {
            router.push('/app/gallery');
          },
        },
        !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(profileTokens)
          ? {
            name: 'Vault',
            onClick: () => {
              router.push('/app/vault');
            },
            stylize: true,
          }
          : null,
        {
          name: 'Docs',
          onClick: () => {
            window.open('https://docs.nft.com', '_open');
          },
        },
        {
          name: 'Blog',
          onClick: () => {
            router.push('/articles');
          },
        },
        {
          name: 'What is an NFT?',
          onClick: () => {
            router.push('/articles/what-is-an-nft');
          }
        },
      ])
    },
    {
      title: 'Resources',
      links: [
        {
          name: 'Support',
          onClick: () => {
            window.open('https://support.nft.com', '_open');
          },
        },
        {
          name: 'Careers',
          onClick: () => {
            window.open(
              'https://jobs.lever.co/Nft.com',
              '_open'
            );
          },
        },
        {
          name: 'Business Inquiries',
          onClick: () => {
            window.open(
              'mailto:info@nft.com',
              '_open'
            );
          },
        },
      ]
    },
    {
      title: 'Policies',
      links: [
        {
          name: 'Terms of Service',
          onClick: () => {
            window.open(
              'https://cdn.nft.com/nft_com_terms_of_service.pdf',
              '_open'
            );
          },
        },
        {
          name: 'Privacy Policy',
          onClick: () => {
            window.open(
              'https://cdn.nft.com/nft_com_privacy_policy.pdf',
              '_open'
            );
          },
        },
        {
          name: 'Bug Bounty',
          onClick: () => {
            window.location.href='mailto:bugbounty@nft.com?subject=Bug Bounty for NFT.com ' + new Date().toLocaleDateString();
          },
        },
      ]
    },
    {
      title: 'Social',
      links: [
        {
          name: 'Discord',
          onClick: () => {
            window.open(
              'https://discord.gg/nftdotcom',
              '_open'
            );
          },
        },
        {
          name: 'Twitter',
          onClick: () => {
            window.open(
              'https://twitter.com/nftcomofficial',
              '_open'
            );
          },
        },
      ]
    },
  ];

  return (
    <div id="FooterContainer" className='bg-[#222222] pb-6 font-grotesk text-primary-txt-dk'>
      <div className={tw(
        'flex flex-col minlg:flex-row relative content-between minlg:content-center pt-12'
      )}>
        <div className={tw(
          'minlg:w-max w-full flex-shrink-0 flex',
          'items-start justify-between flex-col text-base minlg:pl-5 pl-0 items-center minlg:items-start'
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
                      <span
                        key={index}
                        className="mt-4 font-normal list-none cursor-pointer hover:font-bold"
                        onClick={item.onClick}
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
                      </span>
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
};