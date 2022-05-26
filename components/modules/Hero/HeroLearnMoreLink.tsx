import { ChevronsDown } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface HeroLearnMoreLinkProps {
  onClick: () => void;
}

export function HeroLearnMoreLink(props: HeroLearnMoreLinkProps) {
  const { link } = useThemeColors();
  return <div
    onClick={props.onClick}
    className="flex flex-row items-center hover:underline cursor-pointer"
    style={{ color: link }}
  >
    <ChevronsDown color={link} size={24} />
    <span className='text-xl deprecated_sm:text-lg tracking-wider mx-2 font-hero-heading2'>
      LEARN MORE ABOUT THE PROJECT
    </span>
    <ChevronsDown color={link} size={24} />
  </div>;
}