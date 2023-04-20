import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useUpdateMeMutation } from 'graphql/hooks/useUpdateMeMutation';
import { useEmailCaptureModal } from 'hooks/state/useEmailCaptureModal';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

export default function EmailCaptureModal() {
  const { updateMe } = useUpdateMeMutation();
  const { mutate: mutateMeInfo } = useMeQuery();
  const { emailCaptureModal, setEmailCaptureModalOpen } = useEmailCaptureModal();
  const [isChecked, setIsChecked] = useState(false);
  const [emailValue, setEmailValue] = useState(null);

  const closeModal = () => {
    setEmailValue(null);
    setEmailCaptureModalOpen(false);
  };

  const submitHandler = async e => {
    e.preventDefault();
    const result = await updateMe({ email: emailValue });

    if (result) {
      mutateMeInfo();
      closeModal();
    }
  };

  return (
    <Transition appear show={emailCaptureModal} as={Fragment}>
      <Dialog as='div' className='relative z-[105]' onClose={() => closeModal()}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='bg-opacity/25 fixed inset-0 bg-black' />
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
              <Dialog.Panel
                className={tw(
                  'relative w-full max-w-[424px] transform overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-xl transition-all',
                  'px-4 pb-7 pt-8 minmd:px-12'
                )}
              >
                <X
                  onClick={() => closeModal()}
                  className='absolute right-5 top-5 z-10 hover:cursor-pointer'
                  size={20}
                  color='#8C939A'
                  weight='fill'
                />

                <div className='text-center font-noi-grotesk'>
                  <h3 className='mb-5 text-[32px] font-medium'>Stay tuned!</h3>

                  <p className='mb-7 px-4'>Enter your email address to receive updates & notifications</p>
                  <form onSubmit={e => submitHandler(e)}>
                    <input
                      className={tw(
                        'mb-5 max-w-[328px] text-lg',
                        'w-full rounded-lg px-3 py-3 text-left',
                        'border-0 bg-[#F8F8F8]',
                        'focus:ring-2 focus:ring-[#F9D54C]'
                      )}
                      placeholder='Enter your email'
                      autoFocus={true}
                      spellCheck={false}
                      type='email'
                      value={emailValue}
                      onChange={e => setEmailValue(e.target.value)}
                    />
                    <div className='flex'>
                      <input
                        checked={isChecked}
                        onClick={() => setIsChecked(!isChecked)}
                        type='checkbox'
                        className='mr-2 mt-1 max-w-[328px] rounded-[4px] text-black focus:ring-1 focus:ring-[#F9D54C]'
                      />
                      <p className='mb-8 text-left text-[#8F8F8F]'>
                        I have read and accept the{' '}
                        <a
                          target='_blank'
                          href='https://cdn.nft.com/nft_com_terms_of_service.pdf'
                          rel='noopener noreferrer'
                          className='font-semibold text-[#4B4B4B]'
                        >
                          Terms & Conditions
                        </a>
                      </p>
                    </div>

                    <Button
                      type={ButtonType.PRIMARY}
                      size={ButtonSize.LARGE}
                      label='Sign up'
                      stretch
                      disabled={!isChecked || isNullOrEmpty(emailValue) || emailValue === ''}
                      onClick={() => null}
                    />
                  </form>

                  <p onClick={() => closeModal()} className='mt-5 text-[#6A6A6A] hover:cursor-pointer'>
                    Skip
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
