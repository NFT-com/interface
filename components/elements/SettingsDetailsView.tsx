import { Button, ButtonType } from 'components/elements/Button';
import Copy from 'components/elements/Copy';
import { EmailVerification } from 'components/elements/EmailVerification';
import Loader from 'components/elements/Loader';
import { Modal } from 'components/elements/Modal';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useUpdateMeMutation } from 'graphql/hooks/useUpdateMeMutation';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import validator from 'email-validator';
import Image from 'next/image';
import defaultPhoto from 'public/default_user.svg';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDropzone } from 'react-dropzone';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface SettingsDetailsViewProps {
  omitImageSection?: boolean
}

export function SettingsDetailsView(props: SettingsDetailsViewProps) {
  const {
    accent,
    inputBorder,
    primaryText,
    primaryIcon,
    secondaryText
  } = useThemeColors();
  const { fileUpload } = useFileUploadMutation();
  const { me, userEmailFound, userEmailVerified, } = useMeQuery();
  const { updateMe } = useUpdateMeMutation();

  /**
   * Draft changes to be saved.
   */
  const [usernameVal, setUsernameVal] = useState(me?.username);
  const [emailVal, setEmailVal] = useState(me?.email);
  const [imageVal, setImageVal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  const onDrop = (files: any) => {
    setImageVal({ preview: URL.createObjectURL(files[0]), raw: files[0] });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.*'],
    },
    maxFiles: 1,
  });

  if (me == null) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="flex rounded-xl p-4"
        style={{ backgroundColor: isDragActive ? accent : 'transparent', color: primaryText }}
      >
        {!props.omitImageSection && <div className="flex self-start w-full">
          <div className="flex flex-col w-full" {...getRootProps()}>
            <span style={{ color: secondaryText }}>Profile Image</span>
            <div className={tw(
              'flex mt-4 items-center',
              isMobile ? '' : 'justify-between w-full'
            )}>
              <input {...getInputProps()} />
              <Image
                alt=""
                className={tw('rounded-full', isMobile ? 'mr-6' : '')}
                style={{
                  height: '7.5rem',
                  width: '7.5rem',
                  borderWidth: '4px',
                  borderColor: primaryIcon,
                }}
                src={imageVal?.preview ?? me?.avatarURL ?? defaultPhoto}
              />
              <Button type={ButtonType.PRIMARY} label={'Update'} onClick={() => ({})} />
            </div>
          </div>
        </div>}
        <div className="flex w-full space-x-4 space-y-4 flex-wrap">
          {/* Communication */}
          <div className='flex flex-col w-[49%] deprecated_sm:w-full space-y-4 mt-4'>
            <div style={{ color: primaryText }}>
              Communication
            </div>
            <div style={{ color: secondaryText }}>
                Username
            </div>
            <div>
              <input
                className="rounded-lg w-3/4 deprecated_sm:w-full py-4 border pl-4 bg-white text-black"
                style={{
                  borderColor: inputBorder,
                }}
                disabled={false}
                value={usernameVal ?? ''}
                placeholder={me?.username}
                onChange={event => {
                  setUsernameVal(event.target.value);
                }}
              />
            </div>
      
            <div style={{ color: secondaryText }}>
                Email
            </div>
            <div>
              <input
                className="rounded-lg w-3/4 deprecated_sm:w-full py-4 border pl-4 bg-white text-black"
                style={{
                  borderColor: inputBorder,
                }}
                disabled={me?.email && userEmailVerified}
                value={emailVal ?? ''}
                placeholder={me?.email ?? 'send.me@notifications.com'}
                onChange={event => {
                  setEmailVal(event.target.value);
                }}
              />
            </div>
          </div>

          {/* Account Wallet */}
          <div className='flex flex-col w-[49%] deprecated_sm:w-full space-y-4'>
            <div style={{ color: primaryText }}>
                Wallet Addresses
            </div>
            <div style={{ color: secondaryText }}>
                Connected Wallet
            </div>
            {me?.myAddresses?.map(wallet => {
              return (
                <div
                  key={wallet.address + wallet.chainId}
                  className="rounded-lg w-full py-4 border pl-4 bg-white text-black"
                  style={{ backgroundColor: accent }}
                >
                  <Copy toCopy={wallet?.address} after keepContent>
                    <span style={{ color: primaryText }} className="mr-4 deprecated_sm:block hidden">
                      {shortenAddress(wallet?.address)}
                    </span>
                    <span style={{ color: primaryText }} className="mr-4 deprecated_sm:hidden block">
                      {wallet?.address}
                    </span>
                  </Copy>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <Modal
          visible={emailModal && (userEmailFound == null || userEmailVerified === false)}
          loading={false}
          title={'Verify Email'}
          onClose={() => {
            setEmailModal(false);
          }}
        >
          <EmailVerification
            email={validator?.validate(emailVal) ? emailVal : null}
            hideOptional={true}
          />
        </Modal>
        <div className='flex'>
          <Button type={ButtonType.PRIMARY}
            onClick={async () => {
              setLoading(true);
              const imageUploadResultURI = await fileUpload(imageVal, 'user/' + me?.id + '-photo');

              if (!me?.email || !userEmailVerified) {
                setEmailModal(true);
              } else {
                if (imageUploadResultURI) {
                  await updateMe({
                    avatarURL: imageUploadResultURI,
                  });
                }
              }

              setLoading(false);
            }}
            label="Save"
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
