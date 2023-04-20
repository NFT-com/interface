import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import { RelatedProfilesStructOutput } from 'constants/typechain/Nft_resolver';
import { PendingAssociationOutput } from 'graphql/generated/types';

import AssociatedProfile from './AssociatedProfile';

type RemovedProfileAssociation = {
  hidden: boolean;
  id: string;
  owner: string;
  url: string;
};

type ConnectedProfilesProps = {
  associatedProfiles: {
    pending: PartialDeep<PendingAssociationOutput>[];
    accepted: RelatedProfilesStructOutput[];
    removed: PartialDeep<RemovedProfileAssociation>[];
  };
};

export default function ConnectedProfiles({ associatedProfiles }: ConnectedProfilesProps) {
  const { address: currentAddress } = useAccount();
  return (
    <div id='profiles' className='w-full font-noi-grotesk'>
      <h2 className='mb-1 font-noi-grotesk text-2xl font-bold tracking-wide text-black'>Manage Address</h2>
      <p className='mb-4 text-blog-text-reskin'>
        The following NFT Profiles have requested to associate to your address. Only approve those you would like to
        give permission to display your NFTs.
      </p>
      <div>
        <p className='mb-2 font-semibold text-blog-text-reskin'>Associated Profiles</p>

        {(!associatedProfiles?.accepted?.length &&
          !associatedProfiles?.pending?.length &&
          !associatedProfiles?.removed?.length) ||
        !currentAddress ? (
          <p className='text-sm font-medium'>No profile association requests</p>
        ) : (
          <p className='mb-2 text-sm font-medium text-blog-text-reskin'>Profile Name</p>
        )}
        {currentAddress && (
          <>
            {associatedProfiles?.accepted?.map((profile, index) => (
              <AssociatedProfile profile={profile} key={index} />
            ))}
            {associatedProfiles?.pending?.map((profile, index) => (
              <AssociatedProfile profile={profile} pending key={index} />
            ))}
            {associatedProfiles?.removed?.map((profile, index) => (
              <AssociatedProfile profile={profile} isRemoved key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
