import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className='flex-1'>
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
  );
}
