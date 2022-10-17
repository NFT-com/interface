import { useMintSuccessModal } from 'hooks/state/useMintSuccessModal';
import { tw } from 'utils/tw';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import { Fragment } from 'react';

export default function MintProfileSuccessModal() {
  const router = useRouter();
  const { profileSelectModal, setMintSuccessModalOpen }= useMintSuccessModal();
  return (
    <Transition appear show={profileSelectModal} as={Fragment}>
      <Dialog as="div" className="relative z-[105]" onClose={() => setMintSuccessModalOpen(false)}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full relative max-w-[873px] min-h-[560px] minmd:h-[700px] transform overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-xl transition-all">

                <X
                  onClick={() => setMintSuccessModalOpen(false)}
                  className='z-10 absolute top-5 right-5 hover:cursor-pointer'
                  size={30}
                  color="black"
                  weight="fill"
                />
                
                <div className='relative h-full flex flex-col minmd:flex-row'>
                  <div className='w-full minmd:w-2/5 h-[160px] minmd:h-full text-center bg-gradient-to-r from-[#FAC213] to-[#FF9B37] relative'>
                    <Image
                      src='/success-modal.svg'
                      layout='fill'
                      priority
                      objectFit='cover'
                      objectPosition='center'
                      alt='Mint Success'
                    />
                  </div>
                 
                  <div className='w-full minmd:w-3/5 pt-9 minmd:pt-[158px] pb-8 minmd:pb-[178px]  text-center'>
                    <h3 className='text-[32px] mt minmd:text-[42px] font-medium'>Congratulations!</h3>
                    <div className='mt-9 minmd:mt-5 font-medium text-xl minmd:text-[22px]'>
                      <p>Cheers to your first profile! </p>
                      <p>You officially own <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#FAC213] to-[#FF9B37] font-bold '>nft.com/{router?.query?.profileURI}</span></p>
                    </div>

                    <p className='mt-9 minmd:mt-20 font-normal text-xl'>Let’s continue your Web3 journey</p>

                    <div className='px-[47px] minmd:px-0'>
                      <button
                        type="button"
                        className={tw(
                          'inline-flex w-full minmd:max-w-[277px] justify-center',
                          'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                          'px-4 py-4 mt-9 minmd:mt-8 text-lg font-medium text-black',
                          'focus:outline-none focus-visible:bg-[#E4BA18]'
                        )}
                        onClick={() => setMintSuccessModalOpen(false)}
                      >
                      Customize your profile
                      </button>
                    </div>

                    <Link href='/app/mint-profiles' passHref>
                      <a className='block mt-8 minmd:mt-9 underline font-medium text-lg text-[#E4BA18]'>Mint another NFT Profile</a>
                    </Link>
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
    