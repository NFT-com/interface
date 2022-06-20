import { chains, wagmiClient } from  '../../pages/_app';
import { rainbowDark } from '../../styles/RainbowKitThemes';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

export const ComponentWrapper = ({ children }) => {
  return (
  <WagmiConfig client={wagmiClient}>
  <RainbowKitProvider
    appInfo={{
      appName: 'NFT.com',
      learnMoreUrl: 'https://docs.nft.com/',
    }}
    theme={rainbowDark}
    chains={chains}>
      {children}
  </RainbowKitProvider>
  </WagmiConfig>
  );
};
