import Loader from 'components/elements/Loader';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { ProfileContext } from 'components/modules/Profile/ProfileContext';
import { Nft } from 'graphql/generated/types';
import { useFetchNftCollectionAllowance } from 'hooks/balances/useFetchNftCollectionAllowance';
import { TransferProxyTarget } from 'hooks/balances/useNftCollectionAllowance';

import AssetTableRow from './AssetTableRow';

import { useCallback, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';

export default function AssetsPages() {
  const { stageListings, toggleCartSidebar } = useContext(NFTListingsContext);
  const [selectedAssets, setSelectedAssets] = useState<Array<PartialDeep<Nft>>>([]);
  const [loading, setLoading] = useState(false);
  const {
    allOwnerNfts,
  } = useContext(ProfileContext);
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
    if (selectedAssets.length === allOwnerNfts.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets([...allOwnerNfts]);
    }
  }, [allOwnerNfts, selectedAssets.length]);

  return (
    <div className='flex flex-col justify-between pt-28 px-4 font-grotesk'>
      <div className='w-full max-w-nftcom mx-auto relative'>
        <h2 className='font-bold text-black text-[40px] mb-6'>
          <span className='text-[#F9D963]'>/</span>
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
                }
                stageListings(selectedAssets?.map(nft => ({
                  nft: nft,
                  collectionName: nft?.collection?.name,
                  isApprovedForSeaport: openseaAllowedByContract.get(nft?.contract),
                  isApprovedForLooksrare: looksrareAllowedByContract.get(nft?.contract),
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
        <div className="my-8 font-grotesk rounded-md px-4 pt-4 pb-24 overflow-x-auto">
          <table className="border-collapse table-fixed w-full">
            <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
              <tr className='p-4 pt-0 pb-3 text-left ...'>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4 pr-8 minmd:pr-4 w-[100px] text-center'>
                  <input checked={selectedAssets.length === allOwnerNfts.length} onChange={() => selectAllHandler()} className='border-2 border-[#6F6F6F] text-[#6F6F6F] form-checkbox focus:ring-[#F9D963]' type='checkbox' />
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
              {allOwnerNfts?.map((item, i) => (
                item.isOwnedByMe && <AssetTableRow isChecked={selectedAssets.some((nft) => nft.tokenId === item.tokenId)} onChange={onChangeHandler} key={item.id} item={item} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

