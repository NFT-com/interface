import { CustomTooltip } from 'components/elements/CustomTooltip';
import useCopyClipboard from 'hooks/useCopyClipboard';

import { Link } from 'phosphor-react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

type SharingProps = {
  title: string;
};

export default function SharingIcons({ title }: SharingProps) {
  const [, setCopied] = useCopyClipboard();

  let url;
  if(typeof window !== 'undefined') {
    url = window.location.href;
  }
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
      
      <CustomTooltip
        mode="click"
        tooltipComponent={
          <div
            className="rounded-xl p-3 dark:bg-modal-bg bg-modal-bg-dk text-white dark:text-black"
            style={{
              minWidth: '7rem',
            }}
          >
            <p>Copied!</p>
          </div>
        }
      >
        <button className="w-8 h-8 md:w-6 md:h-6 flex justify-center items-center border dark:border-0 border-share-icon rounded-full bg-share-icon-bg">
          <Link
            onClick={() => {
              setCopied(url);
            }}
            className="flex-shrink-0 aspect-square w-8 h-5 md:w-6 md:h-4"
            color="#727272"
          />
        </button>
      </CustomTooltip>
    </div>
  );
}
