import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useAccount, useSigner } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { KeyClaimVideo } from 'components/modules/GenesisKeyAuction/KeyClaimVideo';
import { useEthBalance } from 'hooks/balances/useEthBalance';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useKeyBackground } from 'hooks/state/useKeyBackground';
import { useKeyVideo } from 'hooks/state/useKeyVideo';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { processIPFSURL } from 'utils/ipfs';
import { tw } from 'utils/tw';

import truststamps from 'public/trust_stamps.webp';

import { AuctionType } from './GenesisKeyAuction';
import { GenesisKeyWinnerView } from './GenesisKeyWinnerView';

export interface GenesisKeyPublicSaleProps {
  currentPrice: BigNumber;
}

export function GenesisKeyPublicSale(props: GenesisKeyPublicSaleProps) {
  const ethPriceUSD = useEthPriceUSD();
  const { genesisKey } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const userEthBalance = useEthBalance(currentAddress);
  const { useKeyVideoToggle: playKeyVideo } = useKeyVideo();
  const { setKeyBackground } = useKeyBackground();

  const { totalRemaining, mutate: mutateTotalRemaining } = useTotalGKPublicRemaining();

  const [mintSuccess, setMintSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const enoughETH = BigNumber.from(BigNumber.from(userEthBalance?.balance?.balance ?? 0)).gte(props.currentPrice);
  const { data: ownedGenesisKeyTokens, mutate: mutateOwnedGKs } = useOwnedGenesisKeyTokens(currentAddress);
  const latestGKMinted =
    ownedGenesisKeyTokens?.length > 0
      ? Math.max(
          ...(ownedGenesisKeyTokens?.map(token => BigNumber.from(token?.id?.tokenId ?? 0).toNumber()) as number[])
        ) // returns -Infinity if array is empty.
      : null;

  const genesisKeyMetadata = useGenesisKeyMetadata(latestGKMinted != null ? BigNumber.from(latestGKMinted) : null);

  const genesisKeyImage = processIPFSURL(
    isMobile ? genesisKeyMetadata?.metadata?.image : genesisKeyMetadata?.metadata?.animation_url
  );

  useEffect(() => {
    if (genesisKeyImage && genesisKeyMetadata) {
      const bgColorAttribute = genesisKeyMetadata?.metadata?.attributes?.find(
        attr => attr?.trait_type === 'Background'
      );
      setKeyBackground(genesisKeyImage, bgColorAttribute?.value === 'Dark' ? 'black' : 'white');
    }
  }, [genesisKeyImage, genesisKeyMetadata, setKeyBackground]);

  return (
    <div className='flex h-[90%] flex-col items-center text-primary-txt-dk'>
      <KeyClaimVideo />
      {mintSuccess ? (
        <GenesisKeyWinnerView
          liveAuction={AuctionType.Public}
          ownedTokenID={latestGKMinted}
          claimData={null}
          insiderClaimData={null}
          onBack={() => {
            setMintSuccess(false);
          }}
        />
      ) : (
        <>
          <div className='flex flex-row p-10'>
            <div className='flex flex-col items-center'>
              <div
                className={tw(
                  'text-2xl minmd:text-5xl minxl:text-6xl',
                  'font-hero-heading1 z-30 text-center font-normal text-footer-txt',
                  'max-w-[30rem] minmd:max-w-[43rem] minxl:max-w-[100rem]'
                )}
                style={{
                  textShadow: '0px 4px 4px rgba(0,0,0,0.9)'
                }}
              >
                <div>
                  <span className={totalRemaining?.gt(100) ? 'text-always-white' : 'text-hero-pink'}>
                    {Number(totalRemaining?.toString()).toLocaleString()}
                  </span>
                </div>
              </div>
              <span className='mt-2 text-lg'>Genesis Keys Available</span>
            </div>
          </div>
          <div
            className={tw(
              'flex flex-col items-center rounded-xl border-none minmd:border ',
              'mx-4 w-3/5 px-10 pb-12 text-center drop-shadow',
              'border-accent-border-dk bg-transparent minmd:bg-always-black'
            )}
          >
            {totalRemaining?.toString() !== '0' ? (
              <>
                <div className={tw('mb-10 mt-14 text-xl', isMobile ? 'text-center' : '')}>
                  Genesis Key Price: {ethers.utils.formatEther(props.currentPrice)} ETH ($
                  {(ethPriceUSD * Number(ethers.utils.formatEther(props.currentPrice ?? 0).slice(0, 5))).toFixed(2)})
                </div>
                <div
                  className={tw(
                    'font-hero-heading1 flex w-full flex-col items-center justify-center text-center uppercase',
                    submitting ? 'opacity-50' : ''
                  )}
                >
                  <Button
                    size={ButtonSize.LARGE}
                    type={ButtonType.PRIMARY}
                    loading={submitting}
                    loadingText={'Minting...'}
                    label={error ? 'Transaction Failed. Try Again' : !enoughETH ? 'Not Enough ETH' : 'Buy a key'}
                    onClick={async () => {
                      if (submitting) {
                        return;
                      }
                      if (error) {
                        setError(false);
                      }
                      if (!enoughETH) {
                        window.open(
                          `https://pay.sendwyre.com/?sourceCurrency=USD&destCurrency=ETH&dest=${currentAddress}`,
                          '_blank'
                        );
                      }

                      try {
                        const result = await genesisKey.connect(signer).publicBuyKey({
                          gasLimit: 250000,
                          value: props.currentPrice
                        });

                        setSubmitting(true);

                        if (result) {
                          await result.wait(1);
                          mutateOwnedGKs();
                          mutateTotalRemaining();
                          if (!isMobile) {
                            playKeyVideo();
                          }
                          setMintSuccess(true);
                        }
                        setSubmitting(false);
                      } catch (err) {
                        setSubmitting(false);
                        setError(true);
                      }
                    }}
                  />
                  <span
                    className={tw('font-rubik text-base text-primary-txt-dk', 'mt-8 max-w-lg text-center normal-case')}
                  >
                    By clicking Buy a Key, I have read, understood, and agree to the{' '}
                    <span
                      onClick={() => {
                        window.open('https://cdn.nft.com/nft_com_terms_of_service.pdf', '_open');
                      }}
                      className='cursor-pointer text-link hover:underline'
                    >
                      Terms of Service.
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className={tw('mb-8 mt-14 flex flex-col text-center text-xl')}>
                  <span>Sold Out</span>
                  <span className='mt-2 text-base text-footer-txt'>
                    Thank you all who participated. Learn more at NFT.com.
                  </span>
                </div>
                <div className='font-hero-heading1'>
                  <Button
                    size={ButtonSize.LARGE}
                    type={ButtonType.PRIMARY}
                    stretch
                    label={'VISIT NFT.COM'}
                    onClick={async () => null}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
      {!mintSuccess && (
        <div className='z-[20] mt-12 flex justify-center px-4 minmd:mt-40 minmd:px-0 '>
          <Image src={truststamps} alt='quant stamp' className='mb-4' />
        </div>
      )}
    </div>
  );
}
