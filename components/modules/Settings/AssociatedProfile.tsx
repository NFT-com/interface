import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getEtherscanLink, shortenAddress } from 'utils/helpers';

import { CheckCircle, Clock, Trash } from 'phosphor-react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { ExternalLink } from 'styles/theme';
import { useNetwork } from 'wagmi';

type AssociatedProfileProps = {
  profile: {
    profileUrl?: string;
    addr?: string;
    owner?: string;
    url?: string;
  }
  pending?: boolean;
  key: number | string;
  remove?: (type: string, address: string) => void
};

export default function AssociatedProfile({ profile, pending, remove }: AssociatedProfileProps) {
  const { chain } = useNetwork();
  const { nftResolver } = useAllContracts();

  const acceptPendingProfile = async (e, url) => {
    e.preventDefault();
    await nftResolver.associateSelfWithUsers([url]).then((res) => console.log(res));
  };
  return (
    <div className='p-1 flex justify-between items-start mb-3'>
      <div className='flex items-start truncate'>
        {pending ?
          <Clock size={25} className='mr-3' color='orange' weight='fill' />
          :
          <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
        }
        <div className='w-3/4'>
          <p onClick={(e) => pending && acceptPendingProfile(e, profile.url) } className='truncate text-black text-sm font-grotesk font-semibold tracking-wide'>{profile.profileUrl || profile.url}</p>
          <div className="flex items-center w-full">
            <div className="flex w-full items-center justify-between">
              <div>
                <ExternalLink
                  href={getEtherscanLink(chain?.id, profile.addr || profile.owner, 'address')}
                >
                  <div
                    className='flex justify-between font-mono text-blog-text-reskin text-sm font-medium'
                  >
                    {shortenAddress(profile?.addr || profile?.owner)}
                    <LinkIcon size={18} className='ml-2'/>
                  </div>
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className='flex items-center'>
        <Trash size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' onClick={() => remove(pending ? 'profile-pending' : 'profile', profile[1] || profile.profileUrl)} />
      </div>
    </div>
  );
}
    