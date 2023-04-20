import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

import ImageWithZoom from 'components/modules/BlogPage/ImageWithZoom';

import YouTubeEmbed from './YoutubeEmbed';

const theme = {
  p: (props: any) => {
    const { children } = props;
    return (
      <div className='mb-8 font-noi-grotesk text-base text-blog-text-reskin minmd:text-lg minlg:text-xll'>
        {children}
      </div>
    );
  },
  h1: (props: any) => {
    const { children } = props;
    return <h1 className='text-md mb-4 font-noi-grotesk font-bold minmd:text-2xl minlg:text-4xl'>{children}</h1>;
  },
  h2: (props: any) => {
    const { children } = props;
    return <h2 className='mb-4 font-noi-grotesk text-base font-bold minmd:text-xl minlg:text-3xll'>{children}</h2>;
  },
  h3: (props: any) => {
    const { children } = props;
    return <h3 className='mb-4 font-noi-grotesk text-base font-bold minmd:text-lg minlg:text-2xl'>{children}</h3>;
  },
  img: (props: any) => {
    const { src, alt } = props;
    return <ImageWithZoom src={src} alt={alt} />;
  },
  a: (props: any) => {
    const { children } = props;
    const isYouTube =
      props?.href.match(/https:\/\/(www\.)?youtube.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
      props?.href.match(/https:\/\/(www\.)?youtu.be\/([a-zA-Z0-9_-]+)/);
    if (isYouTube) {
      return <YouTubeEmbed embedId={isYouTube[2]} />;
    }
    return (
      <a
        className='font-noi-grotesk text-base text-blog-text-reskin underline minmd:text-lg minlg:text-xll'
        href={props.href}
        target='_blank'
        rel='noreferrer'
      >
        {children}
      </a>
    );
  },
  li: (props: any) => {
    const { children } = props;
    return (
      <li className='font-noi-grotesk text-base text-blog-text-reskin minmd:text-lg minlg:text-xll'>{children}</li>
    );
  },
  ul: (props: any) => {
    const { children } = props;
    return <ul className='mb-8 pl-4'>{children}</ul>;
  },
  ol: (props: any) => {
    const { children } = props;
    return <ol className='mb-8 pl-4'>{children}</ol>;
  },
  hr: () => {
    return <hr className='mb-8 border-share-icon' />;
  },
  table: (props: any) => {
    const { children } = props;
    return <table className='mx-auto mb-8 text-xs'>{children}</table>;
  }
};

const Markdown = ({ content }: any) => {
  return (
    <ReactMarkdown components={theme} skipHtml linkTarget='_blank' remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
