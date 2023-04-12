import { tw } from 'utils/tw';

import Image from 'next/image';
import benefitImage01 from 'public/img-benefit01.webp';
import benefitImage02 from 'public/img-benefit02.webp';
import benefitImage03 from 'public/img-benefit03.webp';

export function SocialSection() {
  return(
    <div className="pt-8 minxxl:pt-16 pb-2">
      <div className='grid minmd:grid-cols-2 items-center'>
        <div className='px-5 minmd:px-0 minmd:ml-[14.7vw] minmd:max-w-[25rem] minxxl:max-w-[29vw] minlg:pb-[9.6rem]'>
          <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
            'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.2] font-normal',
            'tracking-tight mb-6 minxxl:mb-9'
          )}>
            <span className={tw(
              'bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'
            )}>Free</span>
            <span data-aos="fade-up" data-aos-delay="200"> trading</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="300" className={tw(
            'mb-9',
            'text-[1rem] minlg:text-lg minxxl:text-[2rem] leading-[1.556] minlg:!leading-[1.3]'
          )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
          <a href={''} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase w-full minmd:w-auto'
          )}>Create profile</a>
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <Image src={benefitImage01} alt="Test" />
        </div>
      </div>

      <div className='grid minmd:grid-cols-2 items-center minmd:-my-[7.5rem]'>
        <div className='px-5 minmd:px-0 minmd:ml-[10vw] minmd:max-w-[25rem] minxxl:max-w-[29vw] minmd:pb-28'>
          <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
            'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.2] font-normal',
            'tracking-tight mb-6 minxxl:mb-9'
          )}>
            <span>Live </span>
            <span data-aos="fade-up" data-aos-delay="200"
              className='bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'>
                    social feed
            </span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="300" className={tw(
            'mb-9',
            'text-[1rem] minlg:text-lg minxxl:text-[2rem] leading-[1.556] minlg:!leading-[1.3]'
          )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
          <a href={''} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase w-full minmd:w-auto'
          )}>Create profile</a>
        </div>

        <div data-aos="fade-up" data-aos-delay="400" className={tw(
          'minmd:-order-1 minlg:-mr-20'
        )}>
          <Image src={benefitImage02} alt="Test" />
        </div>
      </div>

      <div className='grid minmd:grid-cols-2 items-center'>
        <div className='px-5 minmd:px-0 minmd:ml-[14.7vw] minmd:max-w-[25rem] minxxl:max-w-[29vw] minmd:pt-8'>
          <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
            'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.2] font-normal',
            'tracking-tight mb-6 minxxl:mb-9'
          )}>
            Talk <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'>directly</span>
            <span data-aos="fade-up" data-aos-delay="200"
              className={tw(
                'inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'
              )}>
                    with artists
            </span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="300" className={tw(
            'mb-9',
            'text-[1rem] minlg:text-lg minxxl:text-[2rem] leading-[1.556] minlg:!leading-[1.3]'
          )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
          <a href={''} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase w-full minmd:w-auto'
          )}>Create profile</a>
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <Image src={benefitImage03} alt="Test" />
        </div>
      </div>
    </div>

  );
}
