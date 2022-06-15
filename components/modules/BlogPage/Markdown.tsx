import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const theme = {
  p: (props: any) => {
    const { children } = props;
    return (
      <p
        className="mb-8 text-2xl md:text-lg sm:text-sm"
        style={{ color: '#727272' }}
      >
        {children}
      </p>
    );
  },
  h2: (props: any) => {
    const { children } = props;
    return (
      <h2 className="mb-4 text-3xll md:text-xl sm:text-sm font-medium">
        {children}
      </h2>
    );
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
