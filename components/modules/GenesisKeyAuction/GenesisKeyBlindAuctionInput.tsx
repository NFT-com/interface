import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { NftType } from 'graphql/generated/types';
import { useCancelBidMutation } from 'graphql/hooks/useCancelBidMutation';
import { useCreateBidMutation } from 'graphql/hooks/useCreateBidMutation';
import { useMyGenesisKeyBid } from 'graphql/hooks/useMyGenesisKeyBid';
import { useEthBalance } from 'hooks/balances/useEthBalance';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { GenesisFooter } from './GenesisFooter';
import { GenesiskeyEducationModal } from './GenesisKeyEducationModal';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import fromExponential from 'from-exponential';
import Image from 'next/image';
import truststamps from 'public/trust_stamps.png';
import { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';

export function GenesisKeyBlindAuctionInput() {
  const {
    alwaysBlack,
  } = useThemeColors();
  const ethPriceUSD = useEthPriceUSD();
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const userEthBalance = useEthBalance(account?.address);
  const { createBid } = useCreateBidMutation();
  const { cancelBid } = useCancelBidMutation();
  const { useToggleAddFundsDialog } = useAddFundsDialog();

  const { bid: myGenesisKeyBid, mutate: mutateMyGenesisKeyBid } = useMyGenesisKeyBid();

  const [currentBidDraft, setCurrentBidDraft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const truncateEthForDisplay = (eth: string) => {
    return eth.indexOf('.') > -1 ? eth.substring(0, eth.indexOf('.') + 5) : eth;
  };

  const enoughETH = BigNumber.from(userEthBalance?.balance?.balance ?? 0)
    .sub(BigNumber.from(ethers.utils.parseEther(currentBidDraft ?? '0')))
    .sub(myGenesisKeyBid?.price ?? BigNumber.from(0))
    .gte(ethers.utils.parseEther('0'));

  const buttonLabel = useCallback(() => {
    if (!enoughETH) {
      return 'Buy ETH';
    } else {
      return myGenesisKeyBid ? 'Increase Bid' : 'Submit Bid';
    }
  }, [myGenesisKeyBid, enoughETH]);

  const remainingEth = BigNumber.from(userEthBalance?.balance?.balance ?? 0)
    .sub(myGenesisKeyBid?.price ?? BigNumber.from(0));
  
  return (
    <div
      className={tw(
        'mt-7 deprecated_sm:mt-4 mx-4 text-center',
        'flex flex-col items-center dark',
        'text-primary-txt-dk'
      )}
    >
      
      <span className="text-lg">Only 3,000 Genesis Keys are available in this Auction.</span>
      <div
        className={tw(
          'flex flex-col items-center rounded-xl border deprecated_sm:border-none mt-7',
          'px-10 pb-5 drop-shadow w-[600px] deprecated_sm:w-full',
          'bg-always-black deprecated_sm:bg-transparent border-accent-border-dk',
          `${myGenesisKeyBid ? 'pb-8 mindeprecated_sm:pb-6':'pb-16'}`
        )}
      >
        <div className={tw('mt-8 mb-4 text-xl')}>
          Your current bid: {ethers.utils.formatEther(myGenesisKeyBid?.price ?? 0)} ETH
          ($
          {
            (Number(ethers.utils.formatEther(myGenesisKeyBid?.price ?? 0)) * ethPriceUSD)
              .toFixed(2)
          })
        </div>
        <div className={tw('mb-4 text-base flex items-center')}>
          ETH you can bid: {
            !userEthBalance ?
              <span className='ml-2'><Loader /></span> :
              truncateEthForDisplay(ethers.utils.formatEther(remainingEth)) + ' ETH / ' +
              truncateEthForDisplay(ethers.utils.formatEther(BigNumber.from(userEthBalance?.balance?.balance ?? 0))) +
              ' ETH'
          }
        </div>
        <input
          type="text"
          className={tw(
            'text-lg min-w-0 text-always-black border-2',
            'text-left px-3 py-3 w-full rounded-xl font-dm-mono',
            !enoughETH ? 'border-red-500' : 'border-transparent'
          )}
          placeholder="Ex: 2.5 ETH"
          autoFocus={true}
          value={currentBidDraft ?? ''}
          onChange={e => {
            const validReg = /^[0-9.]*$/;
            if (e.target.value.split('').filter(char => char === '.').length > 1) {
              // prevent multiple decimals
              e.preventDefault();
            } else if (isNullOrEmpty(e.target.value)) {
              // clear state when the input is deleted
              setCurrentBidDraft(null);
            } else if (
              validReg.test(e.target.value.toLowerCase()) &&
              (e.target.value.length - e.target.value.indexOf('.')) <= 5
            ) {
              // test input against the regex, and only allow 4 characters past the decimal
              const paddedValue = e.target.value === '.' ? '0.' : e.target.value;
              setCurrentBidDraft(paddedValue);
            } else {
              e.preventDefault();
            }
          }}
        />
        <div className={tw('mt-8 flex w-full flex-col items-center')}>
          <div className={tw(
            'uppercase font-hero-heading1 font-extrabold tracking-wide',
            submitting ? 'opacity-50' : ''
          )}>
            <Button
              type={ButtonType.PRIMARY}
              color={alwaysBlack}
              loading={submitting}
              loadingText="Please complete this action in your wallet."
              stretch
              label={buttonLabel()}
              size={(submitting && isMobile) && ButtonSize.SMALL}
              onClick={async () => {
                if (submitting ||
                  isNullOrEmpty(currentBidDraft) ||
                  BigNumber.from(ethers.utils.parseEther(currentBidDraft ?? '0'))
                    .eq(BigNumber.from(0))
                ) {
                  return;
                }
                if (!enoughETH) {
                  useToggleAddFundsDialog();
                } else {
                  setSubmitting(true);
                  if (isNullOrEmpty(currentBidDraft)) {
                    return;
                  } else {
                    const bigNumberVal =
                      BigNumber.from(ethers.utils.parseEther(currentBidDraft ?? '0'));
                    const bigNumberExisting = BigNumber.from(myGenesisKeyBid?.price ?? 0);
                    const totalTokens: BigNumber = bigNumberExisting?._hex
                      ? bigNumberVal.add(bigNumberExisting)
                      : bigNumberVal;
                    const message = {
                      _ethTokens: fromExponential(Number(totalTokens)).toString(),
                      _owner: account?.address.toString(),
                    };
                    const data = {
                      types: {
                        EIP712Domain: [
                          { name: 'name', type: 'string' },
                          { name: 'version', type: 'string' },
                          { name: 'chainId', type: 'uint256' },
                          { name: 'verifyingContract', type: 'address' },
                        ],
                        GenesisBid: [
                          { name: '_ethTokens', type: 'uint256' },
                          { name: '_owner', type: 'address' },
                        ],
                      },
                      domain: {
                        name: 'NFT.com Genesis Key',
                        version: '1',
                        chainId: activeChain?.id,
                        verifyingContract: getAddress('genesisKey', activeChain?.id),
                      },
                      primaryType: 'GenesisBid',
                      value: message,
                    };
                    await signTypedDataAsync(data)
                      .then(splitSignature)
                      .then(async signature => {
                        const result = await createBid({
                          nftType: NftType.GenesisKey,
                          price: fromExponential(Number(totalTokens)),
                          signature: {
                            v: signature.v,
                            s: signature.s,
                            r: signature.r
                          },
                          wallet: {
                            address: account?.address.toString(),
                            chainId: String(activeChain?.id),
                            network: 'ethereum',
                          },
                        });
                        mutateMyGenesisKeyBid();
                        if (result) {
                          setCurrentBidDraft(null);
                        }
                        setSubmitting(false);
                      })
                      .catch(() => {
                        setSubmitting(false);
                      });
                  }
                }
              }}
            />
          </div>
          {myGenesisKeyBid &&
            <div
              className={tw(
                'text-base deprecated_sm:text-xs font-semibold',
                'flex flex-row items-center my-5 hover:underline cursor-pointer',
                `${ cancelling ? 'cursor-progress' : 'cursor-pointer' }`,
                `${ cancelling ? 'text-[#343A50]' : 'text-action-primary' }`
              )}
              onClick={async () => {
                if (!cancelling) {
                  setCancelling(true);
                  const result = await cancelBid(myGenesisKeyBid?.id);
                  if (result) {
                    mutateMyGenesisKeyBid();
                  }
                  setCancelling(false);
                }
              }}
            >
              Cancel Bid
            </div>}
        </div>
        <GenesiskeyEducationModal />
      </div>
      <div className='flex justify-center w-screen deprecated_sm:px-4'>
        <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/>
      </div>
      <div className='flex justify-end deprecated_sm:justify-center items-center deprecated_sm:relative bottom-0'>
        <GenesisFooter />
      </div>
    </div>
  );
}