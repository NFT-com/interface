import { tw } from 'utils/tw';

export interface GenesisFooterProps {
  black?: boolean;
}

export const GenesisFooter = (props: GenesisFooterProps) => {
  return (
    <div className={tw(
      'flex deprecated_sm:flex-col deprecated_sm:content-between mx-6 my-12 items-center justify-end',
      props.black ? 'text-black' : 'text-footer-txt'
    )}>
      <div className="h-1/5 deprecated_sm:mt-3 mx-4">
          © {new Date().getFullYear()} NFT.com. All rights reserved
      </div>
      |
      <span
        className='cursor-pointer hover:underline mx-4'
        onClick={() => {
          window.open(
            'https://cdn.nft.com/nft_com_terms_of_service.pdf',
            '_open'
          );
        }}
      >
        Terms of Service
      </span>
      |
      <span
        className='cursor-pointer hover:underline mx-4'
        onClick={() => {
          window.open(
            'https://cdn.nft.com/nft_com_privacy_policy.pdf',
            '_open'
          );
        }}
      >
        Privacy Policy
      </span>
      |
      <span
        className='cursor-pointer hover:underline mx-4'
        onClick={() => {
          window.open(
            'https://support.nft.com',
            '_blank'
          );
        }}
      >
        FAQ
      </span>
      |
      <span
        className='cursor-pointer hover:underline mx-4'
        onClick={() => {
          window.location.href='mailto:bugbounty@nft.com?subject=Bug Bounty for NFT.com ' + new Date().toLocaleDateString();
        }}
      >
        Bug Bounty
      </span>
    </div>
  );
};