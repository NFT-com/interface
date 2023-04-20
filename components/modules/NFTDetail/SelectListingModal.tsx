import { useCallback, useRef } from 'react';
import { X } from 'phosphor-react';
import { PartialDeep } from 'type-fest';

import { Modal } from 'components/elements/Modal';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { isNullOrEmpty } from 'utils/format';

import ExternalListingTile, { ListingButtonType } from './ExternalListingTile';

export interface SelectListingsModalProps {
  listings: PartialDeep<TxActivity>[];
  nft: PartialDeep<Nft>;
  collectionName: string;
  visible: boolean;
  onClose: () => void;
}

export function SelectListingModal(props: SelectListingsModalProps) {
  const { visible, onClose, nft, listings, collectionName } = props;

  const modalRef = useRef();
  useOutsideClickAlerter(modalRef, () => {
    onClose();
  });

  const getModalContent = useCallback(() => {
    return (
      <div className='flex flex-col font-noi-grotesk'>
        <div className='flex items-center'>
          <RoundedCornerMedia
            containerClasses='w-2/4 aspect-square'
            src={nft?.metadata?.imageURL}
            variant={RoundedCornerVariant.None}
          />
          <div className='flex flex-col px-8'>
            <div className='whitespace-nowrap font-noi-grotesk text-lg font-normal leading-6 tracking-wide text-[#1F2127]'>
              {isNullOrEmpty(nft?.metadata?.name) ? 'Unknown Name' : nft?.metadata?.name}
            </div>
            <div className='whitespace-nowrap font-noi-grotesk text-lg font-normal leading-6 tracking-wide text-[#1F2127]'>
              {isNullOrEmpty(collectionName) ? 'Unknown Collection' : collectionName}
            </div>
          </div>
        </div>
        <div>
          {listings?.map((listing, index) => {
            return (
              <ExternalListingTile
                key={(listing?.id ?? '') + index}
                listing={listing}
                nft={nft}
                collectionName={collectionName}
                buttons={[ListingButtonType.AddToCart]}
                onClose={onClose}
              />
            );
          })}
        </div>
      </div>
    );
  }, [nft, collectionName, listings, onClose]);

  return (
    <Modal visible={visible} loading={false} title={''} onClose={onClose} bgColor='white' hideX fullModal pure>
      <div
        ref={modalRef}
        className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-5 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[20px]'
      >
        <div className='m-auto max-w-lg font-noi-grotesk minlg:relative lg:max-w-md'>
          <X
            onClick={onClose}
            className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
            size={32}
            color='black'
            weight='fill'
          />
          {<h2 className='mb-10 text-4xl font-medium tracking-wide'>Select Listing</h2>}
          {getModalContent()}
        </div>
      </div>
    </Modal>
  );
}
