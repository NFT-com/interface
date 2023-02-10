import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Nft, TxActivity } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { ListingButtonType } from './ExternalListingTile';
import ExternalListingTile from './ExternalListingTile';

import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import { useCallback, useContext, useRef } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface EditListingsModalProps {
  listings: PartialDeep<TxActivity>[];
  nft: PartialDeep<Nft>;
  collectionName: string;
  visible: boolean;
  onClose: () => void;
}

export function EditListingsModal(props: EditListingsModalProps) {
  const { visible, onClose, nft, listings, collectionName } = props;

  const modalRef = useRef();
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { stageListing } = useContext(NFTListingsContext);

  useOutsideClickAlerter(modalRef, () => {
    onClose();
  });

  const {
    allowedAll: openseaAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );

  const getModalContent = useCallback(() => {
    return <div className='flex flex-col'>
      <div className="flex items-center">
        <RoundedCornerMedia
          containerClasses='w-2/4 aspect-square'
          src={processIPFSURL(nft?.metadata?.imageURL)}
          variant={RoundedCornerVariant.None}
        />
        <div className="flex flex-col px-8">
          <div className="whitespace-nowrap text-lg font-normal font-grotesk leading-6 tracking-wide text-[#1F2127]">
            {isNullOrEmpty(nft?.metadata?.name) ? 'Unknown Name' : nft?.metadata?.name}
          </div>
          <div className="whitespace-nowrap text-lg font-normal font-grotesk leading-6 tracking-wide text-[#1F2127]">
            {isNullOrEmpty(collectionName) ? 'Unknown Collection' : collectionName}
          </div>
        </div>
      </div>
      <div>
        {
          listings?.map((listing) => {
            return <ExternalListingTile
              key={listing?.id}
              listing={listing}
              nft={nft}
              collectionName={collectionName}
              buttons={[ListingButtonType.Adjust, ListingButtonType.Cancel]}
            />;
          })
        }
        <div className="flex flex-col items-center w-full p-4">
          <span className='font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4'>List item on another marketplace</span>
          <Button
            stretch
            label={'List item'}
            onClick={() => {
              stageListing({
                nft: props.nft,
                collectionName: props.collectionName,
                isApprovedForSeaport: openseaAllowed,
                isApprovedForLooksrare: looksRareAllowed,
                targets: []
              });
              router.push('/app/list');
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </div>;
  }, [
    nft,
    collectionName,
    listings,
    stageListing,
    props.nft,
    props.collectionName,
    openseaAllowed,
    looksRareAllowed,
    router
  ]);

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
      <div ref={modalRef} className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 pb-10 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='pt-20 font-grotesk lg:max-w-md max-w-lg m-auto minlg:relative'>
          <div className='absolute top-4 right-4 minlg:right-1 hover:cursor-pointer w-6 h-6 bg-[#f9d963] rounded-full'></div>
          <XCircle onClick={onClose} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer closeButton' size={32} color="black" weight="fill" />
          {<h2 className='text-4xl tracking-wide font-medium mb-10'>Edit Listings</h2>}
          {getModalContent()}
        </div>
      </div>
    </Modal>
  );
}