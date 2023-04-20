import React from 'react';
import { CheckCircle } from 'react-feather';

import useCopyClipboard from 'hooks/useCopyClipboard';
import { joinClasses } from 'utils/format';

import CopySvg from 'public/icons/copy.svg?svgr';
import { useThemeColors } from 'styles/theme/useThemeColors';

type TransactionStatusTextProps = {
  children?: React.ReactNode;
  color?: boolean;
};

const TransactionStatusText = ({ children, color }: TransactionStatusTextProps) => {
  return (
    <span
      className={`${color ? 'text-always-white' : 'text-[#6A6A6A] dark:text-primary-txt-dk'}
        ml-1 flex flex-row flex-nowrap items-center font-[18px]`}
    >
      {children}
    </span>
  );
};

export default function CopyHelper(props: {
  after?: boolean;
  keepContent?: boolean;
  white?: boolean;
  toCopy: string;
  children?: React.ReactNode;
  lightModeForced?: boolean;
  size?: string;
}) {
  const [isCopied, setCopied] = useCopyClipboard();
  const { primaryIcon, alwaysWhite } = useThemeColors();
  const size = parseInt(props.size) ?? 16;
  return (
    <>
      <button
        onClick={() => setCopied(props.toCopy)}
        className={joinClasses(
          'cursor-pointer bg-none font-noi-grotesk',
          'flex shrink-0 items-center border-0',
          'font-[18px] no-underline',
          props.lightModeForced ? ' text-[#6F6F6F]' : 'font-[18px] dark:text-primary-txt-dk',
          'active:hover:no-underline',
          props.lightModeForced
            ? 'active:hover:text-primary-txt'
            : 'active:hover:text-primary-txt active:hover:dark:text-primary-txt-dk',
          'focus:no-underline focus:outline-0',
          props.lightModeForced ? 'focus:text-[#6A6A6A]' : 'focus:text-[#6A6A6A] focus:dark:text-primary-txt-dk'
        )}
      >
        {props.after === true && (props.keepContent !== true && isCopied ? '' : props.children)}
        {isCopied ? (
          <TransactionStatusText>
            <CheckCircle size={props.size ?? '16'} color={props.white ? alwaysWhite : primaryIcon} />
            <TransactionStatusText color={props.white}>Copied</TransactionStatusText>
          </TransactionStatusText>
        ) : (
          <TransactionStatusText>
            <CopySvg alt='copy' className={`h-[ ml-1${size}px] w-[${size}px]`} />
          </TransactionStatusText>
        )}
        {props.after !== true && (props.keepContent !== true && isCopied ? '' : props.children)}
      </button>
    </>
  );
}
