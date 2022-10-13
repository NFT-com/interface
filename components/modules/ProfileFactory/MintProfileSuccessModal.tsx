import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function RemoveModal() {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-[105]" onClose={null}>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-end p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[873px] transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className='flex flex-row'>
                  <div className='w-1/2 h-full'></div>
                  <div className='w-1/2'>
                    <h3>Congratulations!</h3>
                    <p>Cheers to your first profile! </p>
                    <p>You officially own nft.com/johndoe</p>

                    <p>Let’s continue your Web3 journey</p>
                    <button>Customize your profile</button>

                    <p>Mint another NFT Profile</p>
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
    