import { CustomTooltip } from 'components/elements/CustomTooltip';
import { Modal } from 'components/elements/Modal';
import { useIgnoreAssociationsMutation } from 'graphql/hooks/useIgnoreAssociationsMutation';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getEtherscanLink, shortenAddress } from 'utils/helpers';

import { CheckCircle, Clock, GasPump, Trash, XCircle } from 'phosphor-react';
import { useState } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { toast } from 'react-toastify';
import { ExternalLink } from 'styles/theme';
import { useNetwork } from 'wagmi';

type AssociatedProfileProps = {
  profile: {
    profileUrl?: string;
    addr?: string;
    owner?: string;
    url?: string;
    id?: string
  }
  pending?: boolean;
  remove?: (type: string, address: string) => void
};

export default function AssociatedProfile({ profile, pending, remove }: AssociatedProfileProps) {
  const { mutate: mutatePending } = usePendingAssociationQuery();
  const { ignoreAssociations } = useIgnoreAssociationsMutation();
  const [rejected, setRejected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const { chain } = useNetwork();
  const { nftResolver } = useAllContracts();

  const acceptPendingProfile = async (e, url) => {
    e.preventDefault();
    await nftResolver.associateSelfWithUsers([url])
      .then(() => setAccepted(true))
      .catch((e) => console.log(e));
  };

  const rejectPendingProfile = async (input) => {
    await ignoreAssociations({ eventIdArray: input })
      .then(() => {setVisible(true); setRejected(true); toast.success('Rejected');})
      .catch(() => toast.warning('Error. Please try again'));
  };

  const closeModal = () => {
    if(rejected){
      setRejected(false);
    }
    if(accepted){
      setAccepted(false);
    }
    mutatePending();
    setVisible(false);
  };
  
  return (
    <>
      <div className='p-1 flex justify-between items-start mb-3'>
        <div className='flex items-start truncate'>
          {pending ?
            <CustomTooltip
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white"
                >
                  <p className='text-[#F2890E] mb-2'>Pending</p>
                  <p>This connection is waiting your approval. Click on the Profile name to approve or reject.</p>
                </div>
              }
            >
              <Clock size={25} className='mr-3' color='orange' weight='fill' />
            </CustomTooltip>
            :
            <CustomTooltip
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white"
                >
                  <p className='text-[#00AC30] mb-2'>Connected</p>
                  <p>You have authorized this connection.</p>
                </div>
              }
            >
              <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
            </CustomTooltip>
          }
          <div className='w-3/4'>
            <p onClick={pending ? () => setVisible(true) : null} className='truncate text-black text-sm font-grotesk font-semibold tracking-wide'>{profile.profileUrl || profile.url}</p>
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
          <Trash size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' onClick={() => pending ? rejectPendingProfile(profile.id) : remove('profile', profile[1] || profile.profileUrl || profile.url)} />
        </div>
      </div>

      <Modal
        visible={visible}
        loading={false}
        title={''}
        onClose={() => {
          setVisible(false);
        }}
        bgColor='white'
        hideX
      >
        <div className='max-w-[458px] h-max bg-white text-left px-4 pb-10 rounded-[10px]'>
          <div className='pt-16 font-grotesk lg:max-w-md max-w-lg m-auto relative'>
            <XCircle onClick={() => closeModal()} className='absolute top-3 right-0 hover:cursor-pointer' size={32} color="#B6B6B6" weight="fill" />
            {!rejected ?
              (
                !accepted
                  ? (
                    <div>
                      <h2 className='text-4xl tracking-wide font-bold mb-10'>Approve Request</h2>
                      <p className='text-[#6F6F6F] mb-4'>
                        <span className='text-black font-bold tracking-wide'>
                          {profile.profileUrl || profile.url}{' '}
                        </span>
                        is requesting to connect your wallet to their profile.
                      </p>
                      <p className='text-[#6F6F6F]'>This profile is owned by wallet address</p>
                      <ExternalLink
                        href={getEtherscanLink(chain?.id, profile.addr || profile.owner, 'address')}
                      >
                        <div
                          className='flex font-mono text-black text-sm font-bold tracking-wide mb-4'
                        >
                          {shortenAddress(profile?.addr || profile?.owner)}
                          <LinkIcon size={18} className='ml-2'/>
                        </div>
                      </ExternalLink>

                      <p className='text-[#6F6F6F]'>
                If you approve this request, your NFTs will be available to display on their profile’s gallery. <span className='text-black font-bold tracking-wide'>{profile.profileUrl || profile.url}{' '}</span> will <span className='text-black font-bold tracking-wide'>NOT</span> be able to make any changes to your wallet or its contents. You can change this connection at any time in your account’s settings.
                      </p>
                      <button onClick={(e) => acceptPendingProfile(e, profile.profileUrl || profile.url)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                Approve Request
                      </button>
                      <div className='flex items-center font-grotesk text-blog-text-reskin justify-center mt-2 mb-6 text-sm'>
                        <GasPump size={20} weight="fill" />
                        <p className='ml-1'>This action will require a gas fee.</p>
                      </div>
                      <p className='underline text-center font-bold tracking-wide hover:cursor-pointer' onClick={() => {pending ? rejectPendingProfile(profile.id) : remove('profile', profile[1] || profile.profileUrl || profile.url); setRejected(true);}}>Reject Request</p>
                    </div>
                  )
                  :
                  (
                    <div>
                      <h2 className='text-4xl tracking-wide font-bold mb-10'>Profile Connected</h2>
                      <p className='text-[#6F6F6F] mb-4'>
                        Congratulations! You have connected the profile{' '}
                        <span className='text-black font-bold tracking-wide'>{profile.profileUrl || profile.url}{' '}</span>
                        to your wallet.
                      </p>
                      <p className='text-[#6F6F6F] mb-4'>
                        As a reminder, your NFTs will be available to display on their profile’s gallery.{' '}
                        <span className='text-black font-bold tracking-wide'>
                          {profile.profileUrl || profile.url}{' '}
                        </span>
                        will
                        <span className='text-black font-bold tracking-wide'>
                          {' '}NOT{' '}
                        </span>
                        be able to make any changes to your wallet or its contents. </p>
                      <p className='text-[#6F6F6F]'>
                        You can change this connection at any time in your account’s settings.
                      </p>
                      <button onClick={() => closeModal()} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                        Return to NFT.com
                      </button>
                    </div>
                  )
              )
              :
              (
                <div>
                  <h2 className='text-4xl tracking-wide font-bold mb-10'>Profile Rejected</h2>
                  <p className='text-[#6F6F6F] mb-4'>
                    You have denied wallet access to the profile
                    <span className='text-black font-bold tracking-wide'>{' '}{profile.profileUrl || profile.url}</span>
                  </p>
                  <p className='text-[#6F6F6F]'>Your NFTs will not display on their profile’s gallery.</p>
                  
                  <button onClick={() => closeModal()} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                    Return to NFT.com
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </Modal>
    </>
  );
}
    