import { useCallback, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import ClientOnly from 'components/elements/ClientOnly';
import { Modal } from 'components/elements/Modal';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NULL_ADDRESS } from 'constants/addresses';
import { Nft, TxActivity } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { isNullOrEmpty } from 'utils/format';

import { ExternalProtocol } from 'types';

import ExternalListingTile, { ListingButtonType } from './ExternalListingTile';

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

  const { allowedAll: openseaAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const { allowedAll: looksRareAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );

  const { allowedAll: looksRareAllowed1155 } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare1155
  );

  const { allowedAll: X2Y2Allowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.X2Y2
  );

  const { allowedAll: X2Y2Allowed1155 } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.X2Y21155
  );

  const { allowedAll: NFTCOMAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.NFTCOM
  );

  const getModalContent = useCallback(() => {
    return (
      <div className='flex flex-col'>
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
          {listings?.map(listing => {
            return (
              <ExternalListingTile
                key={listing?.id}
                listing={listing}
                nft={nft}
                collectionName={collectionName}
                buttons={[ListingButtonType.Adjust, ListingButtonType.Cancel]}
              />
            );
          })}
          <div className='flex w-full flex-col items-center p-4'>
            <span className='mb-4 items-center font-noi-grotesk text-base font-semibold leading-6 text-[#1F2127]'>
              List item on another marketplace
            </span>
            <Button
              stretch
              size={ButtonSize.LARGE}
              label={'List item'}
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  collectionName: props.collectionName,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  isApprovedForLooksrare1155: looksRareAllowed1155,
                  isApprovedForX2Y2: X2Y2Allowed,
                  isApprovedForX2Y21155: X2Y2Allowed1155,
                  isApprovedForNFTCOM: NFTCOMAllowed,
                  targets: [
                    {
                      protocol: ExternalProtocol.NFTCOM,
                      currency: NULL_ADDRESS,
                      listingError: false
                    }
                  ]
                });
                router.push('/app/list');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      </div>
    );
  }, [
    nft,
    collectionName,
    listings,
    stageListing,
    props.nft,
    props.collectionName,
    openseaAllowed,
    looksRareAllowed,
    looksRareAllowed1155,
    X2Y2Allowed,
    X2Y2Allowed1155,
    NFTCOMAllowed,
    router
  ]);

  return (
    <ClientOnly>
      <Modal visible={visible} loading={false} title={''} onClose={onClose} bgColor='white' hideX fullModal pure>
        <div
          ref={modalRef}
          className='hideScroll max-w-full overflow-y-scroll rounded-none bg-white px-4 pb-5 text-left minlg:m-auto minlg:mt-24 minlg:h-[80vh] minlg:max-w-[458px] minlg:rounded-[20px]'
        >
          <div className='m-auto max-w-lg font-noi-grotesk minlg:relative lg:max-w-md'>
            <X
              onClick={onClose}
              className='closeButton absolute right-3 hover:cursor-pointer minlg:right-0'
              size={32}
              color='black'
              weight='fill'
            />
            {<h2 className='mb-10 mt-6 text-4xl font-medium tracking-wide'>Edit Listings</h2>}
            {getModalContent()}
          </div>
        </div>
      </Modal>
    </ClientOnly>
  );
}
