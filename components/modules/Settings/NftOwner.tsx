import ProfileCard from 'components/modules/Sidebar/ProfileCard';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

type NftOwnerProps = {
  selectedProfile: string
}

export default function NftOwner({ selectedProfile }: NftOwnerProps) {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  return (
    <div id="owner" className='md:mt-10 mt-0 font-grotesk'>
      <h2 className='text-black mb-2 font-bold md:text-2xlz text-4xl tracking-wide'>NFT Owner</h2>
      <p className='mb-4 text-[#6F6F6F]'>Select which profile will display as the owner for your NFTs and collections.</p>

      {selectedProfile !== '' && <ProfileCard showSwitch profile={myOwnedProfileTokens?.find(t => t.title === selectedProfile)} />}
    </div>
  );
}
