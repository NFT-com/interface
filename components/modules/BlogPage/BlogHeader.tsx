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
    <>
      <p className="mt-14 sm:mt-6 md:mt-10 mx-auto text-4xl sm:text-lg md:text-2xl sm:mb-3 max-w-2xl font-medium leading-normal md:leading-6 tracking-wider px-0 md:px-10">
        {post?.title}
      </p>
      {post?.author && (
        <div className="mb-4 mt-4 md:mt-3 mx-auto h-12 md:h-9 w-12 md:w-9">
          <Image
            src={post.author.image.url}
            alt={post.author.image.description}
            className="rounded-full"
            width="100%"
            height="100%"
          />
        </div>
      )}
      <p className="mt-2 text-xl md:text-base leading-4 tracking-wider">
        {post?.author?.name}
      </p>

      {post && (
        <div
          style={{ borderColor: '#E4E4E4' }}
          className="flex justify-center mt-2 md:mt-0.5 pb-10 mb-5 md:mb-2.5 text-xs md:text-sm text-slate-600 leading-3 tracking-wider border-b-2"
        >
          <p>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
          <span className="mx-1">.</span>
          {post?.body && <p>{result.minutes} min read</p>}
        </div>
      )}
    </>
  );
}
