import { Link as ScrollLink } from 'react-scroll';

type SettingsSidebarProps = {
  isOwner: boolean
}

export default function SettingsSidebar({ isOwner }: SettingsSidebarProps) {
  return (
    <div className='hidden minlg:block pt-28 fixed left-[10%] minxl:left-[20%]'>
      <h2 className='mb-2 font-bold text-black font-grotesk text-[40px]'>
        <span className='text-[#F9D963]'>/</span>
        Settings
      </h2>
      {isOwner
        ? (
          <>
            <ScrollLink activeClass='font-medium' to='owner' spy={true} smooth={true} duration={500} offset={-100}>
              <p className='text-blog-text-reskin mt-6 hover:cursor-pointer'>NFT Owner</p>
            </ScrollLink>
            <ScrollLink activeClass='font-medium' to='display' spy={true} smooth={true} duration={500} offset={-100}>
              <p className='text-blog-text-reskin mt-6 hover:cursor-pointer'>Display Mode</p>
            </ScrollLink>
          </>
        )
        : null}
      
      <ScrollLink activeClass='font-medium' to='profiles' spy={true} smooth={true} duration={500} offset={-100}>
        <p className='text-blog-text-reskin mt-6 hover:cursor-pointer'>Connected Profiles</p>
      </ScrollLink>
      {isOwner
        ? (
          <ScrollLink to='transfer' activeClass='font-medium' spy={true} smooth={true} duration={500} offset={-300}>
            <p className='text-blog-text-reskin mt-6 hover:cursor-pointer'>Transfer Profile</p>
          </ScrollLink>
        )
        : null}
      
    </div>
  );
}