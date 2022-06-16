import { Footer } from 'components/elements/Footer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import BlogHeader from 'components/modules/BlogPage/BlogHeader';
import BlogHeroImage from 'components/modules/BlogPage/BlogHeroImage';
import Markdown from 'components/modules/BlogPage/Markdown';
import RelatedPostCard from 'components/modules/BlogPage/RelatedPostsCard';

import { getPost } from 'lib/contentful/api';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PostData } from 'types/blogs';

type PostProps = {
  post: PostData;
  preview: boolean;
};

export default function Post({ post }: PostProps) {
  const [headerBlack, setHeaderBlack] = useState(false);
  const router = useRouter();
  const listenScrollEvent = () => {
    window.scrollY > 10 ? setHeaderBlack(true) : setHeaderBlack(false);
  };
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
  });

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.heroImage.url} />
        <meta property="og:site_name" content="NFT.com" />
        <meta
          property="og:url"
          content={`http://nft.com/articles/${post.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:alt" content={post.heroImage.description} />
      </Head>
      <PageWrapper
        headerOptions={{
          walletOnly: true,
          removeBackground: true,
          walletPopupMenu: true,
          removeSummaryBanner: true,
          sidebar: 'hero',
          heroHeader: true,
          heroHeaderBlack: headerBlack,
        }}
      >
        <div
          className="bg-white relative text-center px-4 w-full"
          onScroll={(event: React.UIEvent<HTMLDivElement>) => {
            const containerHeight = event.currentTarget.clientHeight;
            const scrollTop = event.currentTarget.scrollTop;
            setHeaderBlack(scrollTop >= containerHeight);
          }}
        >
          <BlogHeader post={post} />

          <BlogHeroImage
            src={post?.heroImage.url}
            alt={post?.heroImage.description}
          />
          <div
            style={{ borderColor: '#E4E4E4' }}
            className="text-left border-b-2 mt-12 md:mt-8 mb-5"
          >
            <Markdown content={post?.body} />
          </div>
          {post.relatedPostsCollection.items.length ? (
            <>
              <h2 className="text-left mb-6 sm:mb-3 font-medium mt-8 md:mt-4 sm:mt-1.5 text-3xll md:text-xl sm:text-sm">
                Related Posts
              </h2>
              <div className="grid gap-x-4 sm:gap-x-3 gap-y-7 grid-cols-3 md:grid-cols-2 mb-24 lg:mb-12">
                {post.relatedPostsCollection.items.map((post) => (
                  <RelatedPostCard key={post.title} post={post} />
                ))}
              </div>
            </>
          ) : null}
        </div>
        <Footer />
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview);
  return {
    props: {
      post: data?.post ?? null,
    },
  };
}
