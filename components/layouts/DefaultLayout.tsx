import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import { SignOutModal } from 'components/elements/SignOutModal';
import { SearchModal } from 'components/modules/Search/SearchModal';
import { useSidebar } from 'hooks/state/useSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

type DefaultLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean
};

export default function DefaultLayout({ children, hideFooter }: DefaultLayoutProps) {
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  const { toggleSidebar } = useSidebar();
  return (
    <div className={tw('flex flex-col',
      'h-screen w-screen min-w-screen overflow-x-hidden min-h-screen',
    )}>
      <div
        className='flex-1'
        style={{ minHeight: '100vh' }}
      >
        <ClientOnly>
          <Header />
          <Sidebar />
          <SearchModal />
        </ClientOnly>
        {children}
        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
            toggleSidebar();
          }}
        />
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
