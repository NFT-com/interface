import useCopyClipboard from 'hooks/useCopyClipboard';

import { Link } from 'phosphor-react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { Tooltip } from 'react-tippy';

type SharingProps = {
  title: string;
  url: string;
};

export default function SharingIcons({ title, url }: SharingProps) {
  const [isCopied, setCopied] = useCopyClipboard();
  return (
    <div className="absolute right-0 bottom-3.5 md:bottom-1 flex row">
      <FacebookShareButton quote={title} url={url}>
        <FacebookIcon
          bgStyle={{ fill: '#FBF9F9', border: '1px solid #E4E4E4' }}
          iconFillColor="#727272"
          className="w-8 h-8 md:w-6 md:h-6"
          round
          style={{ border: '1px solid #E4E4E4', borderRadius: '100%' }}
        />
      </FacebookShareButton>
      <TwitterShareButton className="mx-3" title={title} url={url}>
        <TwitterIcon
          bgStyle={{ fill: '#FBF9F9', border: '1px solid #E4E4E4' }}
          iconFillColor="#727272"
          className="w-8 h-8 md:w-6 md:h-6"
          round
          style={{ border: '1px solid #E4E4E4', borderRadius: '100%' }}
        />
      </TwitterShareButton>

      <Tooltip
        title="Copied!"
        position="top"
        trigger="click"
        arrow={true}
        size="small"
        open={isCopied}
        className="absolute right-5 md:right-4"
      />
      <button
        className="w-8 h-8 md:w-6 md:h-6 flex justify-center items-center"
        style={{
          border: '1px solid #E4E4E4',
          borderRadius: '100%',
          backgroundColor: '#FBF9F9',
        }}
      >
        <Link
          onClick={() => {
            setCopied(url);
          }}
          className="flex-shrink-0 aspect-square w-8 h-5 md:w-6 md:h-4"
          color="#727272"
        />
      </button>
    </div>
  );
}
