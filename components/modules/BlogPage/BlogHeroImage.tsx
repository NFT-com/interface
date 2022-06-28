import Image from 'next/image';

type HeroProps = {
  src: string;
  alt: string;
};

export default function BlogHeroImage({ src, alt }: HeroProps) {
  return (
    <div className="h-blogHero-xl lg:h-blogHero-lg md:h-96 w-full relative">
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  );
}
