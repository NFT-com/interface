import { useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, X } from 'phosphor-react';

import { tw } from 'utils/tw';

import Error from 'public/icons/error.svg?svgr';
import Warning from 'public/icons/warning.svg?svgr';

export enum AlertType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO'
}
export enum AlertPosition {
  FIXED = 'FIXED',
  RELATIVE = 'RELATIVE'
}
type AlertProps = {
  type: AlertType;
  heading: string;
  position?: AlertPosition;
  description: string;
  onClick?: () => void;
  onClose?: () => void;
  hideX?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
};

const getAlertStyles = (type: AlertType) => {
  switch (type) {
    case AlertType.ERROR: {
      return 'border-alert-red bg-alert-red-bg-light';
    }
    case AlertType.SUCCESS: {
      return 'border-alert-green bg-alert-green-bg-light';
    }
    case AlertType.WARNING: {
      return 'border-alert-yellow bg-alert-yellow-bg-light';
    }
    case AlertType.INFO: {
      return 'border-alert-grey bg-alert-grey-bg';
    }
    default: {
      return '';
    }
  }
};
const getAlertPosition = (type: AlertPosition) => {
  switch (type) {
    case AlertPosition.FIXED: {
      return 'fixed left-[32px] bottom-[32px] w-auto z-50';
    }
    case AlertPosition.RELATIVE: {
      return 'relative';
    }
    default: {
      return 'w-full';
    }
  }
};
const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case AlertType.ERROR: {
      return <Image src={Error} color='#6A6A6A' className='relative w-7 shrink-0 ' alt={'Error'} />;
    }
    case AlertType.SUCCESS: {
      return <CheckCircle size={32} color='#36aa73' weight='fill' className='relative h-7 w-7 shrink-0' />;
    }
    case AlertType.WARNING: {
      return <Image src={Warning} color='#e4b200' className='relative w-7 shrink-0 ' alt={'Warning'} />;
    }
    case AlertType.INFO: {
      return <CheckCircle size={32} color='#6A6A6A' weight='fill' className='relative h-7 w-7 shrink-0' />;
    }
    default: {
      return '';
    }
  }
};

export default function Alert({
  type,
  heading,
  description,
  onClick,
  onClose,
  hideX,
  position,
  autoClose,
  autoCloseTime
}: AlertProps) {
  useEffect(() => {
    if (!autoClose) return;
    setTimeout(() => {
      onClose();
    }, autoCloseTime || 3000);
  }, [autoClose, autoCloseTime, onClose]);
  return (
    <div
      onClick={e => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={tw(
        'flex rounded border-2 p-4 font-noi-grotesk hover:cursor-pointer',
        getAlertStyles(type),
        getAlertPosition(position)
      )}
    >
      <div className='flex w-full items-start'>
        {getAlertIcon(type)}
        <div className='ml-3 flex flex-col'>
          <p
            className={tw(
              'mb-1 font-medium',
              type === AlertType.ERROR && 'text-alert-red',
              type === AlertType.SUCCESS && 'text-alert-green',
              type === AlertType.WARNING && 'text-alert-yellow',
              type === AlertType.INFO && 'text-alert-grey'
            )}
          >
            {heading}
          </p>
          <p className='text-[#6A6A6A]'>{description}</p>
        </div>
      </div>
      {!hideX && (
        <X
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onClose && onClose();
          }}
          className='relative ml-4 h-5 w-5 shrink-0 hover:cursor-pointer'
          weight='bold'
          color='#6A6A6A'
        />
      )}
    </div>
  );
}
