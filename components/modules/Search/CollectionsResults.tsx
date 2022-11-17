import CollectionsSlider from 'components/elements/CollectionsSlider';
import Loader from 'components/elements/Loader';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import router from 'next/router';
const data = [
  {
    redirectTo: '',
    contractAddress: 'test',
    contract: 'test',
    userName: 'userName',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    countOfElements: '12333',
    imgUrl: ['https://nft-llc.mypinata.cloud/ipfs/QmUPnrxhPuBunudK5dubckhEocPpbfXvVcEiVvzMHPjiqP']
  },
  {
    redirectTo: '',
    contractAddress: 'test',
    contract: 'test',
    userName: 'userName',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    countOfElements: '12333',
    imgUrl: ['https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1161732.svg']
  },
  {
    redirectTo: '',
    contractAddress: 'test',
    contract: 'test',
    userName: 'userName',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    countOfElements: '12333',
    imgUrl: ['https://nft-llc.mypinata.cloud/ipfs/QmQPwqyQcCkxMnjYCBodvCmr1yKj3jbdz7GePvNFN2Saj1']
  },
];
export const CollectionsResults = (props: {searchTerm?: string, found?: number, nftsForCollections?: any, sideNavOpen?: boolean}) => {
  const { searchTerm, found, nftsForCollections } = props;
  const showCollectionsItems = () => {
    return data?.slice(0, props.sideNavOpen ? 2 : 3).map((collection, i) => {
      return (
        <CollectionCard
          key={i}
          redirectTo={collection.redirectTo}
          contractAddress={collection.contractAddress}
          contract={collection.contract}
          userName={collection.userName}
          description={collection.description}
          countOfElements={collection.countOfElements}
          images={collection.imgUrl}
          maxSymbolsInString={180}
        />
      );
    });
  };
  if(getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED)){
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
        {/*{nftsForCollections && nftsForCollections.length > 0 ?*/}
        {/*  showCollectionsItems() :*/}
        {/*  (<div className="flex items-center justify-center min-h-[16rem]">*/}
        {/*    {found === 0 ? <div className="font-grotesk font-black text-xl text-[#7F7F7F]">No results found</div>:<Loader />}*/}
        {/*  </div>)}*/}
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

