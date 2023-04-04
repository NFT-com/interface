import Loader from 'components/elements/Loader/Loader';
import { PropertyCard } from 'components/modules/NFTDetail/PropertyCard';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { useGenesisKeyOwner } from 'hooks/useGenesisKeyOwner';
import { formatID, getEtherscanLink, getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { XIcon } from '@heroicons/react/solid';
import { BigNumber, BigNumberish } from 'ethers';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import BackgroundTraitIcon from 'public/genesis_key_background_trait_icon.svg?svgr';
import GlitchIcon from 'public/genesis_key_glitch_icon.svg?svgr';
import PaintBrush from 'public/genesis_key_paint_brush.svg?svgr';
import StandIcon from 'public/genesis_key_stand_icon.svg?svgr';
import CTAKeyIcon from 'public/key_icon.svg?svgr';
import UserIcon from 'public/logo-user-sign-in.svg?svgr';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Download } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useNetwork } from 'wagmi';

const traitIcons = {
  'Owner': <UserIcon fill='black' stroke="black" />,
  'Profile Mints Remaining': <UserIcon fill='black' stroke="black" />,
  'Key Id': <CTAKeyIcon fill='black' stroke="black" />,
  'Key Body': <CTAKeyIcon fill='black' stroke="black" />,
  'Key Blade': <CTAKeyIcon fill='black' stroke="black" />,
  'Key Handle': <CTAKeyIcon fill='black' stroke="black" />,
  'Material': <PaintBrush fill='black' stroke="black" />,
  'Stand': <StandIcon fill='black' stroke="black" />,
  'Background': <BackgroundTraitIcon fill='black' stroke="black" />,
  'Glitch': <GlitchIcon fill='black' stroke="black" />,
};

export interface GenesisKeyGalleryDetailViewProps {
  id: BigNumberish;
  onClose: () => void;
  verticalDetail?: boolean;
  hideCloseButton?: boolean;
}

