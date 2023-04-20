import { ExternalLink as LinkIcon } from 'react-feather';
import { useAccount, useNetwork } from 'wagmi';

import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { Maybe } from 'graphql/generated/types';
import { getEtherscanLink, shortenAddress } from 'utils/helpers';

import { ExternalLink } from 'styles/theme';
import { useThemeColors } from 'styles/theme/useThemeColors';

import ClientOnly from './ClientOnly';

export interface ConnectedAddressProps {
  ensName: Maybe<string>;
  color: 'pink' | 'link';
}

export function ConnectedAddress(props: ConnectedAddressProps) {
  const { ensName } = props;
  const { secondaryText, pink, link } = useThemeColors();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className='flex w-full items-center'>
      <div className='mr-4 flex shrink-0'>
        <LoggedInIdenticon round />
      </div>
      <div className='flex w-full items-center justify-between'>
        <div
          className='text-lg'
          style={{
            color: secondaryText
          }}
        >
          <ClientOnly>
            <ExternalLink href={getEtherscanLink(chain?.id, ensName ?? currentAddress, 'address')}>
              {currentAddress && (
                <div
                  className='flex justify-between font-dm-mono'
                  style={{
                    color: props.color === 'pink' ? pink : link
                  }}
                >
                  {ensName ?? shortenAddress(currentAddress)}
                  <LinkIcon size={20} className='ml-2' />
                </div>
              )}
            </ExternalLink>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
