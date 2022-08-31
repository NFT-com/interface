import { ProfileContext, ProfileContextProvider } from 'components/modules/Profile/ProfileContext';
import { useUser } from 'hooks/state/useUser';

import AssetTableRow from './AssetTableRow';

import { useContext } from 'react';

export default function AssetsPages() {
  const { getCurrentProfileUrl }= useUser();
  const selectedProfile = getCurrentProfileUrl();
  const {
    allOwnerNfts,
    // allOwnerNftCount,
    // loadMoreNfts,
  } = useContext(ProfileContext);
  console.log('🚀 ~ file: Assets.tsx ~ line 15 ~ Assets ~ allOwnerNfts', allOwnerNfts);
  return (
    <ProfileContextProvider
      key={selectedProfile}
      profileURI={selectedProfile}
    >
      <div className='min-h-screen flex flex-col justify-between overflow-x-hidden pt-28 px-4 font-grotesk'>
        <div className='w-full max-w-nftcom mx-auto'>
          <h2 className='font-bold text-black text-[40px] mb-6'>
            <span className='text-[#F9D963]'>/</span>
            My Assets
          </h2>
          <div className='w-full bg-[#F8F8F8] text-[#6F6F6F] font-grotesk font-bold p-2 rounded-[20px] text-center'>
            <p>Select NFTs</p>
          </div>
        
          <table className="min-w-full border-x-0 mt-9">
            <thead>
              <tr className="text-body leading-body font-body text-[#7F7F7F]">
                <th scope="col" className="flex items-center minmd:text-body text-sm leading-body font-body"></th>
                <th scope="col" className='text-left minmd:text-body text-sm leading-body font-body'>Name</th>
                <th scope="col" className='text-left minmd:text-body text-sm leading-body font-body'>Status</th>
                <th scope="col" className='text-left minmd:text-body text-sm leading-body font-body'>Purchased Price</th>
                <th scope="col" className='text-left minmd:text-body text-sm leading-body font-body'>USD Value</th>
                <th scope="col" className='text-left minmd:text-body text-sm leading-body font-body'>Profile</th>
                <th scope="col" className="flex items-center minmd:text-body text-sm leading-body font-body"></th>
              </tr>
            </thead>
            <tbody className="bg-always-white">
              {allOwnerNfts?.map((item, i) => (
                <AssetTableRow key={i} item={item} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProfileContextProvider>
  );
}

