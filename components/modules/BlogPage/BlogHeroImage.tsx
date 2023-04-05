import { contentfulLoader } from 'lib/image/loader';
import Image from 'next/image';

type HeroProps = {
  src: string;
  alt: string;
};

export default function BlogHeroImage({ src, alt }: HeroProps) {
  return (
    <div className="minxl:h-blogHero-xl minlg:h-blogHero-lg h-96 w-full relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        className="object-cover"
        loader={contentfulLoader}
        fill
      />
    </div>
  );
}
