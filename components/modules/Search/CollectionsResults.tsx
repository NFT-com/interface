import CollectionsSlider from 'components/elements/CollectionsSlider';
import Loader from 'components/elements/Loader';

import router from 'next/router';

export const CollectionsResults = (props: {searchTerm: string, found: number, nftsForCollections: any}) => {
  const { searchTerm, found, nftsForCollections } = props;
  
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
};