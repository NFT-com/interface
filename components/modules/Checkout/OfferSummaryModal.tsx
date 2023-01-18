import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Maybe } from 'graphql/generated/types';
import { Nft } from 'graphql/generated/types';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { Check, X } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';

export interface OfferSummaryModalProps {
  visible: boolean;
  nft: PartialDeep<Nft>;
  selectedCurrency: SupportedCurrency;
  selectedPrice: BigNumber;
  selectedExpirationOption: number;
  expirationOptions: string[];
  onClose: () => void;
}

export function OfferSummaryModal(props: OfferSummaryModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Maybe<'ConnectionError'>>(null);
    
  const getSummaryContent = useCallback(() => {
    if (success) {
      return <div className="flex flex-col w-full py-5">
        <p className="text-[24px] mx-4 text-center font-semibold">
          Approved
        </p>
        
        <div className='flex items-center justify-center w-full'>
          <div className="flex max-w-[200px] w-full max-h-[200px] my-10 h-full object-contain drop-shadow-lg aspect-square">
            <RoundedCornerMedia
              key={props.nft?.id}
              src={processIPFSURL(props.nft?.metadata?.imageURL)}
              videoOverride={true}
              variant={RoundedCornerVariant.Success}
              objectFit='contain'
              extraClasses='rounded'
              containerClasses='h-full w-full' />
            <Check className={'absolute bottom-[-7px] right-[-7px] z-20 h-7 w-7 p-1 text-white font-medium aspect-square shrink-0 rounded-full -ml-4 bg-[#26AA73]'} />
          </div>
        </div>
        
        <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

        <div className='px-4 flex items-center justify-between w-full'>
          <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Offer Submitted</div>
          <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</div>
        </div>

        <div className='px-4 flex items-center text-center justify-between w-full text-[#B2B2B2]'>
          You will be notified on response.
        </div>
        
      </div>;
    } else if (!isNullOrEmpty(error)) {
      return <div className='flex flex-col w-full'>
        <div className="text-3xl mx-4 font-bold">
          Offer Failed
          <div className='w-full my-8'>
            <span className='font-medium text-[#6F6F6F] text-base'>
              {error === 'ConnectionError' && 'Your wallet is not connected. Please connect your wallet and try again.'}
            </span>
          </div>
        </div>
      </div>;
    }
    
    // Cost Summary, Default view
    return <div className="flex flex-col w-full py-5">
      <p className="text-[24px] mx-4 text-center font-semibold">
        Review Bid
      </p>
      <div className="mx-4 my-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className='text-[16px] flex text-[#4D4D4D]'>Bid Amount</span>
        </div>
        <div className="flex flex-col align-end">
          <span className='text-[16px] flex text-[#4D4D4D]'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</span>
        </div>
      </div>
      <div className="mx-4 my-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className='text-[16px] flex text-[#4D4D4D]'>Bid Expiration</span>
        </div>
        <div className="flex flex-col align-end">
          <span className='text-[16px] flex text-[#4D4D4D]'>{props.expirationOptions?.[props.selectedExpirationOption]}</span>
        </div>
      </div>

      <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

      <div className='px-4 flex items-center justify-between w-full'>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Subtotal</div>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</div>
      </div>

      <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

      <div className='px-4 flex items-center justify-between w-full'>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Total</div>
        <div className='text-[16px] flex text-[#4D4D4D] font-medium mb-1 mt-3'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</div>
      </div>
    </div>;
  }, [error, props.expirationOptions, props.nft?.id, props.nft?.metadata?.imageURL, props.selectedCurrency, props.selectedExpirationOption, props.selectedPrice, success]);

  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={''}
      onClose={() => {
        setSuccess(false);
        setLoading(false);
        setError(null);
        props.onClose();
      }}
      bgColor='bg-transparent'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full overflow-hidden minlg:max-w-[500px] px-4 pb-5 h-screen minlg:h-max maxlg:h-max bg-white text-left rounded-none minlg:rounded-[20px] minlg:mt-24 minlg:m-auto'>
        <div className='font-noi-grotesk pt-3 w-full m-auto minlg:relative'>
          <X onClick={() => {
            setSuccess(false);
            setLoading(false);
            setError(null);
            props.onClose();
          }} className='absolute top-5 right-5 z-50 hover:cursor-pointer closeButton' size={24} color="#B2B2B2" weight="fill" />
          {getSummaryContent()}
          <Button
            stretch
            disabled={loading && !error && !success}
            loading={loading && !error && !success}
            label={success ? 'Check Offers' : error ? 'Try Again' : 'Approve'}
            onClick={async () => {
              if (success) {
                setSuccess(false);
                props.onClose();
                router.push('/app/assets');
              }

              setError(null);
              setSuccess(false);
              setLoading(true);

              // TODO: submit private offer
              setSuccess(true);
              setLoading(false);
            }}
            type={ButtonType.PRIMARY} />
          {!success && <div className='w-full mt-4'>
            <Button
              stretch
              label={'Cancel'}
              onClick={() => {
                setSuccess(false);
                setLoading(false);
                setError(null);
                props.onClose();
              }}
              type={ButtonType.SECONDARY}
            />
          </div>}
        </div>
      </div>
    </Modal>
  );
}