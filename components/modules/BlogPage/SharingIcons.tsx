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
          bgStyle={{ fill: '#FBF9F9' }}
          iconFillColor="#727272"
          className="w-8 h-8 md:w-6 md:h-6 p-0 border dark:border-0 border-share-icon rounded-full"
        />
      </FacebookShareButton>
      <TwitterShareButton className="mx-3 rounded-full" title={title} url={url}>
        <TwitterIcon
          bgStyle={{ fill: '#FBF9F9' }}
          iconFillColor="#727272"
          className="w-8 h-8 md:w-6 md:h-6 border dark:border-0 border-share-icon  rounded-full"
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
      <button className="w-8 h-8 md:w-6 md:h-6 flex justify-center items-center border dark:border-0 border-share-icon rounded-full bg-share-icon-bg">
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
