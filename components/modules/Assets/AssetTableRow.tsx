import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { DotsThreeVertical } from 'phosphor-react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import CustomTooltip from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft } from 'graphql/generated/types';
import { useGetTxByNFTQuery } from 'graphql/hooks/useGetTxByNFTQuery';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/format';
import { getGenesisKeyThumbnail, isOfficialCollection, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import Offers from 'public/icons/offers.svg?svgr';

export interface AssetTableRowProps {
  item: PartialDeep<Nft>;
  onChange: (listing: PartialDeep<Nft>) => void;
  isChecked: boolean;
}

export default function AssetTableRow({ item, onChange, isChecked }: AssetTableRowProps) {
  const defaultChainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();
  const { data: collectionMetadata } = useSWR(`ContractMetadata${item?.contract}`, async () => {
    return getContractMetadata(item?.contract, defaultChainId);
  });
  const collectionName = collectionMetadata?.contractMetadata?.name;

  const { data: profiles } = useProfilesByDisplayedNft(item?.contract, item?.tokenId, defaultChainId, true);
  const nftSaleHistory = useGetTxByNFTQuery(
    item?.contract,
    item?.tokenId ? BigNumber.from(item?.tokenId).toString() : null,
    'sale',
    { first: 1 }
  );

  const imageUrls =
    sameAddress(item.contract, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(item.tokenId)
      ? [getGenesisKeyThumbnail(item.tokenId)]
      : [item?.metadata?.imageURL];

  const getDisplayedProfiles = useCallback(() => {
    if (!profiles?.length) {
      return <p className='text-[#B6B6B6]'>hidden</p>;
    }
    if (profiles?.length === 1) {
      return (
        <div className='flex items-center'>
          <RoundedCornerMedia
            priority={true}
            containerClasses='w-[32px] h-[32px] aspect-square mr-3'
            variant={RoundedCornerVariant.Full}
            amount={RoundedCornerAmount.Medium}
            src={profiles[0].photoURL}
          />
          <Link href={`/${profiles[0].url}`}>
            <p className='font-bold hover:cursor-pointer'>
              <span className='mr-1 font-dm-mono text-primary-yellow'>/</span>
              {profiles[0].url}
            </p>
          </Link>
        </div>
      );
    }
    return (
      <div className='relative flex items-center font-medium text-[#1F2127] underline decoration-[#B59007] underline-offset-2'>
        <CustomTooltip
          tooltipClick={() => null}
          orientation='top'
          tooltipComponent={
            <div className='flex w-[200px] flex-col space-y-3 bg-black p-3'>
              {profiles.map((profile, i) => (
                <div key={i} className='flex items-center'>
                  <RoundedCornerMedia
                    priority={true}
                    containerClasses='w-[32px] h-[32px] aspect-square mr-3'
                    variant={RoundedCornerVariant.Full}
                    amount={RoundedCornerAmount.Medium}
                    src={profile.photoURL}
                  />
                  <Link href={`/${profile.url}`}>
                    <p className='font-bold hover:cursor-pointer'>
                      <span className='mr-1 font-dm-mono text-primary-yellow'>/</span>
                      {profile.url}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          }
        >
          {profiles.length} Profiles
        </CustomTooltip>
      </div>
    );
  }, [profiles]);

  return (
    <tr className={tw('h-20 min-w-[5.5rem] border-t border-[#D6D6D6] font-noi-grotesk font-medium')}>
      <td className='pr-8 text-body font-bold leading-body minmd:pr-4'>
        <div className='flex justify-center'>
          <input
            checked={isChecked}
            onChange={() => onChange({ ...item, collection: { name: collectionName } })}
            className='form-checkbox border-2 border-[#6F6F6F] text-[#6F6F6F] focus:ring-[#F9D963]'
            type='checkbox'
          />
        </div>
      </td>
      <td className='pr-8 text-body leading-body minmd:pr-4'>
        <div className='... -mt-1 flex h-full items-center truncate'>
          <RoundedCornerMedia
            containerClasses='min-w-[32px] w-[32px] h-[32px] mr-2'
            src={imageUrls[0]}
            variant={RoundedCornerVariant.Asset}
          />
          <Link href={`/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toString()}`}>
            <p className='... truncate text-black hover:cursor-pointer'>{item.metadata?.name}</p>
          </Link>
        </div>
      </td>
      <td className='pr-8 text-body leading-body minmd:pr-4'>
        <Link href={`/app/collection/${isOfficialCollection(item.collection)}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 text-black'>{collectionName}</p>
          </div>
        </Link>
      </td>
      <td className='pr-8 text-sm leading-body minmd:pr-4 minmd:text-body'>
        <div>{!isNullOrEmpty(filterValidListings(item?.listings?.items)) ? <p>Listed</p> : <p>—</p>}</div>
      </td>
      {getEnvBool(Doppler.NEXT_PUBLIC_ASSETS_PRICE_ENABLED) && (
        <>
          <td className='pr-8 text-sm leading-body minmd:pr-4 minmd:text-body'>
            <div>
              {nftSaleHistory?.data?.items[0]?.priceDetails ? (
                <p>{nftSaleHistory?.data?.items[0]?.priceDetails?.price}</p>
              ) : (
                <p>—</p>
              )}
            </div>
          </td>
          <td className='pr-8 text-sm leading-body minmd:pr-4 minmd:text-body'>
            <div>
              {nftSaleHistory?.data?.items[0]?.priceDetails?.priceUSD ? (
                <p>
                  $
                  {Number(nftSaleHistory?.data?.items[0]?.priceDetails?.priceUSD).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : (
                <p>—</p>
              )}
            </div>
          </td>
        </>
      )}

      <td className='-mt-1 pr-8 text-sm leading-body minmd:pr-4 minmd:text-body'>
        <div>{getDisplayedProfiles()}</div>
      </td>
      {getEnvBool(Doppler.NEXT_PUBLIC_NFT_OFFER_RESKIN_ENABLED) && (
        <td className='pr-8 text-sm leading-body minmd:pr-4 minmd:text-body'>
          <div
            onClick={() => alert('redirect todo')}
            className='-mt-1 flex cursor-pointer items-center hover:underline'
          >
            <Offers className='mr-2' />
            {/* TODO: NATIVE */}
            <div>2 Offers</div>
          </div>
        </td>
      )}
      <td className='pr-8 minmd:pr-4'>
        <DropdownPickerModal
          constrain
          selectedIndex={0}
          options={filterNulls([
            currentAddress === item?.wallet?.address
              ? {
                  label: 'List NFT',
                  onSelect: () => {
                    onChange({ ...item, collection: { name: collectionName } });
                  },
                  icon: null
                }
              : null,
            {
              label: 'Share on Twitter',
              onSelect: () =>
                window.open(
                  `https://twitter.com/share?url=${encodeURIComponent(
                    `https://www.nft.com/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toString()}`
                  )}&text=${document.title}`,
                  '',
                  'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
                ),
              icon: null
            }
          ])}
        >
          <div className='flex w-full items-center justify-between'>
            <span />
            <DotsThreeVertical
              data-cy='RowDropdown'
              size={25}
              weight='fill'
              className='ml-2 text-black hover:cursor-pointer'
            />
          </div>
        </DropdownPickerModal>
      </td>
    </tr>
  );
}
