import { tw } from 'utils/tw';

export const Subscription = () => {
  return (
    <div className="bg-white">
      <div className="relative">
        <div aria-hidden="true" className="hidden deprecated_sm:block">
        </div>
        <div className="mx-auto deprecated_sm:max-w-full deprecated_sm:w-full">
          <div className={tw('relative deprecated_sm:px-6 deprecated_sm:py-10 bg-secondary-txt',
            'dark:bg-headerbg-dk overflow-hidden shadow-xl px-12 py-28')}>
            <div className="relative">
              <div className="text-center">
                <h2 className="font-extrabold text-white tracking-normal text-[2.4rem]">
                  Get to know the NFT space, every day.
                </h2>
                <p className="mt-3.5 mx-auto max-w-4xl text-[1.1rem] text-white">
                  Get NFT analysis, Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod.
                </p>
              </div>
              <div className="mt-20 mx-auto max-w-md flex deprecated_md:flex-col">
                <div className="min-w-0 grow deprecated_md:grow-0 mr-3 deprecated_md:mr-0">
                  <label htmlFor="cta-email" className="sr-only text-primary-btn-txt-disabled">
                    Email address address
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    className={tw('w-full border border-transparent rounded-lg',
                      'px-5 py-2 text-base text-gray-900 placeholder-gray-500',
                      'shadow-sm focus:outline-none focus:border-transparent')}
                    placeholder="Enter your email address" />
                </div>
                {/* TODO. Process email address when submitted */}
                <div className="deprecated_md:mt-3">
                  <button
                    type="submit"
                    className={tw('w-full rounded-lg border text-center border-transparent',
                      'py-2 px-10 bg-primary-button-bckg text-base font-medium whitespace-nowrap',
                      'text-white shadow hover:bg-neutral-700 focus:outline-none')}>
                      Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
