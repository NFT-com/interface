import { DropdownPicker } from 'components/elements/DropdownPicker';
import { PriceInput } from 'components/elements/PriceInput';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { processIPFSURL } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';

import { BigNumber, ethers } from 'ethers';
import { CaretDown, CaretRight } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import { useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface ListingCheckoutNftTableRowProps {
  listing: PartialDeep<StagedListing>;
  onPriceChange: () => void;
}

export function ListingCheckoutNftTableRow(props: ListingCheckoutNftTableRowProps) {
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + props.listing?.nft?.contract, async () => {
    return await getContractMetadata(props.listing?.nft?.contract, chain?.id);
  });
  const {
    setPrice,
    setCurrency,
    toggleTargetMarketplace,
    clearGeneralConfig,
    getTarget
  } = useContext(NFTListingsContext);
  const defaultChainId = useDefaultChainId();

  const [expanded, setExpanded] = useState(false);
  const [selectedOpensea, setSelectedOpensea] = useState(false);
  const [selectedLooksrare, setSelectedLooksrare] = useState(false);
  const [selectedx2y2, setSelectedx2y2] = useState(false);

  const marketPlacesOptions = [
    {
      label: 'Seaport',
      onSelect: () => {
        setSelectedOpensea(!selectedOpensea);
      }
    },
    {
      label: 'LooksRare',
      onSelect: () => {
        setSelectedLooksrare(!selectedLooksrare);
      }
    },
    {
      label: 'X2Y2',
      onSelect: () => {
        setSelectedx2y2(!selectedx2y2);
      }
    },
  ];

  const typeOfAuctionOptions = [
    {
      label: 'Fixed Price',
      onSelect: () => {
        setSelectedOpensea(!selectedOpensea);
      }
    },
    {
      label: 'English Auction',
      onSelect: () => {
        setSelectedLooksrare(!selectedLooksrare);
      }
    },
    {
      label: 'Decresing Price',
      onSelect: () => {
        setSelectedx2y2(!selectedx2y2);
      }
    },
  ];

  const rowHeightClass = expanded ? 'h-48' : 'h-24';
  const seaportEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.Seaport) != null, [getTarget, props.listing]);
  const looksrareEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.LooksRare) != null, [getTarget, props.listing]);
  const X2Y2Enabled = useMemo(() => getTarget(props.listing, ExternalProtocol.X2Y2) != null, [getTarget, props.listing]);

  useEffect(() => {
    if (expanded) {
      if (!looksrareEnabled) {
        toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
      }
      if (!seaportEnabled) {
        toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
      }
      if (!X2Y2Enabled) {
        toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
      }
    }
  }, [X2Y2Enabled, expanded, looksrareEnabled, props.listing, seaportEnabled, toggleTargetMarketplace]);

  return !getEnvBool(Doppler.NEXT_PUBLIC_TX_ROUTER_RESKIN_ENABLED)
    ? (
      <tr>
        <td className={rowHeightClass}>
          <div className='h-full w-full flex py-8 pr-8'>
            {
              expanded ?
                <CaretDown onClick={() => {
                  setExpanded(false);
                }} size={24} color="black" className='mr-4 mt-2 cursor-pointer caretToggle' /> :
                <CaretRight onClick={() => {
                  setExpanded(true);
                  clearGeneralConfig(props.listing);
                }} size={24} color="black" className='mr-4 mt-2 cursor-pointer caretToggle' />
            }
            <div className='relative h-10 aspect-square'>
              <video
                autoPlay
                muted
                loop
                key={props.listing.nft?.metadata?.imageURL}
                src={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
                poster={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
                className={tw(
                  'flex object-fit w-full justify-center rounded-md',
                )}
              />
            </div>
            <div className='flex flex-col ml-10 font-grotesk'>
              <span className='text-sm line-clamp-1'>{collection?.contractMetadata?.name}</span>
              <span className='font-bold text-base line-clamp-1'>{props.listing?.nft?.metadata?.name}</span>
            </div>
          </div>
        </td>
        <td className={tw('flex', rowHeightClass)}>
          <div className='h-full w-full py-4 flex flex-col justify-around'>
            {
              expanded ?
                <>
                  <PriceInput
                    key={expanded + 'OpenseaPriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH', 'ETH']}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    onCurrencyChange={(currency: SupportedCurrency) => {
                      setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  <PriceInput
                    key={expanded + 'LooksrarePriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.LooksRare)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.LooksRare)?.startingPrice ?? 0))
                    }
                    currencyAddress={getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH']}
                    onCurrencyChange={null}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.LooksRare);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare && target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  <PriceInput
                    key={expanded + 'X2Y2PriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.X2Y2)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.X2Y2)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.X2Y2)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['ETH']}
                    onCurrencyChange={null}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.X2Y2);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                </> :
                seaportEnabled && !looksrareEnabled && !X2Y2Enabled ?
                  <PriceInput
                    initial={
                      getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH', 'ETH']}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    onCurrencyChange={(currency: SupportedCurrency) => {
                      setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
                props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  :
                  X2Y2Enabled && !looksrareEnabled && !seaportEnabled ?
                    <PriceInput
                      initial={
                        props.listing?.startingPrice == null ?
                          '' :
                          ethers.utils.formatEther(BigNumber.from(props.listing.startingPrice))
                      }
                      currencyAddress={'0x0000000000000000000000000000000000000000'}
                      currencyOptions={['ETH']}
                      onCurrencyChange={null}
                      onPriceChange={(val: BigNumber) => {
                        setPrice(props.listing, val);
                        props.onPriceChange();
                      }}
                      error={
                        (props.listing.startingPrice == null) ||
                  (BigNumber.from(props.listing.startingPrice ?? 0).eq(0))
                      }
                    />
                    :
                    <PriceInput
                      initial={
                        props.listing?.startingPrice == null ?
                          '' :
                          ethers.utils.formatEther(BigNumber.from(props.listing.startingPrice))
                      }
                      currencyAddress={getAddress('weth', defaultChainId)}
                      currencyOptions={['WETH']}
                      onCurrencyChange={null}
                      onPriceChange={(val: BigNumber) => {
                        setPrice(props.listing, val);
                        props.onPriceChange();
                      }}
                      error={
                        (props.listing.startingPrice == null) ||
                  (BigNumber.from(props.listing.startingPrice ?? 0).eq(0))
                      }
                    />
            }
          </div>
        </td>
        <td className={rowHeightClass}>
          <div className={tw('flex flex-col p-4 justify-around', rowHeightClass)}>
            <OpenseaIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
                !seaportEnabled && 'opacity-40'
              )}
              alt="Opensea logo redirect"
              layout="fill"
              onClick={() => {
                if (expanded) {
                  return;
                }
                toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
              }}
            />
            <LooksrareIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
                !looksrareEnabled && 'opacity-40'
              )}
              alt="Looksrare logo redirect"
              layout="fill"
              onClick={() => {
                if (expanded) {
                  return;
                }
                toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
              }}
            />
            {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) &&
            <X2Y2Icon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
                !X2Y2Enabled && 'opacity-40'
              )}
              alt="X2Y2 logo redirect"
              layout="fill"
              onClick={() => {
                if (expanded) {
                  return;
                }
                toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
              }}
            />
            }
          </div>
        </td>
      </tr>
    )
    : (
      <tr className={rowHeightClass}>
        <td className='w-auto'>
          <div className='flex flex-col items-start w-28'>
            {/*             {
              expanded ?
                <CaretDown onClick={() => {
                  setExpanded(false);
                }} size={24} color="black" className='mr-4 mt-2 cursor-pointer caretToggle' /> :
                <CaretRight onClick={() => {
                  setExpanded(true);
                  clearGeneralConfig(props.listing);
                }} size={24} color="black" className='mr-4 mt-2 cursor-pointer caretToggle' />
            } */}
            <div className='relative h-20 aspect-square'>
              <video
                autoPlay
                muted
                loop
                key={props.listing.nft?.metadata?.imageURL}
                src={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
                poster={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
                className={tw(
                  'flex object-fit w-full justify-center rounded-md',
                )}
              />
            </div>
            <div className='flex flex-col font-noi-grotesk'>
              <span className='text-sm line-clamp-1'>{collection?.contractMetadata?.name}</span>
              <span className='font-bold text-base line-clamp-1'>{props.listing?.nft?.metadata?.name}</span>
            </ div>
          </ div>
        </td>
        <td className='align-top w-auto'>
          <div className='flex flex-col items-start h-full'>
            {props.listing?.targets?.map((target) =>
              <div key={target.protocol}>
                <DropdownPicker
                  options={marketPlacesOptions}
                  selectedIndex={marketPlacesOptions?.findIndex((i) => i.label === target?.protocol) >= 0 ? marketPlacesOptions?.findIndex((i) => i.label === target?.protocol) : 0}
                />
              </div>) }
            {props.listing?.targets?.length < 3 && <div>
              <DropdownPicker
                options={marketPlacesOptions}
                placeholder={'Select Marketplace'}
              />
            </div>}
          </div>
        </td>
        <td className='align-top w-auto'>
          <div className='flex flex-col items-start h-full w-44'>
            {props.listing?.targets?.map((target) =>
              <div key={target.protocol}>
                <DropdownPicker
                  options={typeOfAuctionOptions}
                  placeholder={'Select'}
                />
              </div>)}
            {props.listing?.targets?.length < 3 &&
              <DropdownPicker
                options={typeOfAuctionOptions}
                placeholder={'Select'}
              />}
          </div>
        </td>
        <td className={tw(rowHeightClass)}>
          <div className='h-full w-full py-4 flex flex-col justify-around'>
            {
              expanded ?
                <>
                  <PriceInput
                    key={expanded + 'OpenseaPriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH', 'ETH']}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    onCurrencyChange={(currency: SupportedCurrency) => {
                      setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
                  props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  <PriceInput
                    key={expanded + 'LooksrarePriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.LooksRare)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.LooksRare)?.startingPrice ?? 0))
                    }
                    currencyAddress={getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH']}
                    onCurrencyChange={null}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.LooksRare);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare && target.startingPrice == null) != null ||
                  props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  <PriceInput
                    key={expanded + 'X2Y2PriceInput'}
                    initial={
                      getTarget(props.listing, ExternalProtocol.X2Y2)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.X2Y2)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.X2Y2)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['ETH']}
                    onCurrencyChange={null}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.X2Y2);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && target.startingPrice == null) != null ||
                  props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                </> :
                seaportEnabled && !looksrareEnabled && !X2Y2Enabled ?
                  <PriceInput
                    initial={
                      getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice == null ?
                        '' :
                        ethers.utils.formatEther(BigNumber.from(getTarget(props.listing, ExternalProtocol.Seaport)?.startingPrice ?? 0))
                    }
                    currencyAddress={getTarget(props.listing, ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId)}
                    currencyOptions={['WETH', 'ETH']}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    onCurrencyChange={(currency: SupportedCurrency) => {
                      setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
              props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null
                    }
                  />
                  :
                  X2Y2Enabled && !looksrareEnabled && !seaportEnabled ?
                    <PriceInput
                      initial={
                        props.listing?.startingPrice == null ?
                          '' :
                          ethers.utils.formatEther(BigNumber.from(props.listing.startingPrice))
                      }
                      currencyAddress={'0x0000000000000000000000000000000000000000'}
                      currencyOptions={['ETH']}
                      onCurrencyChange={null}
                      onPriceChange={(val: BigNumber) => {
                        setPrice(props.listing, val);
                        props.onPriceChange();
                      }}
                      error={
                        (props.listing.startingPrice == null) ||
                (BigNumber.from(props.listing.startingPrice ?? 0).eq(0))
                      }
                    />
                    :
                    <PriceInput
                      initial={
                        props.listing?.startingPrice == null ?
                          '' :
                          ethers.utils.formatEther(BigNumber.from(props.listing.startingPrice))
                      }
                      currencyAddress={getAddress('weth', defaultChainId)}
                      currencyOptions={['WETH']}
                      onCurrencyChange={null}
                      onPriceChange={(val: BigNumber) => {
                        setPrice(props.listing, val);
                        props.onPriceChange();
                      }}
                      error={
                        (props.listing.startingPrice == null) ||
                (BigNumber.from(props.listing.startingPrice ?? 0).eq(0))
                      }
                    />
            }
          </div>
        </td>
        <td className={rowHeightClass}>
          <div className={tw('flex flex-col p-4 justify-around', rowHeightClass)}>
            <OpenseaIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
                !seaportEnabled && 'opacity-40'
              )}
              alt="Opensea logo redirect"
              layout="fill"
              onClick={() => {
                if (expanded) {
                  return;
                }
                toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
              }}
            />
            <LooksrareIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
                !looksrareEnabled && 'opacity-40'
              )}
              alt="Looksrare logo redirect"
              layout="fill"
              onClick={() => {
                if (expanded) {
                  return;
                }
                toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
              }}
            />
            {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) &&
          <X2Y2Icon
            className={tw(
              'h-9 w-9 relative shrink-0 cursor-pointer',
              !X2Y2Enabled && 'opacity-40'
            )}
            alt="X2Y2 logo redirect"
            layout="fill"
            onClick={() => {
              if (expanded) {
                return;
              }
              toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
            }}
          />
            }
          </div>
        </td>
      </tr>
    );
}