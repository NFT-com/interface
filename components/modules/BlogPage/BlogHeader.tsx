import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import SharingIcons from './SharingIcons';

import moment from 'moment';
import Image from 'next/image';
import { readingTime } from 'reading-time-estimator';
import { PostData } from 'types/blogs';

type HeaderProps = {
  post: PostData;
};

export default function BlogHeader({ post }: HeaderProps) {
  const result = readingTime(post?.body);
  return (
    getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
      ? (
        <>
          <h2 className="font-grotesk font-bold mx-auto text-4xl sm:text-lg md:text-2xl sm:mb-3 max-w-2xl leading-5.5 md:leading-6 tracking-wider px-0 md:px-10">
            {post?.title}
          </h2>
          {post?.author?.image?.url && (
            <div className="mb-4 mt-4 md:mt-3 mx-auto h-12 md:h-9 w-12 md:w-9">
              <Image
                src={post.author.image.url}
                alt={post.author.image.description || 'Author Image'}
                className="rounded-full"
                width="100%"
                height="100%"
              />
            </div>
          )}
          <p className="font-grotesk mt-2 text-xl md:text-base leading-4 tracking-wider">
            {post?.author?.name}
          </p>

          {post && (
            <div className="font-grotesk relative flex justify-center mt-2 md:mt-0.5 pb-7 md:pb-8 mb-5 md:mb-2.5 text-xs md:text-sm text-[#7F7F7F] leading-3 tracking-wider border-b-2 border-share-icon">
              <p>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
              <span className="mx-1">.</span>
              {post?.body && <p>{result.minutes} min read</p>}
              <ClientOnly>
                <SharingIcons
                  title={post?.title}
                />
              </ClientOnly>
            </div>
          )}
        </>)
      :(
        <>
          <h2 className="dark:text-white mx-auto text-4xl sm:text-lg md:text-2xl sm:mb-3 max-w-2xl font-medium leading-5.5 md:leading-6 tracking-wider px-0 md:px-10">
            {post?.title}
          </h2>
          {post?.author?.image?.url && (
            <div className="mb-4 mt-4 md:mt-3 mx-auto h-12 md:h-9 w-12 md:w-9">
              <Image
                src={post.author.image.url}
                alt={post.author.image.description || 'Author Image'}
                className="rounded-full"
                width="100%"
                height="100%"
              />
            </div>
          )}
          <p className="dark:text-white mt-2 text-xl md:text-base leading-4 tracking-wider">
            {post?.author?.name}
          </p>

          {post && (
            <div className="relative flex justify-center mt-2 md:mt-0.5 pb-7 md:pb-8 mb-5 md:mb-2.5 text-xs md:text-sm dark:text-gray-400 text-slate-600 leading-3 tracking-wider border-b-2 border-share-icon">
              <p>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
              <span className="mx-1">.</span>
              {post?.body && <p>{result.minutes} min read</p>}
              <ClientOnly>
                <SharingIcons
                  title={post?.title}
                />
              </ClientOnly>
            </div>
          )}
        </>
      )
  );
}
