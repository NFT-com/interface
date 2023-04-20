import { useRouter } from 'next/router';
import { Image } from 'phosphor-react';

import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import GK from 'public/icons/Badge_Key.svg?svgr';
import VerifiedIcon from 'public/icons/verifiedIcon.svg?svgr';

interface ResultsDropDownDisplayProps {
  isHeader?: any;
  searchResults: any[];
  resultTitleOnClick?: (collectionName: string) => void;
  itemListOnClick?: (document: any) => void;
  extraClasses?: string;
  seeAll?: boolean;
}

export const ResultsDropDownDisplay = ({
  isHeader,
  searchResults,
  resultTitleOnClick,
  itemListOnClick,
  extraClasses,
  seeAll
}: ResultsDropDownDisplayProps) => {
  const { setClearedFilters } = useSearchModal();

  const router = useRouter();
  const copy = [...searchResults];
  const nfts = copy.map(item => item);
  const newData = [searchResults[1], nfts[0]];
  const { keyword, setDropDownSearchResults } = useSearchModal();
  const clickByItemResult = hit => {
    setDropDownSearchResults([], '');
    itemListOnClick && itemListOnClick(hit.document);
  };
  const resultTitle = (found, collectionName) => {
    let title = '';

    if (found < 1 && collectionName !== '') title = `O ${collectionName?.toUpperCase()}`;
    else if (found === 1) {
      title = `${found} ${collectionName?.substring(0, collectionName.length - 1).toUpperCase()}`;
    } else {
      title = `${found} ${collectionName?.toUpperCase()}`;
    }
    return (
      <div className={tw('flex justify-between', 'px-8 py-3 text-lg font-medium text-blog-text-reskin')}>
        <span className='text-[#B2B2B2]'>{title}</span>
        {seeAll && (
          <span
            className='cursor-pointer text-black underline hover:font-semibold'
            onClick={() => {
              router.push(`/app/discover/${collectionName}/${keyword}`);
              setClearedFilters();
              setDropDownSearchResults([], '');
              resultTitleOnClick && resultTitleOnClick(collectionName);
            }}
          >
            See All
          </span>
        )}
      </div>
    );
  };
  const ResultsContent = () => {
    return (
      newData &&
      newData.length > 0 &&
      newData.filter(Boolean).map((item, index) => {
        const name = item?.request_params?.collection_name.split('-');
        return (
          <div key={index}>
            {resultTitle(item.found, name && name[0])}
            <div className='flex flex-col items-start' key={index}>
              {item.hits.length === 0 ? (
                <div className={tw('px-9 py-3 text-sm text-gray-500')}>No {name && name[0]?.toLowerCase()} results</div>
              ) : (
                item?.hits?.map((hit, index) => {
                  return (
                    <div className='w-full hover:cursor-pointer hover:bg-gray-100' key={index}>
                      <div
                        className={tw(
                          'px-8',
                          'w-full items-start py-1',
                          'text-sm font-semibold text-black',
                          'flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap'
                        )}
                        onClick={() => clickByItemResult(hit)}
                      >
                        {hit.document.imageURL || hit.document.logoUrl ? (
                          <div className='relative mr-2 h-[48px] w-[48px] min-w-[48px] overflow-hidden rounded-[16px]'>
                            <RoundedCornerMedia
                              variant={RoundedCornerVariant.None}
                              width={600}
                              height={600}
                              containerClasses='w-[100%] h-[100%]'
                              extraClasses='hover:scale-105 transition'
                              src={name && name[0] === 'collections' ? hit.document.logoUrl : hit?.document?.imageURL}
                            />
                          </div>
                        ) : (
                          <div className='mr-2 flex h-[48px] w-[48px] min-w-[48px] items-center justify-center rounded-[50%] bg-[#F2F2F2]'>
                            <Image alt='preloader' color={'#B2B2B2'} size={32} />
                          </div>
                        )}
                        <span className='flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-base font-[500]'>
                          {hit.document.isProfile ? <span className='text-xl font-bold text-[#F9D54C]'>/ </span> : null}
                          {hit.document.nftName ?? hit.document.contractName}
                          {hit.document?.isOfficial && <VerifiedIcon className='ml-2 inline' />}
                          {hit.document.isProfileGKMinted && (
                            <div className='ml-2 h-6 w-6'>
                              <GK />
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })
    );
  };
  return (
    <div
      className={tw(
        isHeader ? 'absolute left-0 z-[51] max-w-[27rem]' : '',
        'flex w-full flex-col font-noi-grotesk',
        extraClasses
      )}
    >
      {searchResults.length > 0 && (
        <>
          {searchResults[0].found === 0 && searchResults[1].found === 0 ? (
            <div className='mt-10 self-center bg-white pb-4 text-center text-base font-medium text-gray-500'>
              No results found. Please try another keyword.
            </div>
          ) : (
            <div className='rounded-b-2xl bg-white py-4 shadow-lg'>{ResultsContent()}</div>
          )}
        </>
      )}
    </div>
  );
};
