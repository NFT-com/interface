import { Nft } from 'graphql/generated/types';

import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { PartialDeep } from 'type-fest';

export interface DescriptionDetailProps {
  nft: PartialDeep<Nft>
}

export const DescriptionDetail = (props: DescriptionDetailProps) => {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const theme = {
    p: (props: any) => {
      const { children } = props;
      return (
        <p className="inline">
          {children}
        </p>
      );
    },
    a: (props: any) => {
      const { children } = props;
      return (
        
        <a
          className="underline inline"
          href={props.href}
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      );
    }
  };
  
  return (
    <div id="NFTDescriptionContainer">
      <span className='flex flex-row w-full justify-start font-semibold text-base leading-6 text-[#6F6F6F] font-grotesk'>
        Description
      </span>
      {descriptionExpanded ?
        <>
          <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
            {props?.nft?.metadata?.description}
          </ReactMarkdown>
          <p className='text-[#B59007] font-bold inline ml-1 hover:cursor-pointer' onClick={() => setDescriptionExpanded(false)}>Show less</p>
        </>
        :
        <>
          {props?.nft?.metadata?.description.length > 87
            ?
            <div className='inline minlg:hidden'>
              <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                {props?.nft?.metadata?.description.substring(0, 87) + '...'}
              </ReactMarkdown>
            </div>
            :
            <div className='inline minlg:hidden'>
              <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                {props?.nft?.metadata?.description}
              </ReactMarkdown>
            </div>
          }
          {props?.nft?.metadata?.description.length > 200
            ?
            <div className='hidden minlg:inline'>
              <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                {props?.nft?.metadata?.description.substring(0, 200) + '...'}
              </ReactMarkdown>
            </div>
            :
            <div className='hidden minlg:inline'>
              <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                {props?.nft?.metadata?.description}
              </ReactMarkdown>
            </div>
          }
          {
            props?.nft?.metadata?.description.length > 87 &&
                    <>
                      <p className='text-[#B59007] font-bold ml-1 hover:cursor-pointer inline minlg:hidden' onClick={() => setDescriptionExpanded(true)}>
                        Show more
                      </p>
                    </>
          }
          {
            props?.nft?.metadata?.description.length > 200 &&
                    <>
                      <p className='text-[#B59007] font-bold ml-1 hover:cursor-pointer hidden minlg:inline' onClick={() => setDescriptionExpanded(true)}>
                        Show more
                      </p>
                    </>
          }
        </>
      }
    </div>
  );
};