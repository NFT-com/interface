import { useSearchModal } from 'hooks/state/useSearchModal';

import { ResultsDropDownDisplay } from './ResultsDropDownDisplay';

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

  const { setDropDownSearchResults } = useSearchModal();
  const clickByItemResult = (document) => {
    if (!document.nftName) {
      router.push(`/app/collection/${document.contractAddr}/`);
    } else {
      if(document.isProfile){
        router.push('/' + `${document.nftName}`);
      }else {
        router.push(`/app/nft/${document.contractAddr}/${document.tokenId}`);
      }
    }
    setDropDownSearchResults([], '');
    itemListOnClick && itemListOnClick(document);
  };
  return (
    <ResultsDropDownDisplay
      isHeader={isHeader}
      extraClasses={extraClasses}
      searchResults={searchResults}
      resultTitleOnClick={resultTitleOnClick}
      itemListOnClick={clickByItemResult}
      seeAll={true} />
  );
};
