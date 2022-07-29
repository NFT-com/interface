import Image from 'next/image';

type HeroProps = {
  src: string;
  alt: string;
};

export default function BlogHeroImage({ src, alt }: HeroProps) {
  return (
    <div className="minxl:h-blogHero-xl minlg:h-blogHero-lg h-96 w-full relative">
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  );
}
