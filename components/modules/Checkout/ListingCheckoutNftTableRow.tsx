import CustomTooltip2 from 'components/elements/CustomTooltip2';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import { PriceInput } from 'components/elements/PriceInput';
import { LooksrareProtocolData, X2Y2ProtocolData } from 'graphql/generated/types';
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
import InfoIcon from 'public/gray-info-icon.svg';
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
  const lowestLooksrareListing = getLowestPriceListing(filterValidListings(props?.listing?.nft?.listings.items), ethPriceUSD, defaultChainId, ExternalProtocol.LooksRare);
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
  const [empty, setEmpty] = useState(true);

  const rowSelectedMarketplaces = useRef(null);

  const selectedOptionDropdown0 = useRef(null);
  const selectedOptionDropdown1 = useRef(null);
  const selectedOptionDropdown2 = useRef(null);

  const rowHeightClass = expanded ? 'h-48' : 'h-24';
  const seaportEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.Seaport) != null, [getTarget, props.listing]);
  const looksrareEnabled = useMemo(() => getTarget(props.listing, ExternalProtocol.LooksRare) != null, [getTarget, props.listing]);
  const X2Y2Enabled = useMemo(() => getTarget(props.listing, ExternalProtocol.X2Y2) != null, [getTarget, props.listing]);

  const generateMarketPlaceOptions = (dropDownNumber: number, hasPredefinedSelectedOption?: boolean) => {
    let selectedOptionForDropdown = dropDownNumber === 0 ? selectedOptionDropdown0 : dropDownNumber === 1 ? selectedOptionDropdown1 : selectedOptionDropdown2;
    if (hasPredefinedSelectedOption) {
      if (dropDownNumber === 0) {
        selectedOptionDropdown0.current = ExternalProtocol.Seaport;
        selectedOptionForDropdown = selectedOptionDropdown0;
      }
      if (dropDownNumber === 1) {
        selectedOptionDropdown1.current = ExternalProtocol.LooksRare;
        selectedOptionForDropdown = selectedOptionDropdown1;
      }
      if (dropDownNumber === 2) {
        selectedOptionDropdown2.current = ExternalProtocol.X2Y2;
        selectedOptionForDropdown = selectedOptionDropdown2;
      }
    }

    return [
      {
        label: 'Opensea',// ExternalProtocol.Seaport,
        onSelect: () => {
          setEmpty(false);
          rowSelectedMarketplaces.current = ExternalProtocol.Seaport;
          toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing, selectedOptionForDropdown.current);
          if (dropDownNumber === 0) selectedOptionDropdown0.current = ExternalProtocol.Seaport;
          if (dropDownNumber === 1) selectedOptionDropdown1.current = ExternalProtocol.Seaport;
          if (dropDownNumber === 2) selectedOptionDropdown2.current = ExternalProtocol.Seaport;
        },
        disabled: seaportEnabled
      },
      {
        label: ExternalProtocol.LooksRare,
        onSelect: () => {
          rowSelectedMarketplaces.current = ExternalProtocol.LooksRare;
          toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing, selectedOptionForDropdown.current);
          if (dropDownNumber === 0) selectedOptionDropdown0.current = ExternalProtocol.LooksRare;
          if (dropDownNumber === 1) selectedOptionDropdown1.current = ExternalProtocol.LooksRare;
          if (dropDownNumber === 2) selectedOptionDropdown2.current = ExternalProtocol.LooksRare;
        },
        disabled: looksrareEnabled
      },
      {
        label: ExternalProtocol.X2Y2,
        onSelect: () => {
          rowSelectedMarketplaces.current = ExternalProtocol.X2Y2;
          toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing, selectedOptionForDropdown.current);
          if (dropDownNumber === 0) selectedOptionDropdown0.current = ExternalProtocol.X2Y2;
          if (dropDownNumber === 1) selectedOptionDropdown1.current = ExternalProtocol.X2Y2;
          if (dropDownNumber === 2) selectedOptionDropdown2.current = ExternalProtocol.X2Y2;
        },
        disabled: X2Y2Enabled
      },
    ];
  };

  const OpenseaPriceInput = () => {
    return <PriceInput
      empty={empty}
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
        (props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null)
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
    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare && BigNumber.from(target.startingPrice).eq(0)) != null ||
    (parseInt((lowestLooksrareListing?.order?.protocolData as LooksrareProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare)?.startingPrice))
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
      props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2 && BigNumber.from(target.startingPrice).eq(0)) != null ||
      (parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2)?.startingPrice))
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

  useEffect(() => {
    if (seaportEnabled) {
      setEmpty(false);
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
                  {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) && <PriceInput
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
                  />}

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
      <div className='minlg:h-44 flex flex-row mb-8'>
        <div className='basis-4/12 minlg:basis-2/12 minxxl:max-w-[10rem] flex flex-col justify-start items-start px-2 minxl:px-8 w-full'>
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
          <span className='w-full text-base font-normal flex text-[#A6A6A6] mb-4'>NFT</span>
          <div className='relative w-full'>
            <div className='relative aspect-square overflow-y-hidden rounded-md w-full'>
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
              className="h-20 minhd:h-28 absolute -right-[50%] top-[-1.5rem] minhd:top-[-2rem] cursor-pointer z-[100]"
              onClick={() => removeListing(props.listing?.nft)} />
          </div>
          <div className='flex flex-col font-noi-grotesk'>
            <span className='font-bold text-base line-clamp-1 capitalize'>{props.listing?.nft?.metadata?.name?.toLowerCase()}</span>
            <span className='text-sm line-clamp-1 capitalize'>{collection?.contractMetadata?.name?.toLowerCase()}</span>
          </ div>
        </ div>
        {!seaportEnabled && !looksrareEnabled && !X2Y2Enabled && <span className='basis-7/12 minlg:basis-9/1 font-normal flex text-[#A6A6A6] px-4 minlg:pl-[20%] minxl:pl-[23%] minxl:pl-[26%] minhd:pl-[30%] self-center items-center whitespace-nowrap'>Select a Marketplace</span>}
        {true && (seaportEnabled || looksrareEnabled || X2Y2Enabled) && <div className='basis-8/12 minlg:basis-10/12 pl-5 minlg:pl-0'>
          <div className='hidden minlg:flex text-base font-normal flex text-[#A6A6A6] mb-4'>
            <div className='w-[35%]'>Marketplace</div>
            <div className='w-[25%]'>Type of Auction</div>
            <div className='w-[35%]'>Set Price</div>
            <div className='w-[5%]'>&nbsp;</div>
          </div>
          {seaportEnabled && /*(selectedOptionDropdown0.current !== ExternalProtocol.Seaport && selectedOptionDropdown0.current !== 'Opensea') && */
          <div className='w-full flex flex-col minlg:flex-row border-b border-[#A6A6A6] minlg:border-0 pb-3 minlg:pb-0 mb-3 minlg:mb-0'>
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Marketplace</div>
            <div className='mb-2 rounded-md h-12 w-full w-[89%] minlg:w-[35%]'>
              <DropdownPicker
                options={generateMarketPlaceOptions(0, true)}
                selectedIndex={0}
                v2
              />
            </div>
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Type of Auction</div>
            <input
              disabled
              type="text"
              value='Fixed price'
              className={tw(
                'text-sm border border-gray-200 h-12 w-full w-[89%] minlg:w-[25%]',
                'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3 minlg:ml-2 minlg:mr-1',
              )}
            />
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Set Price</div>
            <div className='mb-2 minlg:mx-1 h-12 w-full minlg:w-[35%] flex flex-row'>
              {OpenseaPriceInput()}
              <div className='w-full flex minlg:hidden -ml-[10rem] z-10 minlg:z-auto'>
                <div className='w-full flex items-center justify-end '>
                  <DeleteRowIcon
                    className='cursor-pointer'
                    alt="Delete market place"
                    layout="fill"
                    onClick={() => {
                      toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='minlg:h-[3rem] w-full minlg:w-[5%] hidden minlg:flex'>
              <div className='w-full flex items-center justify-end '>
                <DeleteRowIcon
                  className='cursor-pointer'
                  alt="Delete market place"
                  layout="fill"
                  onClick={() => {
                    toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
                  }}
                />
              </div>
            </div>
          </div>}
          {looksrareEnabled && /* && selectedOptionDropdown0.current !== ExternalProtocol.LooksRare &&*/
            <div className='w-full flex flex-col minlg:flex-row border-b border-[#A6A6A6] minlg:border-0 pb-3 minlg:pb-0 mb-3 minlg:mb-0'>
              <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Marketplace</div>
              <div className='mb-2 rounded-md h-12 w-full w-[89%] minlg:w-[35%]'>
                <DropdownPicker
                  options={generateMarketPlaceOptions(1, true)}
                  selectedIndex={1}
                  v2
                />
              </div>
              <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Type of Auction</div>
              <input
                disabled
                type="text"
                value='Fixed price'
                className={tw(
                  'text-sm border border-gray-200 h-12 w-full w-[89%] minlg:w-[25%]',
                  'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3 minlg:ml-2 minlg:mr-1',
                )}
              />
              <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Set Price</div>
              <div className='mb-2 minlg:mx-1 h-12 w-full minlg:w-[35%] flex flex-row'>
                <CustomTooltip2
                  orientation='custom'
                  customLeftPosition='19'
                  hidden={
                    !(parseInt((lowestLooksrareListing?.order?.protocolData as LooksrareProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.LooksRare)?.startingPrice))
                  }
                  tooltipComponent={
                    <div
                      className="rounded-xl max-w-[200px] w-max"
                    >
                      <p>LooksRare only allows adjusting the price to a lower value. Please lower the value, or cancel the previous listing in order to create a new listing at a higher price.</p>
                    </div>
                  }
                >
                  {LooksRarePriceInput()}
                </CustomTooltip2>
                <div className='w-full flex minlg:hidden -ml-[10rem] z-10 minlg:z-auto'>
                  <div className='w-full flex items-center justify-end '>
                    <DeleteRowIcon
                      className='cursor-pointer'
                      alt="Delete market place"
                      layout="fill"
                      onClick={() => {
                        toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='minlg:h-[3rem] w-full minlg:w-[5%] hidden minlg:flex'>
                <div className='w-full flex items-center justify-end '>
                  <DeleteRowIcon
                    className='cursor-pointer'
                    alt="Delete market place"
                    layout="fill"
                    onClick={() => {
                      toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
                    }}
                  />
                </div>
              </div>
            </div>}
          {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) && X2Y2Enabled && /* selectedOptionDropdown0.current !== ExternalProtocol.X2Y2 && */
          <div className='w-full flex flex-col minlg:flex-row border-b border-[#A6A6A6] minlg:border-0 pb-3 minlg:pb-0 mb-3 minlg:mb-0'>
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Marketplace</div>
            <div className='mb-2 rounded-md h-12 w-full w-[89%] minlg:w-[35%]'>
              <DropdownPicker
                options={generateMarketPlaceOptions(2, true)}
                selectedIndex={2}
                v2
              />
            </div>
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Type of Auction</div>
            <input
              disabled
              type="text"
              value='Fixed price'
              className={tw(
                'text-sm border border-gray-200 h-12 w-full w-[89%] minlg:w-[25%]',
                'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3 minlg:ml-2 minlg:mr-1',
              )}
            />
            <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Set Price</div>
            <div className='mb-2 minlg:mx-1 h-12 w-full minlg:w-[35%] flex flex-row relative'>
              <CustomTooltip2
                orientation='custom'
                customLeftPosition='19'
                hidden={
                  !(parseInt((lowestX2Y2Listing?.order?.protocolData as X2Y2ProtocolData)?.price) < Number(props.listing?.targets?.find(target => target.protocol === ExternalProtocol.X2Y2)?.startingPrice))
                }
                tooltipComponent={
                  <div
                    className="rounded-xl max-w-[200px] w-max"
                  >
                    <p>X2Y2 only allows adjusting the price to a lower value. Please lower the value, or cancel the previous listing in order to create a new listing at a higher price.</p>
                  </div>
                }
              >
                {X2Y2PriceInput()}
              </CustomTooltip2>
              <div className='w-full flex minlg:hidden -ml-[10rem] z-10 minlg:z-auto'>
                <div className='w-full flex items-center justify-end '>
                  <DeleteRowIcon
                    className='cursor-pointer'
                    alt="Delete market place"
                    layout="fill"
                    onClick={() => {
                      toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='minlg:h-[3rem] w-full minlg:w-[5%] hidden minlg:flex'>
              <div className='w-full flex items-center justify-end '>
                <DeleteRowIcon
                  className='cursor-pointer'
                  alt="Delete market place"
                  layout="fill"
                  onClick={() => {
                    toggleTargetMarketplace(ExternalProtocol.X2Y2, props.listing);
                  }}
                />
              </div>
            </div>
          </div>}
        </div>}
      </div>
    );
}
