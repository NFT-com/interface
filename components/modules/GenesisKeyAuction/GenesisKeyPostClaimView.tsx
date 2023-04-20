import { useRouter } from 'next/router';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { tw } from 'utils/tw';

export interface GenesisKeyPostClaimViewProps {
  onBack: () => void;
}

export function GenesisKeyPostClaimView(props: GenesisKeyPostClaimViewProps) {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center text-primary-txt dark:text-primary-txt-dk'>
      <HeroTitle items={['WELCOME TO THE']} />
      <HeroTitle items={['DIGITAL RENAISSANCE']} />
      <div className='flex max-w-3xl flex-col items-center'>
        <div className='mt-4 flex flex-col  text-center '>
          <span className='text-lg font-bold'>
            Please check your wallet in our sidebar to ensure you have received your key.
          </span>
        </div>
        <div className='mt-4 text-center text-lg'>
          As a Genesis Key Holder you have the ability to mint four (4) NFT.com Profiles. You can mint them now or at
          your convenience.
        </div>
        <div className='mt-4 text-center text-lg'>
          Profile names are one-of-a-kind, meaning there will only ever be one NFT.com/hello. Mint your four profiles
          early for the best chance of getting the profile you want.
        </div>
        <div className='mt-8 flex w-full justify-center'>
          <div
            className={tw(
              'flex w-full deprecated_sm:flex-col',
              'items-center justify-center',
              'font-hero-heading1 font-extrabold uppercase tracking-wide'
            )}
          >
            <div className='mr-2 w-2/4 text-center deprecated_sm:mb-4 deprecated_sm:mr-0 deprecated_sm:w-3/4'>
              <Button
                stretch
                size={ButtonSize.LARGE}
                onClick={props.onBack}
                label='Buy Another Key'
                type={ButtonType.PRIMARY}
              />
            </div>
            <div className='ml-2 w-2/4 text-center deprecated_sm:ml-0 deprecated_sm:w-3/4'>
              <Button
                stretch
                size={ButtonSize.LARGE}
                onClick={() => {
                  router.push('/app/mint-profiles');
                }}
                label='Mint Profiles'
                type={ButtonType.PRIMARY}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
