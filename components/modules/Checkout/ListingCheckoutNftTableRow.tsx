import CustomTooltip2 from 'components/elements/CustomTooltip2';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import { PriceInput } from 'components/elements/PriceInput';
import { X2Y2ProtocolData } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { processIPFSURL } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getLowestPriceListing } from 'utils/listingUtils';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';

import { BigNumber, ethers } from 'ethers';
import { CaretDown, CaretRight } from 'phosphor-react';
import RemoveIcon from 'public/close-circle-icon-gray.svg';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import DeleteRowIcon from 'public/trash-icon.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';
export interface ListingCheckoutNftTableRowProps {
  listing: PartialDeep<StagedListing>;
  onPriceChange: () => void;
}

export function ListingCheckoutNftTableRow(props: ListingCheckoutNftTableRowProps) {
  const defaultChainId = useDefaultChainId();
  const ethPriceUSD = useEthPriceUSD();
  const lowestX2Y2Listing = getLowestPriceListing(filterValidListings(props?.listing?.nft?.listings.items), ethPriceUSD, defaultChainId, ExternalProtocol.X2Y2);
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + props.listing?.nft?.contract, async () => {
    return await getContractMetadata(props.listing?.nft?.contract, chain?.id);
  });
  const {
    setPrice,
    setCurrency,
    toggleTargetMarketplace,
    clearGeneralConfig,
    getTarget,
    removeListing
  } = useContext(NFTListingsContext);

  const [expanded, setExpanded] = useState(false);
  // const [rowSelectedMarketplace, setRowSelectedMarketplace] = useState(null);
  const rowSelectedMarketplaces = useRef(null);

  const marketPlacesOptions = [
    {
      label: 'Opensea',// ExternalProtocol.Seaport,
      onSelect: () => {
        rowSelectedMarketplaces.current = '';
        toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.Seaport || rowSelectedMarketplaces.current === 'Opensea'
    },
    {
      label: ExternalProtocol.LooksRare,
      onSelect: () => {
        rowSelectedMarketplaces.current = '';
        toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.LooksRare
    },
    {
      label: ExternalProtocol.X2Y2,
      onSelect: () => {
        rowSelectedMarketplaces.current = '';
        toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.X2Y2
    },
  ];

  const marketPlacesOptionsExtra = [
    {
      label: 'Opensea',// ExternalProtocol.Seaport,
      onSelect: () => {
        rowSelectedMarketplaces.current = ExternalProtocol.Seaport;
        toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.Seaport || rowSelectedMarketplaces.current === 'Opensea'
    },
    {
      label: ExternalProtocol.LooksRare,
      onSelect: () => {
        rowSelectedMarketplaces.current = ExternalProtocol.LooksRare;
        toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.LooksRare
    },
    {
      label: ExternalProtocol.X2Y2,
      onSelect: () => {
        rowSelectedMarketplaces.current = ExternalProtocol.X2Y2;
        toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
      },
      disabled: rowSelectedMarketplaces.current === ExternalProtocol.X2Y2
    },
  ];

  const currenciesOptions = [
    {
      label: 'WETH',
      onSelect: () => {
        return;
      }
    },
    {
      label: 'ETH',
      onSelect: () => {
        return;
      }
    },
  ];

  const rowHeightClass = expanded ? 'h-48' : 'h-24';
  const seaportEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.Seaport) != null, [getTarget, props.listing]);
  const looksrareEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.LooksRare) != null, [getTarget, props.listing]);
  const X2Y2Enabled = useMemo(() => getTarget(props.listing, ExternalProtocol.X2Y2) != null, [getTarget, props.listing]);

  const OpenseaPriceInput = () => {
    return <PriceInput
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
    />;
  };

  const LooksRarePriceInput = () => {
    return <PriceInput
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
    />;
  };

  const X2Y2PriceInput = () => {
    return <PriceInput
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
    />;
  };

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
                    currencyAddress={'0x0000000000000000000000000000000000000000'}
                    currencyOptions={['ETH']}
                    onCurrencyChange={null}
                    onPriceChange={(val: BigNumber) => {
                      setPrice(props.listing, val, ExternalProtocol.X2Y2);
                      props.onPriceChange();
                    }}
                    error={
                      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && BigNumber.from(target.startingPrice).eq(0)) != null ||
                    (parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2)?.startingPrice))
                    }
                    errorMessage={
                      (parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2)?.startingPrice)) && 'Active listing has a greater price, please enter a lower value.'
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
                  (BigNumber.from(props.listing.startingPrice ?? 0).eq(0)) ||
                  (parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing.startingPrice))
                      }
                      errorMessage={
                        (parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing.startingPrice)) && 'Active listing has a greater price, please enter a lower value.'
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
      <tr className='h-44'>
        <td className='w-auto mr-10 mt-6'>
          <div className='flex flex-col items-start w-40'>
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
            <div className='relative max-h-28 rounded-md'>
              <div className='relative max-h-28 aspect-square overflow-y-hidden rounded-md'>
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
              <RemoveIcon
                className="absolute left-[4.5rem] top-[-1.5rem] cursor-pointer z-[100]"
                onClick={() => removeListing(props.listing?.nft)} />
            </div>
            <div className='flex flex-col font-noi-grotesk'>
              <span className='text-sm line-clamp-1 capitalize'>{collection?.contractMetadata?.name?.toLowerCase()}</span>
              <span className='font-bold text-base line-clamp-1 capitalize'>{props.listing?.nft?.metadata?.name?.toLowerCase()}</span>
            </ div>
          </ div>
        </td>
        <td className='align-top w-auto'>
          <div className='flex flex-col items-start h-full pr-2'>
            {/* {props.listing?.targets?.map((target) =>

              <div key={target?.protocol + props?.listing?.nft?.id + 'dropdownpicker'} className='mb-2 border border-gray-300 rounded-md w-full'>
                <DropdownPicker
                  options={marketPlacesOptions}
                  selectedIndex={marketPlacesOptions?.findIndex((i) => i.label === target?.protocol) >= 0 ? marketPlacesOptions?.findIndex((i) => i.label === target?.protocol) : 0}
                />
              </div>) } */}
            {seaportEnabled && (rowSelectedMarketplaces.current !== ExternalProtocol.Seaport && rowSelectedMarketplaces.current !== 'Opensea') &&<div className='mb-2 border border-gray-300 rounded-md w-full'>
              <DropdownPicker
                options={marketPlacesOptions}
                selectedIndex={0}
              />
            </div>}
            {looksrareEnabled && rowSelectedMarketplaces.current !== ExternalProtocol.LooksRare && <div className='mb-2 border border-gray-300 rounded-md w-full'>
              <DropdownPicker
                options={marketPlacesOptions}
                selectedIndex={1}
              />
            </div>}
            {X2Y2Enabled && rowSelectedMarketplaces.current !== ExternalProtocol.X2Y2 && <div className='mb-2 border border-gray-300 rounded-md w-full'>
              <DropdownPicker
                options={marketPlacesOptions}
                selectedIndex={2}
              />
            </div>}
            {props.listing?.targets?.length < 3 &&
              <div className='mb-2 border border-gray-300 rounded-md w-full'>
                <DropdownPicker
                  options={marketPlacesOptionsExtra}
                  placeholder={'Select Marketplace'}
                  selectedIndex={!seaportEnabled && !looksrareEnabled && !X2Y2Enabled && -1}
                />
              </div>}
          </div>
        </td>
        <td className='align-top w-auto'>
          <div className='flex flex-col items-start h-full min-w-28 pr-2'>
            {seaportEnabled && (rowSelectedMarketplaces.current !== ExternalProtocol.Seaport && rowSelectedMarketplaces.current !== 'Opensea') &&
              <input
                disabled
                type="text"
                value='Fixed price'
                className={tw(
                  'text-sm min-w-0 border border-gray-200 h-[2.65rem] shrink-0 w-full',
                  'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3',
                )}
              />}
            {looksrareEnabled && rowSelectedMarketplaces.current !== ExternalProtocol.LooksRare &&
              <input
                disabled
                type="text"
                value='Fixed price'
                className={tw(
                  'text-sm min-w-0 border border-gray-200 h-[2.65rem] shrink-0 w-full',
                  'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3',
                )}
              />}
            {X2Y2Enabled && rowSelectedMarketplaces.current !== ExternalProtocol.X2Y2 &&
              <input
                disabled
                type="text"
                value='Fixed price'
                className={tw(
                  'text-sm min-w-0 border border-gray-200 h-[2.65rem] shrink-0 w-full',
                  'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3',
                )}
              />}
            {props.listing?.targets?.length < 3 &&
              <input
                disabled
                type="text"
                value='Fixed price'
                className={tw(
                  'text-sm min-w-0 border border-gray-200 h-[2.65rem] shrink-0 w-full',
                  'text-left p-1 rounded-md bg-gray-200 pl-3',
                )}
              />}
          </div>
        </td>
        <td className='align-top w-min'>
          <div className='h-full min-w-32 flex flex-col justify-around'>
            {seaportEnabled && (rowSelectedMarketplaces.current !== ExternalProtocol.Seaport && rowSelectedMarketplaces.current !== 'Opensea') && <div className='mb-2'>{OpenseaPriceInput()}</div>}
            
            {looksrareEnabled && rowSelectedMarketplaces.current !== ExternalProtocol.LooksRare && <div className='mb-2'>{LooksRarePriceInput()}</div>}
            
            {X2Y2Enabled && rowSelectedMarketplaces.current !== ExternalProtocol.X2Y2 &&
              <div className='mb-2 w-1/2'>
                <CustomTooltip2
                  orientation='top'
                  hidden={
                    !(parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2)?.startingPrice))
                  }
                  tooltipComponent={
                    <div
                      className="rounded-xl max-w-[150px] w-max"
                    >
                      <p>An active listing for this marketplace has a lower price. Please enter a lower value than the active listing.</p>
                    </div>
                  }
                >
                  {X2Y2PriceInput()}
                </CustomTooltip2>
              </div>
            }
            {props.listing?.targets?.length < 3 && (rowSelectedMarketplaces.current === ExternalProtocol.Seaport || rowSelectedMarketplaces.current === 'Opensea') && OpenseaPriceInput()}
            {props.listing?.targets?.length < 3 && rowSelectedMarketplaces.current === ExternalProtocol.LooksRare && LooksRarePriceInput()}
            {props.listing?.targets?.length < 3 && rowSelectedMarketplaces.current === ExternalProtocol.X2Y2 && X2Y2PriceInput()}
            {props.listing?.targets?.length < 3 && rowSelectedMarketplaces.current === null &&
            <div className='flex'>
              <input
                disabled
                type="text"
                placeholder='Price'
                className={tw(
                  'text-sm min-w-0 border border-gray-300 h-[2.65rem] w-1/2 shrink-0 ',
                  'text-left p-1 rounded-md mr-2',
                )}
              />
              <div className='border border-gray-300 rounded-md w-2/3'>
                <DropdownPicker
                  options={currenciesOptions}
                  placeholder={'Currency'}
                />
              </div>
            </div>}
          </div>
        </td>
        <td className='w-auto align-top '>
          <div className='w-full pl-10 mt-2 flex flex-col justify-between h-full'>
            {seaportEnabled && rowSelectedMarketplaces.current !== ExternalProtocol.Seaport && rowSelectedMarketplaces.current !== 'Opensea' && <div className='h-full py-2'><DeleteRowIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
              )}
              alt="Delete market place"
              layout="fill"
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
              }}
            /></div>}
            
            {looksrareEnabled && rowSelectedMarketplaces.current !== ExternalProtocol.LooksRare && <div className='h-full py-2'><DeleteRowIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
              )}
              alt="Delete market place"
              layout="fill"
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
              }}
            /></div>}
            
            {X2Y2Enabled && rowSelectedMarketplaces.current !== ExternalProtocol.X2Y2 && <div className='h-full py-2'><DeleteRowIcon
              className={tw(
                'h-9 w-9 relative shrink-0 cursor-pointer',
              )}
              alt="Delete market place"
              layout="fill"
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
              }}
            /></div>}
          </div>
        </td>
      </tr>
    );
}