import AssociatedAddress from './AssociatedAddress';
import SettingsForm from './SettingsForm';

type Address = {
  chainAddr: string;
}

type ConnectedCollectionsProps = {
  selectedProfile: string;
  associatedCollections : {
    pending: Address[];
    accepted: Address[];
  };
  removeHandler: (type: string, address: string) => void
  hasDeployerWallet: boolean
  deployerWallet: {
    pending: Address[];
    accepted: Address[];
  }
};

export default function ConnectedCollections({ selectedProfile, associatedCollections, removeHandler, hasDeployerWallet, deployerWallet }: ConnectedCollectionsProps) {
  return (
    <>
      <div className='mt-8 font-grotesk'>
        <h3 className='text-base font-semibold tracking-wide mb-1'>Deployer Wallet</h3>
        <p className='text-blog-text-reskin mb-4'>Enter the wallet you have deployed your NFT collection from.</p>

        {!hasDeployerWallet ? <SettingsForm selectedProfile={selectedProfile} type="request" buttonText='Request Connection' /> : null}

        {deployerWallet?.accepted?.length || deployerWallet?.pending?.length
          ? (
            <div className='mt-4 md:w-full w-3/4'>
              <div className='p-1 flex  justify-between mb-1'>
                <p className='w-1/2 mr-[3.1rem] text-blog-text-reskin text-sm'>Address</p>
                <p className='w-1/2 text-blog-text-reskin text-sm'>Network</p>
              </div>

              {associatedCollections?.accepted.map((address, index)=> (
                <AssociatedAddress key={index} address={address.chainAddr} remove={removeHandler} />
              ))}
              {associatedCollections?.pending.map((address, index)=> (
                <AssociatedAddress pending key={index} address={address.chainAddr} remove={removeHandler} />
              ))}
            </div>
          )
          : null}
      </div>

      {hasDeployerWallet && (
        <div id="wallets" className='mt-8 font-grotesk'>
          <h3 className='text-base font-semibold tracking-wide mb-1'>NFT Collection</h3>
          <p className='text-blog-text-reskin mb-4'>Enter the NFT collection you want to display on your profile.</p>

          <SettingsForm selectedProfile={selectedProfile} type="request" buttonText='Request Connection' />

          {associatedCollections?.accepted?.length || associatedCollections?.pending?.length
            ? (
              <div className='mt-4 md:w-full w-3/4'>
                <div className='p-1 flex  justify-between mb-1'>
                  <p className='w-1/2 mr-[3.1rem] text-blog-text-reskin text-sm'>Address</p>
                  <p className='w-1/2 text-blog-text-reskin text-sm'>Network</p>
                </div>

                {associatedCollections?.accepted.map((address, index)=> (
                  <AssociatedAddress key={index} address={address.chainAddr} remove={removeHandler} />
                ))}
                {associatedCollections?.pending.map((address, index)=> (
                  <AssociatedAddress pending key={index} address={address.chainAddr} remove={removeHandler} />
                ))}
              </div>
            )
            : null}
        </div>
      )}
    </>
  );
}
  