import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import ClientOnly from 'utils/ClientOnly';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <ClientOnly>
        <Header />
        <Sidebar />
      </ClientOnly>
      <div className='flex-1'>
        {children}
      </div>
      <Footer />
    </div>
  );
}
