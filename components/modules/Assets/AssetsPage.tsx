import { ProfileContext } from 'components/modules/Profile/ProfileContext';
import { useUser } from 'hooks/state/useUser';

import AssetTableRow from './AssetTableRow';

import { useContext, useState } from 'react';

export default function AssetsPages() {
  const { getCurrentProfileUrl }= useUser();
  const selectedProfile = getCurrentProfileUrl();
  const [selectedAssets, setSelectedAssets] = useState([]);
  const {
    allOwnerNfts,
    publiclyVisibleNfts,
  } = useContext(ProfileContext);

  const onChangeHandler = (asset) => {
    const index = selectedAssets.findIndex((item) => item.id === asset.id);
    if(index !== -1) {
      setSelectedAssets(selectedAssets.filter((_, i) => i !== index));
    } else {
      setSelectedAssets([...selectedAssets, asset]);
    }
  };

  const selectAllHandler = () => {
    if(selectedAssets?.length === allOwnerNfts?.length){
      setSelectedAssets([]);
    } else {
      setSelectedAssets(allOwnerNfts);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-between overflow-x-hidden pt-28 px-4 font-grotesk'>
      <div className='w-full max-w-nftcom mx-auto relative'>
        <h2 className='font-bold text-black text-[40px] mb-6'>
          <span className='text-[#F9D963]'>/</span>
            My Assets
        </h2>
        {selectedAssets.length ?
          <div className='w-full minlg:w-[200px] bg-[#F9D963] text-[#1F2127] font-grotesk font-bold p-2 rounded-[20px] text-center'>
            <p>List NFTs</p>
          </div>
          :
          <div className='w-full minlg:w-[200px] bg-[#F8F8F8] text-[#6F6F6F] font-grotesk font-bold p-2 rounded-[20px] text-center'>
            <p>Select NFTs</p>
          </div>
        }
        <div className="overflow-x-auto my-8 font-grotesk rounded-md p-4">
          <table className="border-collapse table-auto w-full">
            <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
              <tr className='p-4 pt-0 pb-3 text-left ...'>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6  flex items-center h-[30px] w-full justify-center mr-4'>
                  <input checked={allOwnerNfts?.length && selectedAssets?.length === allOwnerNfts?.length} onChange={() => selectAllHandler()} className='border-2 border-[#6F6F6F]' type='checkbox' />
                </th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4'>Name</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4'>Status</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4'>Purchased Price</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4'>USD Value</th>
                <th className='text-[#6F6F6F] text-sm font-medium leading-6 pb-4'>Profile</th>
              </tr>
            </thead>
            <tbody className='p-4'>
              {allOwnerNfts?.map((item, i) => (
                <AssetTableRow isChecked={selectedAssets.some((i) => i.tokenId === item.tokenId)} onChange={onChangeHandler} key={item.id} item={item} index={i} isVisibile={publiclyVisibleNfts.some((i) => i.id === item.id)} profile={selectedProfile} />
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

