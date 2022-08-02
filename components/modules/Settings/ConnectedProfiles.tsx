import AssociatedProfile from './AssociatedProfile';

type Profile = {
  profileUrl: string;
  addr: string;
}

type ConnectedProfilesProps = {
  associatedProfiles : {
    pending: Profile[];
    accepted: Profile[];
  };
  removeHandler: (type: string, address: string) => void
  rejected: boolean
  setRejected: (isRejected: boolean) => void
};

export default function ConnectedProfiles({ associatedProfiles, removeHandler, rejected, setRejected }: ConnectedProfilesProps) {
  return (
    <div id="profiles" className='mt-10 md:w-full w-3/4'>
      <h2 className='font-grotesk tracking-wide font-bold text-black md:text-2xl text-4xl mb-1'>Connected Profiles</h2>
      <p className='text-blog-text-reskin mb-4'>These profiles have requested access to your wallet to display your NFTs.</p>
      <div>
        <p className='text-blog-text-reskin mb-2 text-sm'>Profile Name</p>
        {!associatedProfiles?.accepted?.length && !associatedProfiles?.pending?.length && (
          <p className='text-sm font-medium'>No connection requests</p>
        )}
        {associatedProfiles?.accepted?.map((profile, index)=> (
          <AssociatedProfile profile={profile} key={index} remove={removeHandler} />
        ))}
        {associatedProfiles?.pending?.map((profile, index)=> (
          <AssociatedProfile {...{ profile, rejected, setRejected }} pending key={index} remove={removeHandler} />
        ))}
      </div>
    </div>
  );
}
  