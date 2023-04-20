import { useCallback, useContext, useState } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { toast } from 'react-toastify';
import { ArrowsClockwise, CheckCircle, Clock, DotsThreeOutlineVertical, GasPump, XCircle } from 'phosphor-react';
import { mutate } from 'swr';
import { useAccount, useNetwork } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import CustomTooltip from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Modal } from 'components/elements/Modal';
import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useIgnoreAssociationsMutation } from 'graphql/hooks/useIgnoreAssociationsMutation';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useUpdateHiddenMutation } from 'graphql/hooks/useUpdateHiddenMutation';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { filterNulls } from 'utils/format';
import { getEtherscanLink, shortenAddress } from 'utils/helpers';

import { ExternalLink } from 'styles/theme';

import RemoveModal from './RemoveModal';

type AssociatedProfileProps = {
  profile: {
    profileUrl?: string;
    addr?: string;
    owner?: string;
    url?: string;
    id?: string;
  };
  pending?: boolean;
  remove?: () => void;
  isCollection?: boolean;
  isRemoved?: boolean;
};

export default function AssociatedProfile({
  profile,
  pending,
  remove,
  isCollection,
  isRemoved
}: AssociatedProfileProps) {
  const { mutate: mutatePending } = usePendingAssociationQuery();
  const { ignoreAssociations } = useIgnoreAssociationsMutation();
  const [visible, setVisible] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [associationRejected, setAssociationRejected] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const { chain } = useNetwork();
  const { nftResolver } = useAllContracts();
  const { setUserNotificationActive } = useContext(NotificationContext);
  const { address: currentAddress } = useAccount();
  const { updateHidden } = useUpdateHiddenMutation();

  const acceptPendingProfile = useCallback(
    async (e, url) => {
      e.preventDefault();

      const tx = await nftResolver.associateSelfWithUsers([url]);
      setTransactionPending(true);
      if (tx) {
        await tx
          .wait(1)
          .then(() => {
            setAccepted(true);
            setTransactionPending(false);
            gtag('event', 'Accepted Profile Association', {
              ethereumAddress: currentAddress,
              profile: url
            });
          })
          .catch(() => toast.error('Error'));
        setUserNotificationActive('associatedProfileAdded', true);
      }
    },
    [nftResolver, setUserNotificationActive, currentAddress]
  );

  const removeHandler = useCallback(async () => {
    if (pending) {
      await ignoreAssociations({ eventIdArray: [profile.id] })
        .then(() => {
          setVisible(true);
          setAssociationRejected(true);
          toast.success('Rejected');
          gtag('event', 'Reject Profile Association', {
            ethereumAddress: currentAddress,
            profile
          });
        })
        .catch(() => toast.warning('Error. Please try again'));
    } else if (isRemoved) {
      updateHidden({ eventIdArray: [profile.id], hidden: true }).then(() => {
        toast.success('Removed');
        setVisible(true);
        setAssociationRejected(true);
      });
    } else {
      const tx = await nftResolver.removeAssociatedProfile(profile[1] || profile.profileUrl || profile.url);
      setTransactionPending(true);
      if (tx) {
        await tx
          .wait(1)
          .then(() => {
            gtag('event', 'Remove Profile Association', {
              ethereumAddress: currentAddress,
              profile
            });
            setTransactionPending(false);
            setRemoveModalVisible(false);
            toast.success('Removed');
            setUserNotificationActive('associatedProfileRemoved', true);
            setAssociationRejected(true);
          })
          .catch(() => toast.warning('Error. Please try again'));
      }
    }
  }, [
    ignoreAssociations,
    isRemoved,
    nftResolver,
    pending,
    profile,
    setUserNotificationActive,
    updateHidden,
    currentAddress
  ]);

  const closeModal = useCallback(() => {
    if (associationRejected) {
      setAssociationRejected(false);
    }
    if (accepted) {
      setAccepted(false);
    }
    mutate(`SettingsAssociatedProfiles${currentAddress}`);
    mutatePending();
    setVisible(false);
  }, [accepted, associationRejected, mutatePending, currentAddress]);

  return (
    <>
      <div className='mb-3 flex items-start justify-between p-1'>
        <div className='flex items-start'>
          {pending ? (
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='max-w-xs p-3'>
                  <p className='mb-2 text-[#F2890E]'>Pending</p>
                  <p>This NFT Profile association is waiting your approval. Click on its name to approve or reject.</p>
                </div>
              }
            >
              <Clock data-cy='PendingProfile' size={25} className='mr-3' color='orange' weight='fill' />
            </CustomTooltip>
          ) : isRemoved ? (
            isRemoved && isCollection ? (
              <XCircle size={25} className='mr-3' color='#D40909' weight='fill' />
            ) : (
              <CustomTooltip
                orientation='right'
                tooltipComponent={
                  <div className='max-w-xs p-3'>
                    <p className='mb-2 text-[#D40909]'>Disassociated</p>
                    <p>
                      This NFT Profile has been disassociated from your address. It is safe to remove it from your
                      account.
                    </p>
                  </div>
                }
              >
                <XCircle data-cy='RemovedProfile' size={25} className='mr-3' color='#D40909' weight='fill' />
              </CustomTooltip>
            )
          ) : (
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='max-w-xs p-3'>
                  <p className='mb-2 text-[#00AC30]'>Associated</p>
                  <p>You have associated your address with this NFT Profile.</p>
                </div>
              }
            >
              <CheckCircle
                data-cy='ApprovedProfile'
                size={25}
                className='mr-3 rounded-full'
                color='green'
                weight='fill'
              />
            </CustomTooltip>
          )}
          <div className='w-3/4'>
            <p
              onClick={pending ? () => setVisible(true) : null}
              className='truncate font-noi-grotesk text-sm font-semibold tracking-wide text-black'
            >
              {profile.profileUrl || profile.url}
            </p>
            <div className='flex w-full items-center'>
              <div className='flex w-full items-center justify-between'>
                <div>
                  {isCollection && isRemoved ? (
                    <p className='mt-1 text-sm text-[#6F6F6F]'>
                      The deployer wallet associated to this collection has been disconnected from your account. Please
                      connect another collection.
                    </p>
                  ) : (
                    <ExternalLink href={getEtherscanLink(chain?.id, profile.addr || profile.owner, 'address')}>
                      <div className='flex justify-between font-mono text-sm font-medium text-blog-text-reskin'>
                        {shortenAddress(profile?.addr || profile?.owner)}
                        <LinkIcon size={18} className='ml-2' />
                      </div>
                    </ExternalLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center'>
          <DropdownPickerModal
            constrain
            selectedIndex={0}
            options={filterNulls([
              isCollection && {
                label: 'Change Collection',
                onSelect: () => remove(),
                icon: null
              },
              !isCollection &&
                pending && {
                  label: 'Approve',
                  onSelect: () => setVisible(true),
                  icon: null
                },
              !isCollection && {
                label: pending ? 'Reject' : 'Remove',
                onSelect: () => setRemoveModalVisible(true),
                icon: null
              },
              !isCollection && {
                label: 'View on Etherscan',
                onSelect: () => {
                  window.open(getEtherscanLink(chain?.id, profile.addr || profile.owner, 'address'));
                },
                icon: null
              }
            ])}
          >
            <DotsThreeOutlineVertical
              data-cy='ProfileDropdown'
              size={25}
              weight='fill'
              className='ml-2 text-black hover:cursor-pointer'
            />
          </DropdownPickerModal>
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
        fullModal
        pure
      >
        <div className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-10 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
          <div className='m-auto max-w-lg pt-16 font-noi-grotesk minlg:relative lg:max-w-md'>
            <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#F9D963] hover:cursor-pointer minlg:right-1'></div>
            <XCircle
              onClick={() => setVisible(false)}
              className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
              size={32}
              color='black'
              weight='fill'
            />
            {transactionPending ? (
              <>
                <div className='mb-10 flex items-center'>
                  <ArrowsClockwise size={32} color='#6f6f6f' weight='fill' className='mr-2 animate-spin-slow' />
                  <h2 className='text-4xl font-bold tracking-wide'>One second...</h2>
                </div>

                <p className='text-[#6F6F6F]'>We’re waiting for the transaction to complete.</p>
              </>
            ) : !associationRejected ? (
              !accepted ? (
                <div>
                  <h2 className='mb-10 text-4xl font-bold tracking-wide'>Approve Request</h2>
                  <p className='mb-4 text-[#6F6F6F]'>
                    <span className='font-bold tracking-wide text-black'>{profile.profileUrl || profile.url} </span>
                    is requesting to associate your address to their NFT Profile.
                  </p>
                  <p className='text-[#6F6F6F]'>This profile is owned by address</p>
                  <ExternalLink href={getEtherscanLink(chain?.id, profile.addr || profile.owner, 'address')}>
                    <div className='mb-4 flex font-mono text-sm font-bold tracking-wide text-black'>
                      {shortenAddress(profile?.addr || profile?.owner)}
                      <LinkIcon size={18} className='ml-2' />
                    </div>
                  </ExternalLink>

                  <p className='mb-3 text-[#6F6F6F]'>
                    If you approve this request, your NFTs will be available to display on their profile{"'"}s gallery.
                    <span className='font-bold tracking-wide text-black'> {profile.profileUrl || profile.url} </span>
                    will <span className='font-bold tracking-wide text-black'>NOT</span> be able to make any changes to
                    your address or its contents. You can change this connection at any time in your account’s settings.
                  </p>
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Approve Request'
                    onClick={e => acceptPendingProfile(e, profile.profileUrl || profile.url)}
                    stretch
                  />
                  <div className='mb-6 mt-2 flex items-center justify-center font-noi-grotesk text-sm text-blog-text-reskin'>
                    <GasPump size={20} weight='fill' />
                    <p className='ml-1'>
                      This action will require a
                      <span className='border-b	border-dashed border-[#6F6F6F]'> gas fee.</span>
                    </p>
                  </div>
                  <p
                    className='text-center font-bold tracking-wide underline hover:cursor-pointer'
                    onClick={() => {
                      setRemoveModalVisible(true);
                      setVisible(false);
                    }}
                  >
                    Reject Request
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className='mb-10 text-4xl font-bold tracking-wide'>Profile Connected</h2>
                  <p className='mb-4 text-[#6F6F6F]'>
                    Congratulations! You have associated the NFT Profile{' '}
                    <span className='font-bold tracking-wide text-black'>{profile.profileUrl || profile.url} </span>
                    to your address.
                  </p>
                  <p className='mb-4 text-[#6F6F6F]'>
                    As a reminder, your NFTs will be available to display on their NFT Profile’s gallery.{' '}
                    <span className='font-bold tracking-wide text-black'>{profile.profileUrl || profile.url} </span>
                    will
                    <span className='font-bold tracking-wide text-black'> NOT </span>
                    be able to make any changes to your address or its contents.{' '}
                  </p>
                  <p className='mb-6 text-[#6F6F6F]'>
                    You can change this association at any time in your account’s settings.
                  </p>
                  <Button
                    label='Return to NFT.com'
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    stretch
                    onClick={closeModal}
                  />
                </div>
              )
            ) : (
              <div>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Profile Rejected</h2>
                <p className='mb-4 text-[#6F6F6F]'>
                  You have denied access to the NFT Profile
                  <span className='font-bold tracking-wide text-black'> {profile.profileUrl || profile.url}</span>
                </p>
                <p className='mb-6 text-[#6F6F6F]'>Your NFTs will not display on their NFT Profile`&apos;`s gallery.</p>

                <Button
                  onClick={closeModal}
                  size={ButtonSize.LARGE}
                  type={ButtonType.PRIMARY}
                  stretch
                  label='Return to NFT.com'
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
      {removeModalVisible && (
        <RemoveModal
          isTxPending={transactionPending}
          isProfile
          isRemoved={isRemoved}
          rejected={pending}
          visible={removeModalVisible}
          setVisible={setRemoveModalVisible}
          profileUrl={profile.profileUrl || profile.url}
          address={profile.owner || profile.addr}
          remove={removeHandler}
        />
      )}
    </>
  );
}
