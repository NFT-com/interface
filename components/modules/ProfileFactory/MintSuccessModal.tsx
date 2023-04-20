import { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useEmailCaptureModal } from 'hooks/state/useEmailCaptureModal';
import { useMintSuccessModal } from 'hooks/state/useMintSuccessModal';
import { isNullOrEmpty } from 'utils/format';

const MintProfileSuccessModal: FC = () => {
  const router = useRouter();
  const { me } = useMeQuery();
  const { mintSuccessModal, setMintSuccessModalOpen } = useMintSuccessModal();
  const { setEmailCaptureModalOpen } = useEmailCaptureModal();
  return (
    <Transition appear show={mintSuccessModal} as={Fragment}>
      <Dialog as='div' className='relative z-[105]' onClose={() => setMintSuccessModalOpen(false)}>
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
              <Dialog.Panel className='relative min-h-[560px] w-full max-w-[873px] overflow-hidden rounded-[20px] bg-white text-left align-middle shadow-xl transition-all minmd:h-[700px]'>
                <X
                  onClick={() => {
                    setMintSuccessModalOpen(false);
                    isNullOrEmpty(me?.email) && setEmailCaptureModalOpen(true);
                  }}
                  className='absolute right-5 top-5 z-10 hover:cursor-pointer'
                  size={30}
                  color='black'
                  weight='fill'
                />

                <div className='relative flex h-full flex-col minmd:flex-row'>
                  <div className='relative h-[160px] w-full bg-gradient-to-r from-[#FAC213] to-[#FF9B37] text-center minmd:h-full minmd:w-2/5'>
                    <Image
                      src='/success-modal.svg'
                      fill
                      priority
                      className='object-cover object-center'
                      alt='Mint Success'
                    />
                  </div>

                  <div className='w-full pb-8 pt-9 text-center minmd:w-3/5 minmd:pb-[178px]  minmd:pt-[158px]'>
                    <h3 className='mt text-[32px] font-medium minmd:text-[42px]'>Congratulations!</h3>
                    <div className='mt-9 text-xl font-medium minmd:mt-5 minmd:text-[22px]'>
                      <p>Cheers to your new profile!</p>
                      <p>
                        You officially own{' '}
                        <span className='bg-gradient-to-r from-[#FAC213] to-[#FF9B37] bg-clip-text font-bold text-transparent '>
                          nft.com/{router?.query?.profileURI}
                        </span>
                      </p>
                    </div>

                    <p className='mt-9 text-xl font-normal minmd:mt-20'>Let’s continue your Web3 journey</p>

                    <div className='mt-2 flex justify-center px-[47px] minmd:px-0'>
                      <Button
                        type={ButtonType.PRIMARY}
                        size={ButtonSize.LARGE}
                        label='Customize your profile'
                        onClick={() => {
                          setMintSuccessModalOpen(false);
                          isNullOrEmpty(me?.email) && setEmailCaptureModalOpen(true);
                        }}
                      />
                    </div>

                    <Link href='/app/mint-profiles' passHref legacyBehavior>
                      <a
                        onClick={() => isNullOrEmpty(me?.email) && setEmailCaptureModalOpen(true)}
                        className='mt-8 block text-lg font-medium text-[#E4BA18] underline minmd:mt-9'
                      >
                        Mint another NFT Profile
                      </a>
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
};

export default MintProfileSuccessModal;
