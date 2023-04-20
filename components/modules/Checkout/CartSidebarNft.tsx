import { useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork, useProvider } from 'wagmi';

import { NFTListingsContext, StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useGetCreatorFee } from 'hooks/useGetCreatorFee';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/ipfs';
import { cl } from 'utils/tw';

import { StagedPurchase } from './NFTPurchaseContext';

export interface CartSidebarNftProps {
  item: PartialDeep<StagedListing | StagedPurchase>;
  selectedTab: string;
  onRemove: () => void;
}

export function CartSidebarNft(props: CartSidebarNftProps) {
  const { chain } = useNetwork();
  const provider = useProvider();
  const router = useRouter();
  const looksrareStrategy = useLooksrareStrategyContract(provider);
  const nft = props.item?.nft;
  const priceCheck = props.item && 'price' in props.item;

  const { data: collection } = useSWR(`ContractMetadata${nft?.contract}`, async () => {
    return getContractMetadata(nft?.contract, chain?.id);
  });

  const { getByContractAddress } = useSupportedCurrencies();
  const { toggleCartSidebar } = useContext(NFTListingsContext);

  const { data: looksrareProtocolFeeBps } = useSWR(
    `LooksrareProtocolFeeBps${String(looksrareStrategy == null)}`,
    async () => {
      return looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false
    }
  );

  const formatCurrency = useCallback(
    (item: StagedPurchase) => {
      const currency = getByContractAddress((item as StagedPurchase).currency);
      if (currency.name === 'USDC') {
        return ethers.utils.formatUnits(item.price, 6);
      }
      return ethers.utils.formatEther((item as StagedPurchase)?.price ?? 0);
    },
    [getByContractAddress]
  );

  const { data: creatorFee, loading } = useGetCreatorFee(
    nft?.contract,
    nft?.tokenId,
    looksrareProtocolFeeBps,
    props.item,
    props.selectedTab === 'Buy'
  );

  const getRoyalty = useCallback(() => {
    if (loading) {
      return 'loading...';
    }

    // show single royalty fee when buying since marketplace is chosen already
    if (props.selectedTab === 'Buy') {
      const stagedPurchase = props.item as StagedPurchase;
      switch (stagedPurchase?.protocol) {
        case 'Seaport':
          return `${creatorFee?.royalty?.seaport ? Number(creatorFee?.royalty?.seaport).toFixed(2) : 0}%`;
        case 'LooksRare':
          return `${creatorFee?.royalty?.looksrare ? Number(creatorFee?.royalty?.looksrare).toFixed(2) : 0}%`;
        case 'X2Y2':
          return `${creatorFee?.royalty?.x2y2 ? Number(creatorFee?.royalty?.x2y2).toFixed(2) : 0}%`;
        case 'NFTCOM':
          return `${creatorFee?.royalty?.nftcom ? Number(creatorFee?.royalty?.nftcom).toFixed(2) : 0}%`;
        default:
          return 'n/a%';
      }
    }

    // show range if it's a listing (bc multiple marketplaces)
    if (creatorFee?.min === 0 && creatorFee?.max === 0) {
      return '0%';
    }
    return `${creatorFee?.min?.toFixed(2)}% - ${creatorFee?.max?.toFixed(2)}%`;
  }, [
    creatorFee?.max,
    creatorFee?.min,
    creatorFee?.royalty?.looksrare,
    creatorFee?.royalty?.nftcom,
    creatorFee?.royalty?.seaport,
    creatorFee?.royalty?.x2y2,
    loading,
    props.item,
    props.selectedTab
  ]);

  return (
    <div className='mb-4 flex w-full items-start px-5'>
      <div className='flex w-2/3'>
        <div
          onClick={() => {
            router.push(`/app/nft/${nft?.contract}/${nft?.tokenId}`);
            toggleCartSidebar();
          }}
          className='relative aspect-square max-w-[5rem] cursor-pointer'
        >
          <video
            autoPlay
            muted
            loop
            key={nft?.metadata?.imageURL}
            src={processIPFSURL(nft?.metadata?.imageURL)}
            poster={processIPFSURL(nft?.metadata?.imageURL)}
            className={cl('object-fit flex w-full justify-center rounded-xl')}
          />
        </div>
        <div className='ml-4 flex flex-col overflow-hidden text-ellipsis whitespace-nowrap font-noi-grotesk'>
          <span className='text-lg font-bold line-clamp-1'>{collection?.contractMetadata?.name}</span>
          <span className='mb-3 text-sm text-[#6F6F6F] line-clamp-1'>{nft?.metadata?.name}</span>
          <span className='text-[0.6rem] text-[#6F6F6F]'>Creator fee: {getRoyalty()}</span>
        </div>
      </div>
      <div className='justify-becleen mt-1 flex h-full w-1/3 flex-col items-end'>
        <div>
          {
            // this is a staged purchase
            priceCheck ? (
              <div className='text-base font-medium line-clamp-1'>
                {Number(formatCurrency(props.item as StagedPurchase)).toLocaleString('en-US', {
                  maximumSignificantDigits: 3
                })}{' '}
                <span className='text-[#6F6F6F]'>
                  {getByContractAddress((props.item as StagedPurchase).currency)?.name ?? ''}
                </span>
              </div>
            ) : null
          }
        </div>
        <span
          onClick={props.onRemove}
          className={cl('cursor-pointer text-sm text-[#6F6F6F] line-clamp-1 hover:underline', {
            'mr-5': priceCheck
          })}
        >
          Remove
        </span>
      </div>
    </div>
  );
}
