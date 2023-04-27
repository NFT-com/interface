import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { modalTypeEnum,useNonProfileModal } from 'hooks/state/useNonProfileModal';

import NoProfileComment from './NoProfileComment';
import NoProfileLike from './NoProfileLike';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import router from 'next/router';
import React from 'react';
import { Doppler, getEnvBool } from '../../../utils/env';

export default function NonProfileModal(){
  const { isOpen, modalType, setNonProfileData } = useNonProfileModal();
  const { openConnectModal } = useConnectModal();

  const checkModalType = () => {
    switch (modalType) {
    case modalTypeEnum.Like: return <NoProfileLike/>;
    case modalTypeEnum.Comment: return <NoProfileComment/>;
    }
  };

  return (
    <Modal
      dark={false}
      pure
      closeBtnNoPaddings={true}
      visible={isOpen}
      loading={false}
      title={''}
      onClose={() => setNonProfileData(false)}>
      <div className="p-20 text-4xl flex items-center flex-col font-noi-grotesk">
        {checkModalType()}
        <Button
          size={ButtonSize.XLARGE}
          stretch
          label={'Create profile'}
          type={ButtonType.PRIMARY}
          onClick={() => {
            setNonProfileData(false);
            router.push('/app/mint-profiles');
          }}/>
        <div className="mt-4 text-xl	text-[#6A6A6A]">
          Already have an account?
          <span onClick={() => {
            openConnectModal();
            setNonProfileData(false);
          }}>
            <a className='text-black hover:text-[#6A6A6A] cursor-pointer font-medium'> Sign in</a>
          </span>
        </div>
      </div>
    </Modal>
  );
}
