import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

export const Footer = () => {
  const router = useRouter();
  const { isDarkMode } = useUser();
  const { data: account } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { profileTokens } = useMyNftProfileTokens();

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
          name: 'Announcements',
          onClick: () => {
            window.open('https://announcements.nft.com', '_open');
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
    <div className="flex md:flex-col relative md:content-between py-12 bg-[#F8F8F8]">
      <div className={tw(
        'w-2/5 md:w-full flex-shrink-0 flex',
        'items-start justify-between flex-col text-base pl-24 md:pl-0 md:items-center'
      )}>
        <Link href="/">
          <div className={tw(
            'text-primary-txt',
            'font-hero-heading1 flex items-center md:mb-0 mb-8',
          )}>
            <div className={tw('h-10 w-10 mr-1 relative')}>
              <Image
                src={ 'https://cdn.nft.com/hero_corner_dark.svg' }
                alt="nft.com"
                layout='fill'
                objectFit='cover'
              />
            </div>
            <span>NFT.COM</span>
          </div>
        </Link>
        <div className="md:hidden block text-primary-txt h-1/5 sm:mt-3">
          © {new Date().getFullYear()} NFT.com. All rights reserved
        </div>
      </div>
      <div className="w-3/5 md:w-full grid grid-cols-4 md:grid-cols-2">
        {filterNulls(footerData).map((item, index) => {
          return (
            <div className="text-base md:mt-12 sm:pl-[30%] md:pl-[35%]" key={index}>
              <span className="font-medium text-primary-txt">
                <b>{item.title}</b>
              </span>
              <div className='flex flex-col'>
                {item.links?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="mt-4 text-primary-txt font-normal list-none cursor-pointer hover:font-bold"
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
      <div className="md:block hidden mx-auto align-items text-grey-txt h-1/5 md:mt-10">
        © {new Date().getFullYear()} NFT.com. All rights reserved
      </div>
    </div>
  );
};