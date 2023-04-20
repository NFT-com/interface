import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ContractTransaction } from 'ethers';
import { CheckCircle, Clock, DotsThreeOutlineVertical, XCircle } from 'phosphor-react';
import { mutate } from 'swr';
import { useAccount, useNetwork } from 'wagmi';

import CustomTooltip from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { useIgnoredEventsQuery } from 'graphql/hooks/useIgnoredEventsQuery';
import { useUpdateHideIgnored } from 'graphql/hooks/useUpdateHideIgnored';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { filterNulls } from 'utils/format';
import { getEtherscanLink, shortenAddress } from 'utils/helpers';

import RemoveModal from './RemoveModal';

type AssociatedAddressProps = {
  address: string;
  pending?: boolean;
  rejected?: boolean;
  submit?: (address: string) => void;
  isOpen?: boolean;
  setIsOpen?: (input: boolean) => void;
  eventId?: string;
  selectedProfile: string;
};

export default function AssociatedAddress({
  address,
  pending,
  rejected,
  submit,
  eventId,
  selectedProfile
}: AssociatedAddressProps) {
  const { address: currentAddress } = useAccount();
  const { mutate: mutateHidden } = useIgnoredEventsQuery({
    profileUrl: selectedProfile,
    walletAddress: currentAddress
  });
  const { updateHideIgnored } = useUpdateHideIgnored();
  const { nftResolver } = useAllContracts();
  const { chain } = useNetwork();
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [txPending, setTxPending] = useState(false);

  const removeHandler = useCallback(async () => {
    if (rejected) {
      updateHideIgnored({ hideIgnored: true, eventIdArray: [eventId] })
        .then(() => {
          mutateHidden();
          setRemoveModalVisible(false);
          toast.success('Removed');
        })
        .catch(() => toast.error('Error'));
    } else {
      await nftResolver
        .removeAssociatedAddress({ cid: 0, chainAddr: address }, selectedProfile)
        .then(async (tx: ContractTransaction) => {
          setTxPending(true);
          await tx.wait(1).then(() => {
            toast.success('Removed');
            setTxPending(false);
            setRemoveModalVisible(false);
            // todo: refactor state management in settings page so we don't have to use a general mutator.
            mutate(`SettingsAssociatedAddresses${selectedProfile}${currentAddress}`);
          });
        })
        .catch(() => toast.error('Error'));
    }
  }, [address, currentAddress, eventId, mutateHidden, nftResolver, rejected, selectedProfile, updateHideIgnored]);

  return (
    <>
      <div className='mb-1 flex justify-between p-1 font-mono text-sm'>
        <div className='row flex items-center'>
          {pending || rejected ? (
            pending ? (
              <CustomTooltip
                orientation='right'
                tooltipComponent={
                  <div className='max-w-xs rounded-xl bg-modal-bg-dk p-3 text-white'>
                    <p className='mb-2 text-[#F2890E]'>Pending</p>
                    <p>This address association is waiting approval.</p>
                  </div>
                }
              >
                <Clock data-cy='PendingAssociation' size={25} className='mr-3' color='orange' weight='fill' />
              </CustomTooltip>
            ) : (
              <CustomTooltip
                orientation='right'
                tooltipComponent={
                  <div className='max-w-xs rounded-xl bg-modal-bg-dk p-3 text-white'>
                    <p className='mb-2 text-[#D50909]'>Rejected</p>
                    <p>
                      This address has rejected the association. If this was done in error, please resend the request.
                      No gas is required.
                    </p>
                  </div>
                }
              >
                <XCircle data-cy='RejectedAssociation' size={25} className='mr-3' color='#D40909' weight='fill' />
              </CustomTooltip>
            )
          ) : (
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='max-w-xs rounded-xl bg-modal-bg-dk p-3 text-white'>
                  <p className='mb-2 text-[#00AC30]'>Associated</p>
                  <p>This address has approved the NFT Profile association. </p>
                </div>
              }
            >
              <CheckCircle
                data-cy='ApprovedAssociation'
                size={25}
                className='mr-3 rounded-full'
                color='green'
                weight='fill'
              />
            </CustomTooltip>
          )}
        </div>

        <div className='mr-4 flex w-1/2 items-center truncate'>
          <p className='truncate text-black'>{shortenAddress(address)}</p>
        </div>

        <div className='flex w-1/2 items-center justify-between'>
          <p>Ethereum</p>
          <DropdownPickerModal
            constrain
            selectedIndex={0}
            options={filterNulls([
              {
                label: 'Remove',
                onSelect: () => setRemoveModalVisible(true),
                icon: null
              },
              {
                label: 'View on Etherscan',
                onSelect: () => {
                  window.open(getEtherscanLink(chain?.id, address, 'address'));
                },
                icon: null
              },
              rejected && {
                label: 'Resend Request',
                onSelect: () => submit(address),
                icon: null
              }
            ])}
          >
            <DotsThreeOutlineVertical
              data-cy='AssociationDropdown'
              size={25}
              weight='fill'
              className='ml-2 text-black hover:cursor-pointer'
            />
          </DropdownPickerModal>
        </div>
      </div>
      {removeModalVisible && (
        <RemoveModal
          {...{ address }}
          isTxPending={txPending}
          remove={removeHandler}
          rejected={rejected}
          visible={removeModalVisible}
          setVisible={setRemoveModalVisible}
        />
      )}
    </>
  );
}
