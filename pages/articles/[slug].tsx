import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import PreviewBanner from 'components/elements/PreviewBanner';
import { Sidebar } from 'components/elements/Sidebar';
import BlogHeader from 'components/modules/BlogPage/BlogHeader';
import BlogHeroImage from 'components/modules/BlogPage/BlogHeroImage';
import Markdown from 'components/modules/BlogPage/Markdown';
import RelatedPostCard from 'components/modules/BlogPage/RelatedPostsCard';
import { SearchModal } from 'components/modules/Search/SearchModal';
import NotFoundPage from 'pages/404';
import { PostData } from 'types/blogs';
import ClientOnly from 'utils/ClientOnly';

import { getPost } from 'lib/contentful/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { CaretLeft } from 'phosphor-react';

type PostProps = {
  post: PostData;
  preview: boolean;
};

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  if (!router.isFallback && !post) {
    return <NotFoundPage />;
  }

  return (
    <>
      <ClientOnly>
        <Header bgLight />
        <Sidebar />
        <SearchModal />
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
        <div className="relative text-center px-4 w-full minmd:pt-28 pt-24 max-w-nftcom mx-auto">
          <Link href="/articles">
            <div className='flex content-center items-center hover:cursor-pointer mb-4 minmd:mb-0'>
              <CaretLeft className='mr-1 text-black' />
              <p className='font-grotesk text-black text-sm minmd:text-base'>Back to Blog</p>
            </div>
          </Link>
          
          <BlogHeader post={post} />

          <BlogHeroImage
            src={post?.heroImage.url}
            alt={post?.heroImage.description}
          />
          <div className="text-left minlg:mt-12 mt-8 mx-auto pb-5 minxl:w-8/12 minlg:w-3/4 w-full">
            <Markdown content={post?.body} />
          </div>
          {post?.relatedPostsCollection?.items.length
            ? (
              <div>
                <h2 className="text-left minmd:mb-6 mb-3 font-medium minlg:mt-8 minmd:mt-4 mt-1.5 minlg:text-3xll minmd:text-xl text-sm">
                Related Posts
                </h2>
                <div className="grid minmd:gap-x-4 gap-x-3 gap-y-7 minlg:grid-cols-3 grid-cols-2 minxl:pb-24 pb-12">
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
