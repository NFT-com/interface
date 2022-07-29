import useCopyClipboard from 'hooks/useCopyClipboard';
import { joinClasses } from 'utils/helpers';

import React from 'react';
import { CheckCircle, Copy } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

type TransactionStatusTextProps = {
  children?: React.ReactNode;
  color?: boolean;
};

const TransactionStatusText = ({
  children,
  color
}: TransactionStatusTextProps) => {
  return (
    <span
      className={`${ color ? 'text-always-white' : 'text-primary-txt dark:text-primary-txt-dk' }
        ml-1 text-copy-size flex flex-row flex-nowrap items-center`}>
      {children}
    </span>);
};

export default function CopyHelper(props: {
  after?: boolean;
  keepContent?: boolean;
  white?: boolean;
  toCopy: string;
  children?: React.ReactNode;
  lightModeForced?: boolean;
}) {
  const [isCopied, setCopied] = useCopyClipboard();
  const { primaryIcon, alwaysWhite } = useThemeColors();
  return (
    <>
      <button
        onClick={() => setCopied(props.toCopy)}
        className={joinClasses(
          'bg-none cursor-pointer font-medium',
          'border-0 shrink-0 flex items-center',
          'no-underline text-copy-size',
          props.lightModeForced ? ' text-[#6F6F6F]': 'dark:text-primary-txt-dk text-copy-size',
          'active:hover:no-underline',
          props.lightModeForced ? 'active:hover:text-primary-txt' : 'active:hover:text-primary-txt active:hover:dark:text-primary-txt-dk',
          'focus:no-underline focus:outline-0',
          props.lightModeForced ? 'focus:text-primary-txt': 'focus:text-primary-txt focus:dark:text-primary-txt-dk',
        )}>
        {props.after === true && (props.keepContent !== true && isCopied ? '' : props.children)}
        {isCopied
          ? (
            <TransactionStatusText>
              <CheckCircle size={'16'} color={props.white ? alwaysWhite : primaryIcon} />
              <TransactionStatusText color={props.white}>
              Copied
              </TransactionStatusText>
            </TransactionStatusText>
          )
          : (
            <TransactionStatusText>
              <Copy size={'16'} color={props.white ? alwaysWhite : primaryIcon} />
            </TransactionStatusText>
          )}
        {props.after !== true && (props.keepContent !== true && isCopied ? '' : props.children)}
      </button>
    </>
  );
}
