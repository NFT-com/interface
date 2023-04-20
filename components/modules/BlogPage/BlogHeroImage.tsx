import Image from 'next/image';

import { contentfulLoader } from 'lib/image/loader';

type HeroProps = {
  src: string;
  alt: string;
};

export default function BlogHeroImage({ src, alt }: HeroProps) {
  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-md border border-gray-100/50 pb-4 drop-shadow-md minlg:h-blogHero-lg minxl:h-blogHero-xl'>
      <Image src={src} alt={alt} className='object-cover' loader={contentfulLoader} fill />
    </div>
  );
}
