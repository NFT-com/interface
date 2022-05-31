import GenesisKeyGalleryCard from 'components/Card/GenesisKeyGalleryCard';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import React, { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
        'w-1/5 deprecated_lg:w-1/4 deprecated_md:w-1/3 deprecated_sm:w-2/5'
      )}
    >
      <GenesisKeyGalleryCard
        key={tokenId}
        id={tokenId}
        onClick={() => {
          if (isMobile) {
            navigate('/app/gallery/' + tokenId);
          } else {
            props.onModalOpen();
          }
        }}
      />
    </div>
  );
}

export default React.memo(GenesisKeyGalleryGridCell, areEqual);