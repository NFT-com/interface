import AssociatedAddress from './AssociatedAddress';
import SettingsForm from './SettingsForm';

type Address = {
  chainAddr: string;
}

type ConnectedAccountsProps = {
  selectedProfile: string; //local state
  associatedAddresses : {
    pending: Address[];
    accepted: Address[];
  };
  remove: (type: string, address: string) => void
};

export default function ConnectedAccounts({ selectedProfile, associatedAddresses, remove }: ConnectedAccountsProps) {
  return (
    <div id="wallets" className='mt-8 font-grotesk'>
      <h3 className='text-base font-semibold tracking-wide mb-1'>Connected Wallets</h3>
      <p className='text-blog-text-reskin mb-4'>Display NFTs from other Ethereum wallets on your profile.</p>
      
      <SettingsForm selectedProfile={selectedProfile} type="request" buttonText='Request Connection' />

      {associatedAddresses?.accepted?.length || associatedAddresses?.pending?.length
        ? (
          <div className='mt-4 md:w-full w-3/4'>
            <div className='p-1 flex  justify-between mb-1'>
              <p className='w-1/2 mr-[3.1rem] text-blog-text-reskin text-sm'>Address</p>
              <p className='w-1/2 text-blog-text-reskin text-sm'>Network</p>
            </div>

            {associatedAddresses?.accepted.map((address, index)=> (
              <AssociatedAddress key={index} address={address} remove={remove} />
            ))}
            {associatedAddresses?.pending.map((address, index)=> (
              <AssociatedAddress pending key={index} address={address} remove={remove} />
            ))}
          </div>
        )
        : null}
    </div>
  );
}
  