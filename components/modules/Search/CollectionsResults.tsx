import CollectionsSlider from 'components/elements/CollectionsSlider';
import Loader from 'components/elements/Loader';
import PreloaderImage from 'components/elements/PreloaderImage';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import router from 'next/router';

export const CollectionsResults = (props: {searchTerm?: string, found?: number, nftsForCollections?: any, sideNavOpen?: boolean}) => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);

  const { searchTerm, found, nftsForCollections, sideNavOpen } = props;

  const showCollectionsItems = () => {
    const preloadersArray = sideNavOpen ? [1,2] : [1,2,3];
    if(!nftsForCollections){
      return (
        preloadersArray.map(item => {
          return (
            <div key={item} role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
              <div className="flex justify-center items-center bg-gray-300 rounded-[6px] overflow-hidden sm:w-96 dark:bg-gray-700">
                <PreloaderImage/>
              </div>
            </div>
          );
        })
      );
    }else {
      return nftsForCollections?.filter(item => item.nfts.length).slice(0, sideNavOpen ? 2 : 3).map((collection, i) => {
        if(collection?.nfts.length){
          return (
            <CollectionCard
              key={i}
              redirectTo={collection?.collectionAddress}
              contractAddress={collection?.contractAddress}
              contract={collection?.contract}
              description={collection?.nfts && collection?.nfts[0].metadata?.description}
              images={[collection?.nfts[0].metadata?.imageUrl]}
              contractName={collection?.nfts[0].metadata?.name}
              maxSymbolsInString={180}
            />
          );
        }
      });
    }
  };
  if(discoverPageEnv){
    return(
      <>
        <div className="flex justify-between items-center font-grotesk font-black text-sm text-blog-text-reskin mb-7">
          <span className="text-[#B2B2B2] text-lg text-blog-text-reskin font-medium"> {found + ' ' + 'Collection' + `${found === 1 ? '' : 's'}`} </span>
          <span
            className="cursor-pointer hover:font-semibold underline text-black text-lg"
            onClick={() => { router.push(`/app/discover/collections/${searchTerm}`); }}
          >
          See All
          </span>
        </div>
        <div className={tw(
          'gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
          !props.sideNavOpen ? 'minxl:grid-cols-3': 'minlg:grid-cols-1 minxl:grid-cols-2')}>
          {showCollectionsItems()}
        </div>
      </>
    );
  }else {
    return(
      <>
        <div className="flex justify-between items-center font-grotesk font-black text-sm text-blog-text-reskin">
          <span> {found + ' ' + 'COLLECTION' + `${found === 1 ? '' : 'S'}`} </span>
          <span
            className="cursor-pointer hover:font-semibold"
            onClick={() => { router.push(`/app/discover/collections/${searchTerm}`); }}
          >
          SEE ALL
          </span>
        </div>
        {nftsForCollections && nftsForCollections.length > 0 ?
          <CollectionsSlider full slides={nftsForCollections} /> :
          (<div className="flex items-center justify-center min-h-[16rem]">
            {found === 0 ? <div className="font-grotesk font-black text-xl text-[#7F7F7F]">No results found</div>:<Loader />}
          </div>)}
      </>
    );
  }
};

