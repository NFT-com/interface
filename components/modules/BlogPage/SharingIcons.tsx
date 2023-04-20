import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import { Link } from 'phosphor-react';

import CustomTooltip from 'components/elements/CustomTooltip';
import useCopyClipboard from 'hooks/useCopyClipboard';

type SharingProps = {
  title: string;
};

export default function SharingIcons({ title }: SharingProps) {
  const [copied, setCopied] = useCopyClipboard();
  return (
    <div className='row absolute bottom-3.5 right-0 flex md:bottom-1'>
      <FacebookShareButton quote={title} url={window.location.href}>
        <FacebookIcon
          bgStyle={{ fill: '#FBF9F9' }}
          iconFillColor='#727272'
          className='h-8 w-8 rounded-full border border-share-icon p-0 md:h-6 md:w-6'
        />
      </FacebookShareButton>
      <TwitterShareButton className='mx-3 rounded-full' title={title} url={window.location.href}>
        <TwitterIcon
          bgStyle={{ fill: '#FBF9F9' }}
          iconFillColor='#727272'
          className='h-8 w-8 rounded-full border border-share-icon md:h-6  md:w-6'
        />
      </TwitterShareButton>

      <CustomTooltip
        orientation='top'
        tooltipComponent={
          copied ? (
            <div
              className='py-1 text-white'
              style={{
                minWidth: '7rem'
              }}
            >
              <p>Copied!</p>
            </div>
          ) : null
        }
      >
        <button className='flex h-8 w-8 items-center justify-center rounded-full border border-share-icon bg-share-icon-bg md:h-6 md:w-6'>
          <Link
            onClick={() => {
              setCopied(window.location.href);
              navigator.clipboard.writeText(window.location.href);
            }}
            className='aspect-square h-5 w-8 shrink-0 md:h-4 md:w-6'
            color='#727272'
          ></Link>
        </button>
      </CustomTooltip>
    </div>
  );
}
