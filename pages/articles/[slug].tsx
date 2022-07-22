import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import PreviewBanner from 'components/elements/PreviewBanner';
import { Sidebar } from 'components/elements/Sidebar';
import BlogHeader from 'components/modules/BlogPage/BlogHeader';
import BlogHeroImage from 'components/modules/BlogPage/BlogHeroImage';
import Markdown from 'components/modules/BlogPage/Markdown';
import RelatedPostCard from 'components/modules/BlogPage/RelatedPostsCard';
import NotFoundPage from 'pages/404';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import { getPost } from 'lib/contentful/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { CaretLeft } from 'phosphor-react';
import { PostData } from 'types/blogs';

type PostProps = {
  post: PostData;
  preview: boolean;
};

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  if (!router.isFallback && !post || !getEnvBool(Doppler.NEXT_PUBLIC_BLOG_PAGES_ENABLED)) {
    return <NotFoundPage />;
  }

  return (
    <>
      <ClientOnly>
        <Header bgLight />
        <Sidebar />
      </ClientOnly>
      <NextSeo
        title={post.title}
        description={post.description}
        openGraph={{
          url: `https://nft.com/articles/${post.slug}`,
          title: post.title,
          description: post.description,
          type: 'article',
          article: {
            publishedTime: post.publishDate,
            tags: post.tags,
          },
          images: [
            {
              url: post.heroImage.url,
              alt: post.heroImage.description,
            },
          ],
          site_name: 'NFT.com',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div className='bg-white'>
        <div className="relative text-center px-4 w-full pt-28 sm:pt-24 max-w-7xl mx-auto">
          <Link href="/articles">
            <div className='flex content-center items-center hover:cursor-pointer sm:mb-4'>
              <CaretLeft className='mr-1 text-black' />
              <p className='font-grotesk text-black sm:text-sm'>Back to Blog</p>
            </div>
          </Link>
          
          <BlogHeader post={post} />

          <BlogHeroImage
            src={post?.heroImage.url}
            alt={post?.heroImage.description}
          />
          <div className="text-left mt-12 md:mt-8 mx-auto pb-5 w-8/12 lg:w-3/4 md:w-full">
            <Markdown content={post?.body} />
          </div>
          {post?.relatedPostsCollection?.items.length
            ? (
              <div>
                <h2 className="text-left mb-6 sm:mb-3 font-medium mt-8 md:mt-4 sm:mt-1.5 text-3xll md:text-xl sm:text-sm">
                Related Posts
                </h2>
                <div className="grid gap-x-4 sm:gap-x-3 gap-y-7 grid-cols-3 md:grid-cols-2 pb-24 lg:pb-12">
                  {post.relatedPostsCollection.items.map((post) => (
                    post && <RelatedPostCard key={post?.sys.id} post={post} />
                  ))}
                </div>
              </div>
            )
            : null}
        </div>
      </div>
      <Footer />
      {preview && <PreviewBanner />}
    </>
  );
}

export async function getServerSideProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview);
  return {
    props: {
      post: data?.post ?? null,
      preview
    },
  };
}
