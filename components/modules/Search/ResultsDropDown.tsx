import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { Image } from 'phosphor-react';

interface ResultsDropDownProps {
  isHeader?: any;
  searchResults: any[],
  resultTitleOnClick?: (collectionName: string) => void,
  itemListOnClick?: (document: any) => void,
  extraClasses?: string
}

export const ResultsDropDown = ({ isHeader, searchResults, resultTitleOnClick, itemListOnClick, extraClasses }: ResultsDropDownProps) => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);
  const router = useRouter();
  const copy = [...searchResults];
  const nfts = copy.map(item => item);
  const newData = [
    searchResults[1],
    nfts[0]
  ];
  const { keyword, setDropDownSearchResults } = useSearchModal();
  const clickByItemResult = (hit) => {
    if (!hit.document.nftName) {
      router.push(`/app/collection/${hit.document.contractAddr}/`);
    } else {
      if(hit.document.isProfile){
        router.push('/' + `${hit.document.nftName}`);
      }else {
        router.push(`/app/nft/${hit.document.contractAddr}/${hit.document.tokenId}`);
      }
    }
    setDropDownSearchResults([], '');
    itemListOnClick && itemListOnClick(hit.document);
  };
  const resultTitle = (found, collectionName) => {
    let title = '';

    if (found < 1 && collectionName !== '')
      title = 'O ' + collectionName?.toUpperCase();
    else if (found > 3) {
      title = found + ' ' + collectionName?.toUpperCase();
    } else {
      title = found + ' ' + collectionName?.toUpperCase();
    }
    if(discoverPageEnv){
      return (
        <div className={tw(
          'flex justify-between',
          'text-lg text-blog-text-reskin font-medium py-3 px-8')}>
          <span className="text-[#B2B2B2]">{title}</span>
          <span
            className="cursor-pointer hover:font-semibold underline text-black"
            onClick={() => {
              router.push(`/app/discover/${collectionName}/${keyword}`);
              setDropDownSearchResults([], '');
              resultTitleOnClick && resultTitleOnClick(collectionName);
            }}
          >
          See All
            {/*{found < 1 ? '' : found > 1 ? 'SEE ALL ' + found : 'SEE ' + found}*/}
          </span>
        </div>
      );
    }else {
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
    }
  };
  const ResultsContent = (searchResults) => {
    if(discoverPageEnv) {
      return newData && newData.length > 0 && newData.filter(Boolean).map((item, index) => {
        return (
          <div key={index}>
            {resultTitle(item.found, item?.request_params?.collection_name)}
            <div className="flex flex-col items-start" key={index}>
              {item.hits.length === 0 ?
                <div className={tw('text-sm py-3 text-gray-500 px-9')}>
                  No {item?.request_params?.collection_name?.toLowerCase()} results
                </div>
                : (item?.hits?.map((hit, index) => {
                  return (
                    <div
                      className="hover:cursor-pointer hover:bg-gray-100 w-full"
                      key={index}>
                      <div
                        className={tw(
                          'px-8',
                          'items-start py-1 w-full',
                          'text-sm font-semibold text-black',
                          'flex justify-start items-center whitespace-nowrap text-ellipsis overflow-hidden')}
                        onClick={() => clickByItemResult(hit)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {hit.document.imageURL || hit.document.logoUrl ?
                          <div className="relative min-w-[48px] w-[48px] h-[48px] rounded-[16px] mr-2 overflow-hidden">
                            <RoundedCornerMedia
                              variant={RoundedCornerVariant.None}
                              width={600}
                              height={600}
                              containerClasses='w-[100%] h-[100%]'
                              extraClasses='hover:scale-105 transition'
                              src={item?.request_params?.collection_name === 'collections' ? hit.document.logoUrl : hit.document.imageURL}
                            />
                          </div>
                          : <div className="min-w-[48px] w-[48px] h-[48px] rounded-[50%] mr-2 bg-[#F2F2F2] flex justify-center items-center"><Image alt="preloader" color={'#B2B2B2'} size={32} /></div>}
                        <span className="flex items-center text-base overflow-hidden text-ellipsis whitespace-nowrap font-[500]">
                          {
                            hit.document.isProfile ? <span className="text-[#F9D54C] text-xl font-bold">/ </span> : null
                          }
                          {hit.document.nftName ?? hit.document.contractName}
                        </span>
                      </div>
                    </div>
                  );
                }))}
            </div>
          </div>
        );
      });
    }else {
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
    }
  };
  if(discoverPageEnv) {
    return (
      <div
        className={tw(
          isHeader ? 'absolute left-0 max-w-[27rem]' : '',
          'flex flex-col w-full text-rubik',
          extraClasses)}>
        {searchResults.length > 0 && <>
          {searchResults[0].found === 0 && searchResults[1].found === 0 ?
            (<div className="bg-white mt-10 self-center text-base font-medium text-gray-500 pb-4 text-center">
              No results found. Please try another keyword.
            </div>) :
            <div className="bg-white py-4 rounded-b-2xl shadow-lg">
              {ResultsContent(searchResults)}
              {/*{isHeader && <span className="px-5 text-xs text-gray-400">Press enter for all results</span>}*/}
            </div>
          }
        </>}
      </div>
    );
  }else {
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
  }
};
