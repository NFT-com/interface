import AssociatedProfile from './AssociatedProfile';

type Profile = {
  profileUrl: string;
  addr: string;
}

type RemovedProfileAssociation = {
  hidden: boolean;
  id: string;
  owner: string;
  url: string;
}

type ConnectedProfilesProps = {
  associatedProfiles : {
    pending: Profile[];
    accepted: Profile[];
    removed: RemovedProfileAssociation[];
  };
};

export default function ConnectedProfiles({ associatedProfiles }: ConnectedProfilesProps) {
  return (
    <div id="profiles" className='mt-10 w-full'>
      <h2 className='font-grotesk tracking-wide font-bold text-black text-2xl mb-1'>Connected Profiles</h2>
      <p className='text-blog-text-reskin mb-4'>These NFT Profiles have requested to display the NFTs from your address.</p>
      <div>
        <p className='text-blog-text-reskin mb-2 text-sm'>Profile Name</p>
        {!associatedProfiles?.accepted?.length && !associatedProfiles?.pending?.length && (
          <p className='text-sm font-medium'>No connection requests</p>
        )}
        {associatedProfiles?.accepted?.map((profile, index)=> (
          <AssociatedProfile profile={profile} key={index}/>
        ))}
        {associatedProfiles?.pending?.map((profile, index)=> (
          <AssociatedProfile {...{ profile }} pending key={index} />
        ))}
        {associatedProfiles?.removed?.map((profile, index)=> (
          <AssociatedProfile {...{ profile }} isRemoved key={index} />
        ))}
      </div>
    </div>
  );
}
  