import { SignOutModal } from 'components/elements/SignOutModal';
import { useSidebar } from 'hooks/state/useSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { tw } from 'utils/tw';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  const { toggleSidebar } = useSidebar();
  return (
    <div className={tw('flex flex-col',
      'h-screen w-full min-h-screen',
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
            toggleSidebar();
          }}
        />
      </div>
    </div>
  );
}
