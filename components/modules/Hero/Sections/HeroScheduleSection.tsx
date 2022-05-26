import useCounterUp from 'hooks/useCounterUp';
import useOnViewPort from 'hooks/useOnViewPort';
import { getAuctionCalendarLink } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import keyImage from 'public/hero-key--static.png';
import { useRef } from 'react';

export default function HeroScheduleSection() {
  const ref = useRef(null);
  const [isVisible] = useOnViewPort(ref, 0.2);
  const whitelistCounter = useCounterUp(3000, isVisible);
  const generalSaleCounter = useCounterUp(6750, isVisible);
  const reservedCounter = useCounterUp(250, isVisible);

  const auctionEnded = Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END) <= new Date().getTime();
  const whitelistClosed = 1650970800000 <= new Date().getTime();

  return (
    <div className="text-always-white relative" style={{
      background: `'linear-gradient(rgba(0,0,0,0.65), rgba(0, 0, 0, 1), rgba(0,0,0,1)), 
      url("https://cdn.nft.com/grid.png")'`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* <Image
        className={tw(
          'opacity-40',
          'absolute -top-12 left-0 w-full transform scale-90 z-10 deprecated_minsm:w-1/4',
          'deprecated_minsm:scale-125 deprecated_minsm:left-1/2 deprecated_minsm:-translate-x-1/2 deprecated_minmd:w-[23%] deprecated_minxl:scale-90',
        )}
        src={keyImage}
        alt=""
      /> */}
      <div
        className={tw(
          'deprecated_minmd:flex deprecated_minmd:justify-between deprecated_minmd:items-start',
          'deprecated_minmd:w-11/12 deprecated_minmd:mx-auto deprecated_minlg:w-9/12 mt-24'
        )}
      >
        <div className={tw('flex w-full items-start justify-center deprecated_minsm:max-w-[34rem]',
          'text-always-white relative z-20 deprecated_minmd:w-1/2 px-10 deprecated_minlg:px-20 deprecated_minlg:pb-20',
        )}
        id="scheduleSection"
        >
          <div
            className={tw(
              'flex flex-col justify-center pb-10'
            )}
          >
            <div className={tw(
              'text-3xl font-medium',
              'text-hero-pink font-hero-heading1 tracking-wider leading-tight'
            )}>
              GENESIS KEY AUCTION
            </div>
            <div className="text-xl font-bold">
              {
                auctionEnded ?
                  'How the Genesis Key Blind Auction Worked' :
                  'How to Prepare for the Genesis Key Blind Auction'
              }
            </div>
            <span className="mt-5 mb-4 font-bold">Steps:</span>
            <ol className="text-lg font-medium text-grey-txt font-rubik ml-4" type="1">
              <li
                className='list-decimal'
                onClick={whitelistClosed
                  ? null
                  : () => {
                    window.open(
                      'https://whitelist.nft.com',
                      '_blank'
                    );
                  }}
              >
                <span
                  className={tw(
                    whitelistClosed ? '' : 'text-link hover:underline cursor-pointer '
                  )}>
                    Join the Whitelist
                </span>
              </li>
              <li className='list-decimal'>
                <span
                  onClick={auctionEnded
                    ? null
                    : () => {
                      window.open(
                        getAuctionCalendarLink(),
                        '_blank'
                      );
                    }}
                  className={tw(
                    auctionEnded ? '' : 'text-link hover:underline cursor-pointer '
                  )}
                >Save the Date</span>
              </li>
              <li className='list-decimal'>
                <span
                  className={tw(
                    auctionEnded ? '' : 'text-link hover:underline cursor-pointer '
                  )}
                  onClick={auctionEnded
                    ? null
                    : () => {
                      window.open(
                        'https://support.nft.com/hc/en-us/articles/5399571972123-I-registered-for-the-Blind-Auction-what-s-next-',
                        '_blank'
                      );
                    }}
                >
                  Fund Your Wallet
                </span>
              </li>
            </ol>
            <span className="mt-5 mb-4 font-bold">Details:</span>
            <ul className='text-lg font-medium text-grey-txt font-rubik ml-4'>
              <li>The Blind Auction starts<br /> April 26th, 2022 at 7PM EDT.</li>
              <li className='mt-3'>One bid per person. No one can see your bid. You can{'\''}t see others{'\''} bids.</li>
              <li className='mt-3'>
                <div className='flex flex-col'>
                  <span className='mt-2'>
                    The top 3,000 bidders will be eligible to mint their key {' '}
                    <span className="font-bold">at the price of the 3,001st bid.</span><br/>
                  </span>
                </div>
              </li>
              <li className='mt-3'>This means bidders in the top 3,000 will pay less than or equal to what they bid. This will be the lowest available mint price.</li>
              <li className='mt-3'>After the Blind Auction, the remaining 6,750 keys will be sold in the Public Sale at a price set by the median of the 3,000 winning bids (in other words: the Public Sale will open at a mint price of around the 1,500th bid.)</li>
              <li className='mt-3'>The Blind Auction mint price will be LOWER than the Public Sale.</li>
              <li className='mt-3'><span
                onClick={() => {
                  window.open(
                    'https://discord.gg/nftdotcom',
                    '_blank',
                  );
                }}
                className='hover:underline text-link cursor-pointer'
              >Join the Discord</span>{' '}for more details.</li>
            </ul>
          </div>
        </div>
        <div className={tw(
          'flex w-full items-start justify-center  pl-10',
          'text-always-white relative z-20 deprecated_minmd:w-1/2',
          'deprecated_minlg:pl-24 deprecated_minlg:pb-20'
        )}>
          <div ref={ref} className="flex flex-col justify-center w-full pb-10 deprecated_minmd:pl-8 ">
            <div className={tw(
              'text-3xl font-medium',
              'text-hero-pink font-hero-heading1 tracking-wider leading-tight'
            )}>
              GENESIS KEY DISTRIBUTION
            </div>
            <span className='text-4xl font-bold mt-10'>
              {whitelistCounter.toLocaleString()}
            </span>
            <span className='text-grey-txt text-sm flex items-end mb-2'>
              keys available for
            </span>
            <div className="text-xl font-bold">
              Whitelisted Blind Auction
            </div>
            <ul className='text-lg font-medium text-grey-txt font-rubik ml-4 mt-2'>
              <li>Mint price is the 3,001st bid.</li>
              <li>Mint price for Blind auction is always lower than the Public sale.</li>
            </ul>
            <span className='text-4xl font-bold mt-10'>
              {generalSaleCounter.toLocaleString()}
            </span>
            <span className='text-grey-txt text-sm flex items-end mb-2'>
              keys available for
            </span>
            <div className="text-xl font-bold">
              Public Sale
            </div>
            <ul className='text-lg font-medium text-grey-txt font-rubik ml-4 mt-2'>
              <li>The Public sale will open at a mint price of around the 1,500th bid.</li>
              <li>May 2nd, 2022 at 7PM EDT.</li>
            </ul>
            <span className='text-4xl font-bold mt-10'>
              {reservedCounter.toLocaleString()}
            </span>
            <span className='text-grey-txt text-sm flex items-end mb-2'>
                keys reserved for
            </span>
            <div className="text-xl font-bold">
              Team, Artists, {'&'} Partners
            </div>
            <span className={tw(
              'z-40 mb-4 mt-7 w-[90%] deprecated_minlg:w-[80%]',
              'text-sm font-medium text-grey-txt'
            )}>
              *All Genesis Key rarity is random including
              distribution to team, artists, and partners.
            </span>
            <span className={tw(
              'z-40 mb-4 w-[90%] deprecated_minlg:w-[80%]',
              'text-sm font-medium text-grey-txt'
            )}>
              **Utility of Genesis Keys are all equal, regardless of traits.
            </span>
          </div>
        </div>
      </div>
      <div className={tw(
        'flex w-full items-center justify-center flex-col px-8',
        'deprecated_minxs:px-0 deprecated_minmd:flex-row text-always-white mb-8',
      )}
      >
        <p className={tw(
          'z-40 text-center w-[85%] deprecated_minlg:w-[35rem]',
          'legaltext font-medium text-grey-txt'
        )}>
            We reserve the right to modify the terms of whitelist
            eligibility and the terms of any auction or sale. We will grant
            community members access to the whitelist in our sole discretion.
            Whitelist access does not guarantee ability to purchase a Genesis Key,
            as supplies may be limited.
        </p>
      </div>
    </div>
  );
}
