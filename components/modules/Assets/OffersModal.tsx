import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { Maybe, NftType } from 'graphql/generated/types';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { filterDuplicates, isNullOrEmpty } from 'utils/helpers';
import { getMaxMarketplaceFeesUSD, getMaxRoyaltyFeesUSD } from 'utils/marketplaceUtils';

import { OffersRow } from './OffersRow';

import { BigNumber, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useProvider, useSigner } from 'wagmi';

export interface OffersModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OffersModal(props: OffersModalProps) {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address: currentAddress } = useAccount();
  const { getByContractAddress } = useSupportedCurrencies();

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [success, setSuccess] = useState(false);

  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();

  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={''}
      onClose={() => {
        setSuccess(false);
        setShowProgressBar(false);
        props.onClose();
      }}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full overflow-hidden minlg:max-w-[550px] pb-5 h-screen minlg:h-max maxlg:h-max bg-white text-left rounded-none minlg:rounded-[20px] minlg:mt-24 minlg:m-auto'>
        <div className='font-noi-grotesk pt-5 lg:max-w-md minlg:max-w-[550px] m-auto minlg:relative'>
          <X onClick={() => {
            setSuccess(false);
            setShowProgressBar(false);
            props.onClose();
          }} className='absolute top-5 z-50 right-5 hover:cursor-pointer closeButton' size={24} color="#A0A9C1" weight="fill" />
          <div className='px-6'>
            <p className="text-[26px] font-semibold text-center font-noi-grotesk mb-5">
                Offers
            </p>
            <div className='max-h-[60vh] overflow-y-scroll hideScroll'>
              {[1,2,3,4].map((item, index) => {
                return <div key={index}>
                  <OffersRow />
                </div>;
              })}
            </div>
            <div className="mt-8 flex">
              <Button
                stretch
                label={'Close'}
                onClick={async () => {
                  setSuccess(false);
                  setShowProgressBar(false);
                  props.onClose();
                }}
                type={ButtonType.PRIMARY}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
