import { CustomTooltip } from 'components/elements/CustomTooltip';
import { tw } from 'utils/tw';

import Image from 'next/image';
import Link from 'next/link';
import ArrowDown from 'public/arrow_down.svg';
import { useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

interface IDropdownOption {
  label?: string;
  image?: string;
  onClick?: () => void;
  dest?: string;
}

interface IDropdownProps {
  component?: JSX.Element;
  dropDownOptions: IDropdownOption[];
}

export const HeaderDropdown = ({ dropDownOptions, component }: IDropdownProps) => {
  const { primaryText, modalBackground } = useThemeColors();
  const [title, setTitle] = useState(!component && dropDownOptions[0].label);
  const [image, setImage] = useState(!component && dropDownOptions[0].image);

  return (
    <CustomTooltip
      mode="hover"
      tooltipComponent={
        <div
          className="rounded-xl p-5 bg-modal-bg dark:bg-modal-bg-dk"
          style={{
            color: primaryText,
            minWidth: '12rem',
          }}
        >
          <div
            className="w-0 h-0 absolute"
            style={{
              marginRight: '1rem',
              top: '-0.5rem',
              right: '1rem',
              borderLeft: '0.5rem solid transparent',
              borderRight: '0.5rem solid transparent',
              borderBottomWidth: '0.5rem',
              borderBottomColor: modalBackground,
            }}
          ></div>
          {dropDownOptions.map((item, index) => {
            const content = (
              <div
                key={index}
                className={tw('flex items-center',
                  'py-5 pl-5 rounded-xl bg-modal-bg',
                  'dark:bg-modal-bg-dk cursor-pointer')}
                onClick={item.onClick ?? (!component &&(() => {
                  setTitle(item.label);
                  setImage(item.image ?? null);
                }))}
              >
                {image && <Image src={item.image} alt="currencyImage" className='mx-2'/>}
                {item.label}
              </div>
            );
            if (item.onClick || !item.dest) {
              return content;
            }
            return (
              <Link
                key={index}
                href={item.dest}
              >
                {content}
              </Link>
            );
          })}
        </div>
      }
    >
      <div className="text-header-txt font-normal flex justify-between">
        {image && <Image src={image} alt="currencyImage" className='mx-2'/>}
        <div>{title}</div>
        {!component && <Image src={ArrowDown} alt="ArrowDown" className='mx-2'/>}
        <div>{component}</div>
      </div>
    </CustomTooltip>
  );
};
