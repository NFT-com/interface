import Loader from 'components/elements/Loader/Loader';
import { joinClasses } from 'utils/format';

export interface ModalButtonProps {
  text: string;
  onClick: () => void;
  loading: boolean;
  bgColor?: string;
  textColor?: string;
  outline?: string;
}

export function ModalButton(props: ModalButtonProps) {
  return (
    <div className='flex items-center justify-center'>
      <div
        style={{
          backgroundColor: props.loading ? '#6B7280' : props?.bgColor ?? '#05C0FC',
          color: props?.textColor ?? '#FFFFFF',
          outline: props?.outline ?? 'none'
        }}
        onClick={props.onClick}
        className={joinClasses(
          'flex cursor-pointer items-center font-bold',
          'h-10 w-full justify-center rounded-xl px-4 text-lg'
        )}
      >
        {props.loading ? <Loader /> : props.text}
      </div>
    </div>
  );
}
