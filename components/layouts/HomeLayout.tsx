import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className={tw('flex flex-col',
      'h-screen w-screen min-h-screen',
      'overflow-x-hidden'
    )}>
      <ClientOnly>
        <Header />
        <Sidebar />
      </ClientOnly>
      <div
        className='flex-1'
        style={{ minHeight: '100vh' }}
      >
        {children}
        <Footer />
      </div>
    </div>
  );
}
