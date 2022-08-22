import { tw } from 'utils/tw';

import { Check } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface CheckBoxProps {
  checked: boolean;
  onToggle: (val: boolean) => void;
  lightModeForced?: boolean;
}

/**
 * Custom UI for a checkbox - parent is responsible for state management.
 */
export function CheckBox(props: CheckBoxProps) {
  const { link, inputBackground, primaryButtonBackground_rebrand } = useThemeColors();
  return (
    <div
      className={tw(
        'flex items-center justify-center rounded h-5 w-5',
        'cursor-pointer border-black dark:border-white',
        'shrink-0'
      )}
      style={{
        backgroundColor: props.checked ? props.lightModeForced ? primaryButtonBackground_rebrand : link : props.lightModeForced ? '#F8F8F8' :inputBackground,
        borderWidth: props.checked ? '0' : '1px',
        borderColor: props.lightModeForced ? props.checked ? '0' : '#6F6F6F' : '',
      }}
      onClick={() => {
        props.onToggle(!props.checked);
      }}
    >
      {props.checked ? <Check color="black" className="h-4 w-4" /> : null}
    </div>
  );
}
