import { Modal } from 'components/elements/Modal';
import { tw } from 'utils/tw';

import { useState } from 'react';
import { Info } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

export function GenesiskeyEducationModal() {
  const {
    alwaysBlack,
    link
  } = useThemeColors();

  const [informationModalVisible, setInformationModalVisible] = useState(false);

  return (
    <>
      <div
        className={tw(
          'text-base deprecated_sm:text-xs flex flex-row items-center mt-2.5 hover:underline cursor-pointer'
        )}
        style={{ color: link }}
        onClick={() => {
          setInformationModalVisible(true);
        }}
      >
        <Info
          size="20"
          className="mr-4 deprecated_sm:mr-2"
          fill={link}
          color={alwaysBlack}
        />
          Learn about this auction
      </div>
      <Modal
        visible={informationModalVisible}
        loading={false}
        title={{ topLine: 'ABOUT', bottomLine: 'THIS AUCTION' }}
        onClose={() => {
          setInformationModalVisible(false);
        }}
        longModal
      >
        <div className='flex flex-col max-w-xl items-center w-full'>
          <span className='text-lg text-white text-left mb-3 w-full font-black'>
            How the Auction Works
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            Only whitelisted members can participate in the Blind Auction.{' '}
            You can register for the Blind Auction by heading over to&nbsp;
            <a href='https://whitelist.nft.com'
              className='cursor-pointer decoration-white underline'>
              whitelist.nft.com
            </a>.{' '}
            <span
              className="text-link hover:underline cursor-pointer"
              onClick={() => {
                window.open(
                  'https://nftcom-prod-assets.s3.amazonaws.com/nft_com_whitelist_blind_auction_terms.pdf',
                  '_blank'
                );
              }}
            >
              Click here to view Auction Rules.
            </span>
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            The Blind Auction will begin on 4/26 at 7PM EDT.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
          The Blind Auction will be a gated auction via whitelist for 3,000 Genesis Keys. The auction will last for 48 hours and conclude on April 28th at 7pm EDT.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            The Blind Auction is structured as a multi-lot, second price auction. {' '}
            The top 3,000 bids placed by ETH value will win a Genesis Key, and all {' '}
            winners will pay the 3,001st bid (the first losing bid).&nbsp;
            <span className='decoration-white underline'>All winners will
              pay the same price for their Genesis Key
            </span>.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
          24 hours after the auction ends (April 29th at 7pm EDT), you can return to NFT.com to check if you{'\''}ve won a Genesis Key, and to begin the claim process. For safety, we ask that our users only go only to the NFT.com site.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            If you have not won a key at this time, don{'\''}t worry! The remaining 6,750{' '}
            Genesis Keys will be made available during the Public Sale taking place{' '}
            a few days after the Blind Auction.
          </span>
          <span className='text-base text-white text-left mb-3 w-full font-black'>
            The price of a Genesis Key in the Public Sale will be determined by the median{' '}
            of the top 3,000 bids in the Blind Auction.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            No ETH will be removed from your wallet until you win AND come to NFT.com to{' '}
            claim your Genesis Key.
          </span>
          <span className='text-base text-white text-left mb-3 w-full'>
            When you claim your Genesis Key, your key will be minted and revealed!{' '}
            Once minted, you will then be taken to the Profile minting{' '}
            portal where you can choose your profile names and mint your 2 NFT.com¨{' '}
            Profile NFTs!  (e.g. NFT.com/you)
          </span>
          <span className='text-base text-white text-left mb-3 w-full italic'>
            *If an currentAddress does not maintain sufficient ETH in their wallet for their bid,{' '}
            their bid will be discarded and the next highest bid will be selected.
          </span>
          <span className='text-base text-white text-left mb-3 w-full italic'>
            *All bids that do not win will be invalidated and the bidder will not be charged.{' '}
            The auction is expected to last for 48 hours.
          </span>
          <span className='text-base text-white text-left mb-3 w-full italic'>
            *Please read the{' '}
            <span
              className="text-link hover:underline cursor-pointer"
              onClick={() => {
                window.open(
                  'https://nftcom-prod-assets.s3.amazonaws.com/nft_com_whitelist_blind_auction_terms.pdf',
                  '_blank'
                );
              }}
            >Auction Rules</span>
            {' '}carefully before participating. By continuing{' '}
            to the auction you agree to our {' '}
            <span
              className="text-link hover:underline cursor-pointer"
              onClick={() => {
                window.open(
                  'https://cdn.nft.com/nft_com_terms_of_service.pdf',
                  '_blank'
                );
              }}
            >
            Terms of Service.
            </span>
          </span>
        </div>
      </Modal>
    </>
  );
}