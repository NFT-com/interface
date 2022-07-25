import ImageWithZoom from 'components/modules/BlogPage/ImageWithZoom';

import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const theme = {
  p: (props: any) => {
    const { children } = props;
    return (
      <p className="font-grotesk mb-8 text-xll md:text-lg sm:text-base text-blog-text-reskin">
        {children}
      </p>
    );
  },
  h1: (props: any) => {
    const { children } = props;
    return (
      <h1 className="font-grotesk font-bold mb-4 text-4xl md:text-2xl sm:text-md">
        {children}
      </h1>
    );
  },
  h2: (props: any) => {
    const { children } = props;
    return (
      <h2 className="font-grotesk font-bold mb-4 text-3xll md:text-xl sm:text-base">
        {children}
      </h2>
    );
  },
  h3: (props: any) => {
    const { children } = props;
    return (
      <h3 className="font-grotesk mb-4 text-2xl md:text-lg sm:text-base font-bold">
        {children}
      </h3>
    );
  },
  img: (props: any) => {
    const { src, alt } = props;
    return (
      <ImageWithZoom src={src} alt={alt} />
    );
  },
  a: (props: any) => {
    const { children } = props;
    return (
      <a
        className="font-grotesk text-xll md:text-lg sm:text-base underline text-blog-text-reskin"
        href={props.href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  },
  li: (props: any) => {
    const { children } = props;
    return (
      <li className="font-grotesk text-xll md:text-lg sm:text-base text-blog-text-reskin">
        {children}
      </li>
    );
  },
  ul: (props: any) => {
    const { children } = props;
    return <ul className="mb-8 pl-4">{children}</ul>;
  },
  ol: (props: any) => {
    const { children } = props;
    return <ol className="mb-8 pl-4">{children}</ol>;
  },
  hr: () => {
    return <hr className="mb-8 border-share-icon" />;
  },
};

const Markdown = ({ content }: any) => {
  return (
    <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
