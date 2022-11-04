import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';

interface ResultsDropDownProps {
  isHeader?: any;
  searchResults: any[],
  resultTitleOnClick?: (collectionName: string) => void,
  itemListOnClick?: (document: any) => void,
  extraClasses?: string
}

export const ResultsDropDown = ({ isHeader, searchResults, resultTitleOnClick, itemListOnClick, extraClasses }: ResultsDropDownProps) => {
  const router = useRouter();
  const { keyword, setDropDownSearchResults } = useSearchModal();

  const resultTitle = (found, collectionName) => {
    let title = '';
    
    if (found < 1 && collectionName !== '')
      title = 'O ' + collectionName?.toUpperCase();
    else if (found > 3) {
      title = 'TOP 3 ' + collectionName?.toUpperCase();
    } else {
      title = found + ' ' + collectionName?.toUpperCase();
    }
    
    return (
      <div className={tw(
        `flex justify-${found > 0 ? 'between' : 'start'}`,
        'text-xs text-blog-text-reskin font-medium bg-gray-200 py-3 px-5')}>
        <span>{title}</span>
        <span
          className="cursor-pointer hover:font-semibold"
          onClick={() => {
            router.push(`/app/discover/${collectionName}/${keyword}`);
            setDropDownSearchResults([], '');
            resultTitleOnClick && resultTitleOnClick(collectionName);
          }}
        >
          {found < 1 ? '' : found > 1 ? 'SEE ALL ' + found : 'SEE ' + found}
        </span>
      </div>
    );
  };
      
  const ResultsContent = (searchResults) => {
    return searchResults && searchResults.length > 0 && searchResults.map((item, index) => {
      return (
        <div key={index}>
          {resultTitle(item.found, item?.request_params?.collection_name)}
          <div className="flex flex-col items-start" key={index}>
            {item.found === 0 ?
              <div className={tw('text-sm py-3 text-gray-500 px-5')}>
                    No {item?.request_params?.collection_name?.toLowerCase()} results
              </div>
              : (item?.hits?.map((hit, index) => {
                return (
                  <div
                    className="hover:cursor-pointer hover:bg-gray-100 w-full"
                    key={index}>
                    <div
                      className={tw(
                        'px-5',
                        'items-start my-1 py-3 w-full',
                        'text-sm font-semibold text-black',
                        'whitespace-nowrap text-ellipsis overflow-hidden')}
                      onClick={() => {
                        if (!hit.document.nftName) {
                          router.push(`/app/collection/${hit.document.contractAddr}/`);
                        } else {
                          router.push(`/app/nft/${hit.document.contractAddr}/${hit.document.tokenId}`);
                        }
                        setDropDownSearchResults([], '');
                        itemListOnClick && itemListOnClick(hit.document);
                      }}>
                      {hit.document.nftName ?? hit.document.contractName}
                    </div>
                  </div>
                );
              }))}
          </div>
        </div>
      );
    });
  };
      
  return (
    <div
      className={tw(
        isHeader ? 'absolute left-0 max-w-[27rem]' : '',
        'bg-always-white flex flex-col w-full text-rubik',
        extraClasses)}>
      {searchResults.length > 0 && <>
        {searchResults[0].found === 0 && searchResults[1].found === 0 ?
          (<div className="mt-10 self-center text-base font-medium text-gray-500 pb-4 text-center">
            No results found. Please try another keyword.
          </div>) :
          <div className="py-4">
            {ResultsContent(searchResults)}
            {isHeader && <span className="px-5 text-xs text-gray-400">Press enter for all results</span>}
          </div>
        }
      </>}
    </div>
  );
};