export function GenesisKeyGalleryDetailView(props: GenesisKeyGalleryDetailViewProps) {
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { profileAuction } = useAllContracts();
  const genesisKeyMetadata = useGenesisKeyMetadata(BigNumber.from(props.id));
  const { primaryIcon, secondaryIcon } = useThemeColors();
  const { owner } = useGenesisKeyOwner(BigNumber.from(props.id));
  const [isDownloading, setIsDownloading] = useState(false);

  const userIsOwner = sameAddress(currentAddress, owner) ?? false;

  const [claimableProfileCount, setClaimableProfileCount] = useState(null);

  useEffect(() => {
    (async () => {
      const [
        isWhitelistPhaseOnly, claimedByThisTokenId
      ] = await Promise.all([
        profileAuction.genKeyWhitelistOnly().catch(() => true),
        profileAuction.genesisKeyClaimNumber(props.id).catch(() => null)
      ]);

      if (claimedByThisTokenId != null) {
        const claimable = (isWhitelistPhaseOnly ? 4 : 7) - claimedByThisTokenId?.toNumber();
        setClaimableProfileCount(claimable);
      }
    })();
  }, [profileAuction, props.id]);

  return (
    <div className={tw(
      'bg-white dark:bg-black',
      props.verticalDetail ? 'flex flex-col items-center max-w-nftcom' : 'flex flex-col minmd:flex-row max-w-nftcom',
      'text-primary-txt dark:text-primary-txt-dk',
    )}>
      {props.hideCloseButton !== true && <div className={tw(
        'pt-8 pr-8 absolute right-0 top-0 flex minmd:hidden z-50'
      )} onClick={props.onClose}>
        <XIcon
          className="h-6 w-6 cursor-pointer"
          aria-hidden="true"
          style={{ color: primaryIcon }}
        />
      </div>}
      <div className={tw(
        props.verticalDetail ? 'minmd:w-3/4 w-full' : 'minmd:w-1/2 w-full',
        props.verticalDetail ? 'rounded-xl' : 'minmd:rounded-bl-xl rounded-bl-none rounded-tl-xl',
      )}>
        <video
          className={tw(
            props.verticalDetail ? 'minmd:rounded-xl w-full' : 'minmd:rounded-l-xl',
            'h-full aspect-square cursor-pointer',
            'rounded-none z-30 object-cover',
          )}
          autoPlay
          muted
          loop
          playsInline={!isMobile}
          preload="none"
          poster={getGenesisKeyThumbnail(props.id)}
          src={processIPFSURL(genesisKeyMetadata?.metadata?.animation_url)}
        />
      </div>
      <div className={tw(
        props.verticalDetail ? 'minmd:w-3/4 w-full' : 'minmd:w-1/2 w-full',
        'flex flex-col px-6 my-6 overflow-y-auto'
      )}>
        <div className='w-full flex justify-between'>
          <div className='flex flex-col'>
            <span className='text-xs text-left w-full'>GENESIS KEY</span>
            <span className={tw(
              props.verticalDetail ? 'text-5xl' : 'text-3xl',
              'font-black font-rubik'
            )}>
              {formatID(BigNumber.from(props.id))}
            </span>
          </div>
          {userIsOwner &&
            <div className={tw(
              'flex w-2/5',
              'rounded-full bg-modal-overlay dark:bg-modal-overlay-dk h-10 aspect-square mr-1',
              'cursor-pointer justify-center items-center',
              isDownloading ? 'opacity-80' : 'opacity-100',
              'hover:opacity-75',
            )}
            onClick={() => {
              if (isDownloading) {
                return;
              }
              try {
                setIsDownloading(true);
                const zip = new JSZip();
                let count = 0;
                const zipFilename = `NFT_COM_GK${formatID(BigNumber.from(props.id))}.zip`;
                const urls = [
                  processIPFSURL(genesisKeyMetadata?.metadata?.image),
                  processIPFSURL(genesisKeyMetadata?.metadata?.animation_url),
                ];
                urls.forEach(url => {
                  JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err) {
                      throw err;
                    }
                    zip.file(
                      count === 1
                        ? `NFT_COM_GK${formatID(BigNumber.from(props.id))}.mp4`
                        : `NFT_COM_GK${formatID(BigNumber.from(props.id))}.png`,
                      data,
                      { binary: true }
                    );
                    ++count;
                    if (count === urls.length) {
                      zip.generateAsync({ type: 'blob' }).then(function (content) {
                        saveAs(content, zipFilename);
                        setIsDownloading(false);
                      });
                    }
                  });
                });
              } catch (e) {
                setIsDownloading(false);
              }
            }}
            >
              {isDownloading ? <Loader /> : <Download size={16} color={secondaryIcon} fill={secondaryIcon} />}
              <span className='text-xs text-left ml-2'>
                {isDownloading ? 'Downloading...' : 'Download'}
              </span>
            </div>
          }
        </div>
        <div className={tw(
          'grid gap-2 overflow-y-auto overflow-x-hidden mt-4',
          props.verticalDetail && !isMobile ? 'minmd:grid-cols-3 grid-cols-2 w-full' : 'grid-cols-2 w-full'
        )}>
          {[
            {
              type: 'Owner',
              value: isNullOrEmpty(owner) ?
                <Loader /> :
                userIsOwner ?
                  'You' :
                  shortenAddress(owner, isMobile ? 3 : 4),
              onClick: () => {
                window.open(
                  getEtherscanLink(chain?.id, owner, 'address')
                  , '_blank'
                );
              }
            },
            {
              type: 'Profile Mints Remaining',
              value: claimableProfileCount == null ? <Loader /> : claimableProfileCount,
            },
            ...(genesisKeyMetadata?.metadata?.attributes ?? [])
          ]?.map((item, index) => {
            return <div
              key={index}
              className={item.onClick ? 'cursor-pointer' : ''}
              onClick={item.onClick}
            >
              <PropertyCard
                type={item.type ?? item.trait_type}
                value={item.value}
                variant="gallery"
                icon={traitIcons[item.type ?? item.trait_type]}
                valueClasses={item.type === 'Owner' ? 'font-dm-mono' : ''}
              />
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}
