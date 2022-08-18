import { tw } from 'utils/tw';

import { Check } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface CheckBoxProps {
  checked: boolean;
  onToggle: (val: boolean) => void;
}

/**
 * Custom UI for a checkbox - parent is responsible for state management.
 */
export function CheckBox(props: CheckBoxProps) {
  const { link, inputBackground } = useThemeColors();
  return (
    <div
      className={tw(
        'flex items-center justify-center rounded h-5 w-5',
        'cursor-pointer border-black dark:border-white',
        'shrink-0'
      )}
      style={{
        backgroundColor: props.checked ? link : inputBackground,
        borderWidth: props.checked ? '0' : '1px'
      }}
      onClick={() => {
        props.onToggle(!props.checked);
      }}
    >
      {props.checked ? <Check color="black" className="h-4 w-4" /> : null}
    </div>
  );
}
