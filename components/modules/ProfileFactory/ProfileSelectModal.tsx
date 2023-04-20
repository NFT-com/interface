import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { CheckCircle, X } from 'phosphor-react';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useProfileSelectModal } from 'hooks/state/useProfileSelectModal';
import { useUser } from 'hooks/state/useUser';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import KeyIcon from 'public/icons/mint-key.svg?svgr';

export default function ProfileSelectModal() {
  const { profileSelectModal, setProfileSelectModalOpen } = useProfileSelectModal();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { user, setCurrentProfileUrl } = useUser();
  const { claimable } = useClaimableProfileCount(currentAddress);
  const claimableSum = claimable?.reduce((acc, curr) => acc + curr.claimable, 0);

  return (
    <Transition appear show={profileSelectModal} as={Fragment}>
      <Dialog as='div' className='relative z-[105]' onClose={() => setProfileSelectModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-[524px] overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-xl transition-all'>
                <X
                  onClick={() => setProfileSelectModalOpen(false)}
                  className='absolute right-5 top-5 z-10 hover:cursor-pointer'
                  size={20}
                  color='#8C939A'
                  weight='fill'
                />

                <div className='mx-auto max-h-max rounded-[20px] bg-white px-4 pb-10 pt-[60px] font-medium minmd:px-12 minmd:pt-[64px] minlg:px-[65px]'>
                  <h3 className='text-[32px] font-medium'>Select NFT Profile</h3>
                  <p className=' my-6 text-xl font-normal minmd:my-9'>Please select your primary NFT Profile</p>

                  <div className='h-max max-h-[300px] overflow-auto'>
                    {myOwnedProfileTokens &&
                      myOwnedProfileTokens.map(profile => (
                        <div
                          className='mb-4 flex h-14 items-center justify-between rounded-xl bg-[#F8F8F8] px-4 py-2 hover:cursor-pointer'
                          key={profile?.metadata.name}
                          onClick={() => {
                            setCurrentProfileUrl(profile?.metadata.name);
                            setProfileSelectModalOpen(false);
                          }}
                        >
                          <div className='flex flex-row items-center gap-[14px]'>
                            <RoundedCornerMedia
                              extraClasses='mr-4'
                              containerClasses='h-10 w-10'
                              src={profile?.metadata.image}
                              variant={RoundedCornerVariant.All}
                              height={40}
                              width={40}
                              amount={RoundedCornerAmount.Medium}
                            />
                            <p>{profile?.metadata.name}</p>
                          </div>
                          {user.currentProfileUrl === profile?.metadata.name && (
                            <CheckCircle size={28} color='#2AAE47' weight='fill' />
                          )}
                        </div>
                      ))}
                  </div>
                  <p className='my-3 flex items-center font-normal text-[#5B5B5B]'>
                    {claimable && (
                      <>
                        <KeyIcon className='mr-3 inline h-9 w-9' stroke='black' />
                        Minted {(claimable?.length ?? 0) * 4 - claimableSum} out of {(claimable?.length ?? 0) * 4} free
                        NFT Profiles
                      </>
                    )}
                  </p>
                  <Link href='/app/mint-profiles'>
                    <Button
                      label='Add NFT Profile'
                      disabled={claimableSum === 0}
                      type={ButtonType.PRIMARY}
                      size={ButtonSize.LARGE}
                      onClick={() => null}
                      stretch
                    />
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
