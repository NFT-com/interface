import { useGetSentReferralEmailsQuery } from 'graphql/hooks/useGetSentReferralEmailsQuery';
import { useSendReferEmailMutation } from 'graphql/hooks/useSendReferEmailMutation';
import { useUser } from 'hooks/state/useUser';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import OnboardingInput from './OnboardingInput';

import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import NftGoldLogo from 'public/nft_gold_logo.svg';
import { Fragment } from 'react';

type OnboardingItemProps = {
  isCompleted: boolean;
  name: string;
  coins: number;
  description?: string;
  buttonText?: string;
  href?: string;
};

interface OnboardingActionModalProps {
  selectedItem : OnboardingItemProps;
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

export default function OnboardingSecondaryModal({ selectedItem, modalOpen, setModalOpen }: OnboardingActionModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const { sendReferEmail } = useSendReferEmailMutation();
  const { data, mutate: mutateSentReferrals } = useGetSentReferralEmailsQuery(user.currentProfileUrl);

  const handleSubmit = (e, value) => {
    e.preventDefault();
    sendReferEmail(user.currentProfileUrl, [value]).then(res => console.log(res));
    mutateSentReferrals();
  };
  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[105] w-full" onClose={() => setModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed top-[10%] overflow-y-auto w-full max-w-full">
          <div className="flex min-h-full items-start justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[463px] max-w-full transform overflow-hidden rounded-[20px] bg-white align-middle shadow-xl transition-all text-center">
                <div className='flex flex-col font-medium relative text-center'>
                  <X className='absolute right-2 top-2 hover:cursor-pointer' size={20} onClick={() => setModalOpen(false)} />
                  <Dialog.Title
                    as="h3"
                    className="text-[24px] leading-6 text-gray-900 mt-9"
                  >
                    {selectedItem?.name}
                  </Dialog.Title>

                  <p className='mt-3 text-[#6A6A6A] w-4/5 mx-auto'>{selectedItem?.description}</p>
                  <div className='flex flex-col mt-9'>
                    <p className='text-[#B2B2B2]'>Rewards</p>

                    <div className='bg-[#FFF4CA] w-max rounded-full flex items-center py-1 pl-4 pr-1 mx-auto mt-2 mb-9'>
                  +{selectedItem?.coins}
                      <div className='h-[24px] w-[24px] minmd:h-[34px] minmd:w-[34px] ml-[5px]'>
                        <NftGoldLogo />
                      </div>
                    </div>

                    {selectedItem?.name === 'Refer Network' &&
                      <div className='flex flex-col px-7 mb-10 space-y-4'>
                        {Array.from(Array(5).keys()).map((_, index) => (
                          <OnboardingInput key={index} index={index} item={data && data[index]} onSubmit={handleSubmit} />
                        ))}
                      </div>
                    }

                    <button
                      onClick={() => !isNullOrEmpty(selectedItem?.href) ? router.push(selectedItem?.href) : setModalOpen(false) }
                      type="button"
                      className={tw(
                        'inline-flex w-1/3 mx-auto justify-center items-center',
                        'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                        'font-medium text-black py-2 px-4',
                        'focus:outline-none focus-visible:bg-[#E4BA18]',
                        'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C] mb-10'
                      )}
                    >
                      {selectedItem?.buttonText ? selectedItem.buttonText : selectedItem?.name}
                    </button>
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
    