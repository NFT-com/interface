import Link from 'next/link';
import { useRouter } from 'next/router';

function PreviewBanner() {
  const router = useRouter();
  return (
    <div
      className='flex text-sm h-16 bg-black dark:bg-white text-white dark:text-black w-full justify-center items-center gap-16 sm:gap-4 fixed bottom-0 z-50'
    >
      <span>PREVIEW MODE ENABLED</span>
      <Link
        prefetch={false}
        href={`/api/cancel-preview?slug=${router?.asPath}`}
      >
        <a
          className="bg-white dark:bg-black text-black dark:text-white rounded decoraction p-2"
        >
          EXIT PREVIEW MODE
        </a>
      </Link>
    </div>
  );
}

export default PreviewBanner;