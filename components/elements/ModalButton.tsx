import Loader from 'components/elements/Loader';
import { joinClasses } from 'utils/helpers';

export interface ModalButtonProps {
  text: string;
  onClick: () => void;
  loading: boolean;
}

export function ModalButton(props: ModalButtonProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{
          backgroundColor: props.loading ? '#6B7280' : '#05C0FC',
          color: '#FFFFFF',
        }}
        onClick={props.onClick}
        className={joinClasses(
          'cursor-pointer font-bold flex items-center',
          'justify-center w-full rounded-xl h-10 text-lg px-4'
        )}
      >
        {props.loading ? <Loader /> : props.text}
      </div>
    </div>
  );
}
