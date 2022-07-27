export default function NftOwner() {
  return (
    <div id="display" className='mt-10 font-grotesk'>
      <h2 className='text-black mb-2 font-bold md:text-2xl text-4xl tracking-wide'>Display Mode</h2>
      <p className='mb-4 text-[#6F6F6F]'>Select what your profile will show to the public.</p>
  
      <div className='mt-4'>
        <input className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963] checked:bg-none" type="radio" name="gallery-display" value='personal'/ >
        <label className="ml-3" htmlFor="html">Personal Gallery</label><br/>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>Your profile will display the NFTs in your wallet.</p>
        <input className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963] checked:bg-none" type="radio" name="gallery-display" value='collection'/ >
        <label className="ml-3" htmlFor="css">NFT Collection</label><br/>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>Your profile will act as an official landing page for your deployed NFT Collection.</p>
      </div>
    </div>
  );
}
  