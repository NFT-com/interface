import { tw } from 'utils/tw';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
  notificationType:
  'hasUnclaimedProfiles'
  | 'pendingAssociatedProfiles'
  | 'profileCustomizationStatus'
  | 'removedAssociatedProfile'
  | 'addedAssociatedProfile';
}

export const NotificationButton = ({ buttonText, onClick }: NotificationButtonProps) => {
  return (
    <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
      <button className={tw(
        'inline-flex w-full h-full',
        'text-md',
        'leading-6',
        'items-center',
        'justify-center',
        'bg-[#F9D963]',
        'rounded-lg',
        'p-4'
      )}
      onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};