import Loader from 'components/elements/Loader';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Nft } from 'graphql/generated/types';
import { useMyAssetsQuery } from 'graphql/hooks/useMyAssetsQuery';
import { useFetchNftCollectionAllowance } from 'hooks/balances/useFetchNftCollectionAllowance';
import { TransferProxyTarget } from 'hooks/balances/useNftCollectionAllowance';
import { usePaginator } from 'hooks/usePaginator';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import AssetTableRow from './AssetTableRow';

import { useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

const ASSET_LOAD_COUNT = 25;

export default function AssetsPages() {
  const { address: currentAddress } = useAccount();
  const [lastAddedPage, setLastAddedPage] = useState('');
  const [assetData, setAssetData] = useState([]);
  const {
    nextPage,
    afterCursor,
    cachedTotalCount,
    setTotalCount
  } = usePaginator(ASSET_LOAD_COUNT);

  const { data: loadedAssetsNextPage, loading: loadingAssets } = useMyAssetsQuery(
    ASSET_LOAD_COUNT,
    afterCursor
  );

  const loadMoreAssets = useCallback(() => {
    nextPage(loadedAssetsNextPage?.myNFTs?.pageInfo?.lastCursor);
  }, [loadedAssetsNextPage?.myNFTs?.pageInfo?.lastCursor, nextPage]);

  useEffect(() => {
    if (
      loadedAssetsNextPage?.myNFTs?.items?.length > 0 &&
      lastAddedPage !== loadedAssetsNextPage?.myNFTs?.pageInfo?.firstCursor
    ) {
      setAssetData([
        ...assetData,
        ...filterNulls(loadedAssetsNextPage?.myNFTs?.items)
      ]);
      setLastAddedPage(loadedAssetsNextPage?.myNFTs?.pageInfo?.firstCursor);
      setTotalCount(loadedAssetsNextPage?.myNFTs?.totalItems);
    } else {
      loadedAssetsNextPage?.myNFTs?.totalItems && setTotalCount(loadedAssetsNextPage?.myNFTs?.totalItems);
    }
  }, [lastAddedPage, setTotalCount, assetData, loadedAssetsNextPage, afterCursor, loadedAssetsNextPage?.myNFTs?.items, currentAddress]);

  const { stageListings, toggleCartSidebar } = useContext(NFTListingsContext);
  const [selectedAssets, setSelectedAssets] = useState<Array<PartialDeep<Nft>>>([]);
  const [loading, setLoading] = useState(false);
  const { fetchAllowance } = useFetchNftCollectionAllowance();

  const onChangeHandler = useCallback(async (asset) => {
    const index = selectedAssets.findIndex((item) => item.id === asset.id);
    if(index !== -1) {
      setSelectedAssets(selectedAssets.filter((_, i) => i !== index));
    } else {
      setSelectedAssets([...selectedAssets, asset]);
    }
  }, [selectedAssets]);

  const selectAllHandler = useCallback(async () => {
    if (selectedAssets.length === assetData.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets([...assetData]);
    }
  }, [assetData, selectedAssets.length]);

  return (
    <div className='flex flex-col justify-between minlg:pt-28 px-4 font-grotesk'>
      <div className='w-full max-w-nftcom mx-auto relative'>
        <h2 className='font-bold text-black text-[40px] mb-6'>
          <span className='text-[#F9D963] mr-1'>/</span>
            My Assets
        </h2>
        <div className='flex'>
          {selectedAssets.length ?
            <div
              onClick={async () => {
                if (loading) {
                  return;
                }
                setLoading(true);
                const openseaAllowedByContract = new Map<string, boolean>();
                const looksrareAllowedByContract = new Map<string, boolean>();
                const looksrareAllowedByContract1155 = new Map<string, boolean>();
                const X2Y2AllowedByContract = new Map<string, boolean>();
                const X2Y2AllowedByContract1155 = new Map<string, boolean>();
                for (let i = 0; i < selectedAssets.length; i++) {
                  const nft = selectedAssets[i];
                  if (!openseaAllowedByContract.has(nft.contract)) {
                    const allowed = await fetchAllowance(nft.contract, TransferProxyTarget.Opensea);
                    openseaAllowedByContract.set(nft.contract, allowed);
                  }
                  if (!looksrareAllowedByContract.has(nft.contract)) {
                    const allowed = await fetchAllowance(nft.contract, TransferProxyTarget.LooksRare);
                    looksrareAllowedByContract.set(nft.contract, allowed);
                  }
                  if (!looksrareAllowedByContract1155.has(nft.contract)) {
                    const allowed = await fetchAllowance(nft.contract, TransferProxyTarget.LooksRare1155);
                    looksrareAllowedByContract1155.set(nft.contract, allowed);
                  }
                  if (!X2Y2AllowedByContract.has(nft.contract)) {
                    const allowed = await fetchAllowance(nft.contract, TransferProxyTarget.X2Y2);
                    X2Y2AllowedByContract.set(nft.contract, allowed);
                  }
                  if (!X2Y2AllowedByContract1155.has(nft.contract)) {
                    const allowed = await fetchAllowance(nft.contract, TransferProxyTarget.X2Y21155);
                    X2Y2AllowedByContract1155.set(nft.contract, allowed);
                  }
                }
                stageListings(selectedAssets?.map(nft => ({
                  nft: nft,
                  collectionName: nft?.collection?.name,
                  isApprovedForSeaport: openseaAllowedByContract.get(nft?.contract),
                  isApprovedForLooksrare: looksrareAllowedByContract1155.get(nft?.contract),
                  isApprovedForX2Y2: X2Y2AllowedByContract.get(nft?.contract),
                  isApprovedForLooksrare1155: looksrareAllowedByContract.get(nft?.contract),
                  isApprovedForX2Y21155: X2Y2AllowedByContract1155.get(nft?.contract),
                  targets: []
                })));
                setLoading(false);
                toggleCartSidebar();
              }}
              className='w-full flex items-center justify-center minlg:w-[200px] bg-[#F9D963] text-[#1F2127] font-grotesk font-bold p-2 rounded-[20px] text-center hover:cursor-pointer'
            >
              <p>{loading ? <Loader /> : 'List NFTs'}</p>
            </div>
            :
            <div className='w-full hover:cursor-not-allowed minlg:w-[200px] bg-[#F8F8F8] text-[#6F6F6F] font-grotesk font-bold p-2 rounded-[20px] text-center  '>
              <p>Select NFTs</p>
            </div>
          }
          {selectedAssets.length ?
            <div onClick={() => {setSelectedAssets([]);}} className='hover:cursor-pointer w-full minlg:w-[200px] ml-2 bg-white text-[#1F2127] font-grotesk font-bold p-2 rounded-[20px] text-center border border-[#D5D5D5]'>
              <p>Cancel</p>
            </div>
            : null
          }
        </div>
        <div className="my-8 font-grotesk rounded-md px-4 pt-4 pb-24 overflow-x-auto min-h-[370px]">
          <table className="border-collapse table-fixed w-full">
            <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
              <tr className='p-4 pt-0 pb-3 text-left ...'>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px] text-center'>
                  <input checked={selectedAssets.length === assetData.length} onChange={() => selectAllHandler()} className='border-2 border-[#6F6F6F] text-[#6F6F6F] form-checkbox focus:ring-[#F9D963]' type='checkbox' />
                </th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[300px]'>NFT Name</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[200px]'>Collection</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px]'>Status</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px]'>Purchased Price</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px]'>USD Value</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px]'>Profile</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[80px]'></th>
              </tr>
            </thead>
            <tbody className='p-4'>
              {assetData?.map((item) => (
                <AssetTableRow isChecked={selectedAssets.some((nft) => nft.tokenId === item.tokenId)} onChange={onChangeHandler} key={item.id} item={item} />
              ))}
            </tbody>
          </table>
          {loadingAssets && !assetData.length && <p className={tw(
            'h-20 w-full',
            'bg-[#F8F8F8]',
            'pl-8 flex items-center',
          )}>Loading...</p>}
          {!loadingAssets && !assetData.length && <p className={tw(
            'h-20 w-full',
            'bg-[#F8F8F8]',
            'pl-8 flex items-center',
          )}>No assets</p>}
          {cachedTotalCount !== 1 && cachedTotalCount > assetData?.length &&
            <div className='w-full flex justify-center'>
              <button onClick={() => loadMoreAssets()} className="bg-[#F9D963] font-bold tracking-normal hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full minlg:w-[250px] mt-6" type="button">
                Load More
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

