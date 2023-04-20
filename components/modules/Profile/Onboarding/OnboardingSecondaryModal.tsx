import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useGetSentReferralEmailsQuery } from 'graphql/hooks/useGetSentReferralEmailsQuery';
import { useSendReferEmailMutation } from 'graphql/hooks/useSendReferEmailMutation';
import { useUser } from 'hooks/state/useUser';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';

import OnboardingInput from './OnboardingInput';

const BlurImage = dynamic(import('components/elements/BlurImage'));

type OnboardingItemProps = {
  isCompleted: boolean;
  name: string;
  coins: number;
  description?: string;
  buttonText?: string;
  href?: string;
};

interface OnboardingActionModalProps {
  selectedItem: OnboardingItemProps;
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

export default function OnboardingSecondaryModal({
  selectedItem,
  modalOpen,
  setModalOpen
}: OnboardingActionModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const { sendReferEmail } = useSendReferEmailMutation();
  const { data, mutate: mutateSentReferrals } = useGetSentReferralEmailsQuery(user.currentProfileUrl);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e, value, index) => {
    setErrorMessage(null);
    e.preventDefault();
    sendReferEmail(user.currentProfileUrl, [value])
      .then(res =>
        res.sentEmails.includes(value)
          ? setSuccess(index)
          : setErrorMessage([index, 'This user was previously referred. Please try a different email.'])
      )
      .then(() => {
        mutateSentReferrals();
        gtag('event', 'Sent Email Referral', {
          sentReferralAddress: value,
          profile: user.currentProfileUrl
        });
      })
      .catch(e => setErrorMessage([index, e.message]));
  };

  useEffect(() => {
    modalOpen === true;
    setErrorMessage(null);
    setSuccess(null);
  }, [modalOpen]);

  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[105] w-full' onClose={() => setModalOpen(false)}>
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

        <div className='fixed top-[10%] w-full max-w-full overflow-y-auto'>
          <div className='flex min-h-full items-start justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-[463px] max-w-full overflow-hidden rounded-[20px] bg-white text-center align-middle shadow-xl transition-all'>
                <div className='relative flex flex-col text-center font-medium'>
                  <X
                    className='absolute right-4 top-4 hover:cursor-pointer'
                    size={24}
                    onClick={() => setModalOpen(false)}
                  />
                  <Dialog.Title as='h3' className='mt-5 text-[24px] leading-6 text-gray-900'>
                    {selectedItem?.name}
                  </Dialog.Title>

                  <p className='mx-auto mt-3 w-4/5 text-[#6A6A6A]'>{selectedItem?.description}</p>
                  <div className='mt-9 flex flex-col'>
                    {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_POINTS_ENABLED) && (
                      <p className='text-[#B2B2B2]'>Rewards</p>
                    )}

                    {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_POINTS_ENABLED) && (
                      <div className='mx-auto mb-9 mt-2 flex w-max items-center rounded-full bg-[#FFF4CA] py-1 pl-4 pr-1'>
                        +{selectedItem?.coins}
                        <div className='ml-[5px] h-[24px] w-[24px] minmd:h-[34px] minmd:w-[34px]'>
                          <BlurImage
                            alt='default profile photo'
                            src='/assets/nft_profile_default.webp'
                            fill
                            localImage
                          />
                        </div>
                      </div>
                    )}

                    {selectedItem?.name === 'Refer Network' && (
                      <div className='mb-10 flex flex-col space-y-4 px-7'>
                        {Array.from(Array(5).keys()).map((_, index) => (
                          <OnboardingInput
                            key={index}
                            index={index}
                            item={data && data[index]}
                            onSubmit={handleSubmit}
                            errorMessage={errorMessage && errorMessage[0] === index && errorMessage[1]}
                            success={success === index}
                          />
                        ))}
                      </div>
                    )}

                    <div className='mb-10 px-7'>
                      <Button
                        onClick={() =>
                          !isNullOrEmpty(selectedItem?.href) ? router.push(selectedItem?.href) : setModalOpen(false)
                        }
                        label={selectedItem?.buttonText ? selectedItem.buttonText : selectedItem?.name}
                        type={ButtonType.PRIMARY}
                        size={ButtonSize.LARGE}
                        stretch
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
