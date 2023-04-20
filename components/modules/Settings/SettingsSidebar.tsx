import { Link as ScrollLink } from 'react-scroll';
import { Info } from 'phosphor-react';

import CustomTooltip from 'components/elements/CustomTooltip';

type SettingsSidebarProps = {
  isOwner: boolean;
};

export default function SettingsSidebar({ isOwner }: SettingsSidebarProps) {
  return (
    <div className='fixed left-[10%] hidden pt-28 minlg:block minxl:left-[20%]'>
      <h2 className='mb-9 font-noi-grotesk text-[40px] font-bold text-black'>
        <span className='text-[#F9D963]'>/</span>
        Settings
      </h2>

      {isOwner ? (
        <>
          <h3 className='relative mb-3 flex items-center font-noi-grotesk text-xs font-extrabold tracking-wide text-[#B6B6B6]'>
            PROFILE SETTINGS
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] rounded-xl p-3'>
                  <p className='mb-3'>Profile Settings</p>
                  <p>These settings control the active profile you are signed-in with.</p>
                </div>
              }
            >
              <Info className='ml-1' size={14} />
            </CustomTooltip>
          </h3>
          <ScrollLink activeClass='font-bold' to='addresses' spy={true} smooth={true} duration={500} offset={-100}>
            <p className='mb-6 font-noi-grotesk tracking-wide text-blog-text-reskin hover:cursor-pointer'>
              Associate Addresses
            </p>
          </ScrollLink>
          <ScrollLink activeClass='font-bold' to='display' spy={true} smooth={true} duration={500} offset={-100}>
            <p className='mb-6 font-noi-grotesk tracking-wide text-blog-text-reskin hover:cursor-pointer'>
              Select Display Mode
            </p>
          </ScrollLink>
          <ScrollLink activeClass='font-bold' to='licensing' spy={true} smooth={true} duration={500} offset={-100}>
            <p className='mb-6 font-noi-grotesk tracking-wide text-blog-text-reskin hover:cursor-pointer'>
              Profile Licensing
            </p>
          </ScrollLink>
          <ScrollLink to='transfer' activeClass='font-bold' spy={true} smooth={true} duration={500} offset={-100}>
            <p className='mb-6 font-noi-grotesk tracking-wide text-[#D40909] hover:cursor-pointer'>Transfer Profile</p>
          </ScrollLink>
        </>
      ) : null}

      <h3 className='relative mb-3 mt-12 flex items-center font-noi-grotesk text-xs font-extrabold tracking-wide text-[#B6B6B6]'>
        ADDRESS SETTINGS
        <CustomTooltip
          orientation='right'
          tooltipComponent={
            <div className='w-[200px] rounded-xl p-3'>
              <p className='mb-3'>Address Settings</p>
              <p>These settings relate to your address and the NFTs it contains across all your NFT Profiles.</p>
            </div>
          }
        >
          <Info className='ml-1' size={14} />
        </CustomTooltip>
      </h3>

      {isOwner ? (
        <ScrollLink activeClass='font-bold' to='owner' spy smooth duration={500} offset={-100}>
          <p className='mb-6 font-noi-grotesk tracking-wide text-blog-text-reskin hover:cursor-pointer'>
            Select Primary NFT Owner
          </p>
        </ScrollLink>
      ) : null}

      <ScrollLink activeClass='font-bold' to='profiles' spy smooth duration={500} offset={-100}>
        <p className='mb-6 font-noi-grotesk tracking-wide text-blog-text-reskin hover:cursor-pointer'>Manage Address</p>
      </ScrollLink>
    </div>
  );
}
