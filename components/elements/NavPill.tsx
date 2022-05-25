import { tw } from 'utils/tw';

export interface NavPillProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

export function NavPill(props: NavPillProps) {
  return (
    <div
      onClick={props.onClick}
      className={tw(
        'rounded-xl border',
        props.active ? 'bg-action-primary' : 'bg-modal-overlay dark:bg-modal-overlay-dk',
        props.active ? 'text-white border-white font-bold' : 'border-pill-border',
        'py-2.5 px-5 mr-4',
        'cursor-pointer',
      )}>
      {props.label}
    </div>
  );
}