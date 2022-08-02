import { tw } from 'utils/tw';

import GenesisKeyGalleryCard from './GenesisKeyGalleryCard';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { areEqual } from 'react-window';

export interface GenesisKeyGalleryGridCellProps {
  rowIndex: number;
  columnIndex: number;
  itemsPerRow: number;
  totalGKSupply: BigNumber;
  style: any;
  onModalOpen: () => void;
}

function GenesisKeyGalleryGridCell(props: GenesisKeyGalleryGridCellProps) {
  const router = useRouter();

  const getTokenIdForGrid = useCallback((rowIndex: number, columnIndex: number) => {
    const start = rowIndex * props.itemsPerRow + 1;
    return start + columnIndex;
  }, [props.itemsPerRow]);

  const tokenId = getTokenIdForGrid(props.rowIndex, props.columnIndex);
  if (props.totalGKSupply?.lt(tokenId)) {
    return null;
  }
  
  return (
    <div
      style={props.style}
      key={tokenId}
      className={tw(
        'flex mb-4 items-center justify-center px-4',
        'w-2/5 minmd:w-1/3 minlg:w-1/4 minxl:w-1/5'
      )}
    >
      <GenesisKeyGalleryCard
        key={tokenId}
        id={tokenId}
        onClick={() => {
          if (isMobile) {
            router.push('/app/gallery/' + tokenId);
          } else {
            props.onModalOpen();
          }
        }}
      />
    </div>
  );
}

export default React.memo(GenesisKeyGalleryGridCell, areEqual);