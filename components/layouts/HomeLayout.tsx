import { SignOutModal } from 'components/elements/SignOutModal';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { tw } from 'utils/tw';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  return (
    <div className={tw('flex flex-col',
      'h-screen w-screen min-h-screen',
      'overflow-x-hidden'
    )}>
      <div
        className='flex-1'
        style={{ minHeight: '100vh' }}
      >
        {children}

        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
          }}
        />
      </div>
    </div>
  );
}
