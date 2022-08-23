import useCopyClipboard from 'hooks/useCopyClipboard';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

export interface NftDetailCardProps {
  type: string;
  value: string;
  subtitle?: string;
  valueClasses?: string;
  center?: boolean;
  onClick?: () => void;
  copy?: boolean
}

export function NftDetailCard(props: NftDetailCardProps) {
  const [isCopied, staticCopy] = useCopyClipboard();

  return (
    <div
      className={tw(
        'NftDetailCard',
        'flex w-full h-full',
        'bg-footer-bg dark:bg-secondary-bg-dk rounded-lg',
        'overflow-hidden cursor-pointer',
        props.onClick &&
       'cursor-pointer transition hover:scale-[0.97] transition-spacing duration-100 ease-in-out'
      )}
      onClick={!props.onClick
        ? () => {
          staticCopy(props.value);
        }
        : () => props.onClick && props.onClick()}
    >

      <div className={tw(
        'flex flex-col p-4 w-full',
        'font-medium font-rubik',
        props.center ? 'items-center' : null,
        'overflow-hidden'
      )}>
        <span className="text-xs text-secondary-txt dark:text-secondary-txt-dk mb-2">
          {props.type}
        </span>
        <span className={tw(
          'text-base dark:text-white',
          'line-clamp-1 text-ellipsis',
          props.valueClasses
        )}>
          {isCopied ? 'Copied!' : props.value}
        </span>
        {!isNullOrEmpty(props.subtitle) && <span className=''>{props.subtitle}</span>}
      </div>
    </div>
  );
}