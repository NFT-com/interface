import CollectionsSlider from 'components/elements/CollectionsSlider';
import Loader from 'components/elements/Loader';'utils/typeSenseAdapters';

import router from 'next/router';

export const CollectionsResults = (props: {searchTerm: string, found: number, nftsForCollections: any}) => {
  const { searchTerm, found, nftsForCollections } = props;
  
  return(
    <>
      <div className="flex justify-between items-center font-grotesk font-black text-base text-lg minmd:text-xl text-blog-text-reskin mt-12 mb-10">
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
          {found !== 0 && <Loader />}
        </div>)}
    </>
  );
};