import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Link from 'next/link';
import { useRouter } from 'next/router';
import LightNavLogo from 'public/hero_corner.svg';
import NavLogo from 'public/hero_corner_dark.svg';
import { useAccount } from 'wagmi';

export const Footer = () => {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { profileTokens } = useMyNftProfileTokens();
  const { user } = useUser();

  const footerData = [
    {
      title: 'Learn',
      links: filterNulls([
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
          name: 'Gallery',
          onClick: () => {
            router.push('/app/gallery');
          },
        },
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
    <div id="FooterContainer" className={tw(
      'flex flex-col minlg:flex-row relative content-between minlg:content-center py-12 bg-footer-bg dark:bg-footer-bg-dk',
      'dark:text-primary-txt-dk text-primary-txt'
    )}>
      <div className={tw(
        'minlg:w-2/5 w-full flex-shrink-0 flex',
        'items-start justify-between flex-col text-base minlg:pl-24 pl-0 items-center minlg:items-start'
      )}>
        <Link href="/">
          <div className={tw(
            'font-hero-heading1 flex items-center mb-0 minlg:mb-8',
          )}>
            <Link href='/' passHref>
              <div>
                {
                  user.isDarkMode ?
                    <LightNavLogo className='h-8 w-8 justify-start' /> :
                    <NavLogo className='h-8 w-8 justify-start' />
                }
              </div>
            </Link>
          </div>
        </Link>
        <div className="hidden minlg:block h-1/5 mt-3 minmd:mt-0">
          © {new Date().getFullYear()} NFT.com. All rights reserved
        </div>
      </div>
      <div className="minlg:w-3/5 w-full grid minlg:grid-cols-4 grid-cols-2">
        {filterNulls(footerData).map((item, index) => {
          return (
            <div className="text-base mt-12 minlg:mt-0 pl-[30%] minmd:pl-[35%] minlg:pl-0" key={index}>
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
      <div className="block minlg:hidden mx-auto align-items text-grey-txt h-1/5 mt-10 minlg:mt-0">
        © {new Date().getFullYear()} NFT.com. All rights reserved
      </div>
    </div>
  );
};