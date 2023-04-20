import Link from 'next/link';
import { useRouter } from 'next/router';

function PreviewBanner() {
  const router = useRouter();
  return (
    <div className='fixed bottom-0 z-50 flex h-16 w-full items-center justify-center gap-4 bg-black text-sm text-white dark:bg-white dark:text-black minmd:gap-16'>
      <span>PREVIEW MODE ENABLED</span>
      <Link prefetch={false} href={`/api/cancel-preview?slug=${router?.asPath}`} legacyBehavior>
        <a className='decoration rounded bg-white p-2 text-black dark:bg-black dark:text-white'>EXIT PREVIEW MODE</a>
      </Link>
    </div>
  );
}

export default PreviewBanner;
