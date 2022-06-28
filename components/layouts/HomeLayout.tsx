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
      <div
        className='flex-1'
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </div>
  );
}
