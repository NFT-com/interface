import { CustomTooltip } from 'components/elements/CustomTooltip';

import { Info } from 'phosphor-react';
import { Link as ScrollLink } from 'react-scroll';

type SettingsSidebarProps = {
  isOwner: boolean
}

export default function SettingsSidebar({ isOwner }: SettingsSidebarProps) {
  return (
    <div className='hidden minlg:block pt-28 fixed left-[10%] minxl:left-[20%]'>
      <h2 className='mb-9 font-bold text-black font-grotesk text-[40px]'>
        <span className='text-[#F9D963]'>/</span>
        Settings
      </h2>

      {isOwner
        ? (
          <>
            
            <h3 className='mb-3 text-xs uppercase font-extrabold font-grotesk text-[#B6B6B6] tracking-wide flex items-center relative'>
              Profile Settings
              <CustomTooltip
                mode="hover"
                tooltipComponent={
                  <div
                    className="rounded-xl p-3 bg-modal-bg-dk text-white max-w-xs"
                  >
                    <p className='mb-2'>Profile Settings</p>
                    <p>These settings control the active profile you are signed-in with.</p>
                  </div>
                }>
                <Info className='ml-1' size={14} />
              </CustomTooltip>
            </h3>
            <ScrollLink activeClass='font-bold' to='addresses' spy={true} smooth={true} duration={500} offset={-100} >
              <p className='text-blog-text-reskin hover:cursor-pointer mb-6 tracking-wide font-grotesk'>Associate Addresses</p>
            </ScrollLink>
            <ScrollLink activeClass='font-bold' to='display' spy={true} smooth={true} duration={500} offset={-100}>
              <p className='text-blog-text-reskin hover:cursor-pointer mb-6 tracking-wide font-grotesk'>Select Display Mode</p>
            </ScrollLink>
            <ScrollLink to='transfer' activeClass='font-bold' spy={true} smooth={true} duration={500} offset={-100}>
              <p className='text-[#D40909] hover:cursor-pointer mb-6 tracking-wide font-grotesk'>Transfer Profile</p>
            </ScrollLink>
          </>
        )
        : null}

      <h3 className='mb-3 mt-12 text-xs uppercase font-extrabold font-grotesk text-[#B6B6B6] tracking-wide flex items-center relative'>
        Address Settings
        <CustomTooltip
          mode="hover"
          tooltipComponent={
            <div
              className="rounded-xl p-3 bg-modal-bg-dk text-white max-w-xs relative"
            >
              <p className='mb-2'>Address Settings</p>
              <p>These settings relate to your address and the NFTs it contains across all your NFT Profiles.</p>
            </div>
          }>
          <Info className='ml-1' size={14} />
        </CustomTooltip>
      </h3>

      {isOwner
        ? (
          <ScrollLink activeClass='font-bold' to='owner' spy smooth duration={500} offset={-100}>
            <p className='text-blog-text-reskin hover:cursor-pointer mb-6 tracking-wide font-grotesk'>Select NFT Owner</p>
          </ScrollLink>
        )
        : null}

      <ScrollLink activeClass='font-bold' to='profiles' spy smooth duration={500} offset={-100}>
        <p className='text-blog-text-reskin hover:cursor-pointer mb-6 tracking-wide font-grotesk'>Associate Profiles</p>
      </ScrollLink>
      
    </div>
  );
}