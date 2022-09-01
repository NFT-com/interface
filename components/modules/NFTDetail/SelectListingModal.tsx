import { Modal } from 'components/elements/Modal';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { ExternalListingTile, ListingButtonType } from './ExternalListingTile';

import { XCircle } from 'phosphor-react';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';

export interface SelectListingsModalProps {
  listings: PartialDeep<TxActivity>[];
  nft: PartialDeep<Nft>;
  collectionName: string;
  visible: boolean;
  onClose: () => void;
}

export function SelectListingModal(props: SelectListingsModalProps) {
  const { visible, onClose, nft, listings, collectionName } = props;

  const getModalContent = useCallback(() => {
    return <div className='flex flex-col'>
      <div className="flex items-center">
        <RoundedCornerMedia
          containerClasses='w-2/4 aspect-square'
          src={processIPFSURL(nft?.metadata?.imageURL)}
          variant={RoundedCornerVariant.All}
          amount={RoundedCornerAmount.Medium}
        />
        <div className="flex flex-col px-8">
          <div className="whitespace-nowrap text-lg font-normal font-grotesk text-[#1F2127]">
            {isNullOrEmpty(collectionName) ? 'Unknown Collection' : collectionName}
          </div>
          <div className="whitespace-nowrap text-lg font-bold font-grotesk text-[#1F2127]">
            {isNullOrEmpty(nft?.metadata?.name) ? 'Unknown Name' : nft?.metadata?.name}
          </div>
        </div>
      </div>
      <div>
        {
          listings?.map((listing, index) => {
            return <ExternalListingTile
              key={listing?.id + index}
              listing={listing}
              nft={nft}
              collectionName={collectionName}
              buttons={[ListingButtonType.AddToCart, ListingButtonType.View]}
            />;
          })
        }
      </div>
    </div>;
  }, [nft, collectionName, listings]);

  return (
    <Modal
      visible={visible}
      loading={false}
      title={''}
      onClose={onClose}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 pb-10 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='pt-20 font-grotesk lg:max-w-md max-w-lg m-auto minlg:relative'>
          <div className='absolute top-4 right-4 minlg:right-1 hover:cursor-pointer w-6 h-6 bg-[#f9d963] rounded-full'></div>
          <XCircle onClick={onClose} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer' size={32} color="black" weight="fill" />
          {<h2 className='text-4xl tracking-wide font-medium mb-10'>Select Listing</h2>}
          {getModalContent()}
        </div>
      </div>
    </Modal>
  );
}