import React, { useMemo } from 'react';

const getSizeClasses = (size) => {
  switch (size) {
  case 'small': {
    return 'px-4 py-2.5';
  }
  case 'large': {
    return 'px-6 py-3';
  }
  default: {
    return 'px-5 py-2.5';
  }
  }
};

const getModeClasses = (isPrimary) =>
  isPrimary
    ? 'text-white bg-primary-yellow border-primary-yellow'
    : 'text-slate-700 border-slate-700';

const BASE_BUTTON_CLASSES =
  'cursor-pointer rounded-full border-2 font-bold leading-none inline-block';

/**
 * Primary UI component for user interaction
 */

type ButtonProps = {
  /** Button primary toggle */
  primary: boolean;
  /** Button size */
  size: string;
  label: string;
}

export const Button = ({ primary = false, size = 'medium', label, ...props }: ButtonProps) => {
  const computedClasses = useMemo(() => {
    const modeClass = getModeClasses(primary);
    const sizeClass = getSizeClasses(size);

    return [modeClass, sizeClass].join(' ');
  }, [primary, size]);

  return (
    <button className={`${BASE_BUTTON_CLASSES} ${computedClasses}`} {...props}>
      {label}
    </button>
  );
};