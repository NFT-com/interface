
import { useGetSentReferralEmailsQuery } from 'graphql/hooks/useGetSentReferralEmailsQuery';
import { useSendReferEmailMutation } from 'graphql/hooks/useSendReferEmailMutation';
import { useUser } from 'hooks/state/useUser';
import { tw } from 'utils/tw';

import { useRef } from 'react';

export default function OnboardingReferralForm() {
  const { user } = useUser();
  const { sendReferEmail } = useSendReferEmailMutation();
  const { data, mutate: mutateSentReferrals } = useGetSentReferralEmailsQuery();
  const input1 = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('An email was submitted: ' + e.target[0].value + 'from:' + user.currentProfileUrl);
    sendReferEmail(user.currentProfileUrl, [e.target[0].value]).then((res) => console.log(res));
    mutateSentReferrals();
  };
  
  console.log('🚀 ~ file: OnboardingReferralForm.tsx ~ line 22 ~ OnboardingReferralForm ~ data', data);

  return (
    <div className='flex flex-col px-7 mb-10 space-y-4'>
      <div className='flex justify-center items-center'>
        <p className='mr-2 text-[#B2B2B2]'>#1</p>
        <form className='flex w-full' onSubmit={(e) => handleSubmit(e)}>
          <input
            ref={input1}
            className={tw(
              'text-lg min-w-0 w-3/4',
              'text-left w-full rounded-xl font-medium',
              'bg-[#F8F8F8] mr-5 border-0'
            )}
            type='email'
            placeholder="Enter email"
            autoFocus={true}
            spellCheck={false}
          />
          <input type="submit" value="Refer" className={tw(
            'inline-flex w-max mx-auto justify-center items-center',
            'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'font-medium text-black py-2 px-4 hover:cursor-pointer',
            'focus:outline-none focus-visible:bg-[#E4BA18]',
            'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
          )} />
        </form>
      </div>

      <div className='flex justify-center items-center'>
        <p className='mr-2 text-[#B2B2B2]'>#2</p>
        <form className='flex w-full' onSubmit={(e) => handleSubmit(e)}>
          <input
            className={tw(
              'text-lg min-w-0 w-3/4',
              'text-left w-full rounded-xl font-medium',
              'bg-[#F8F8F8] mr-5 border-0'
            )}
            type='email'
            placeholder="Enter email"
            autoFocus={true}
            spellCheck={false}
          />
          <input type="submit" value="Refer" className={tw(
            'inline-flex w-max mx-auto justify-center items-center',
            'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'font-medium text-black py-2 px-4 hover:cursor-pointer',
            'focus:outline-none focus-visible:bg-[#E4BA18]',
            'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
          )} />
        </form>
      </div>
      <div className='flex justify-center items-center'>
        <p className='mr-2 text-[#B2B2B2]'>#3</p>
        <form className='flex w-full' onSubmit={(e) => handleSubmit(e)}>
          <input
            className={tw(
              'text-lg min-w-0 w-3/4',
              'text-left w-full rounded-xl font-medium',
              'bg-[#F8F8F8] mr-5 border-0'
            )}
            type='email'
            placeholder="Enter email"
            autoFocus={true}
            spellCheck={false}
          />
          <input type="submit" value="Refer" className={tw(
            'inline-flex w-max mx-auto justify-center items-center',
            'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'font-medium text-black py-2 px-4 hover:cursor-pointer',
            'focus:outline-none focus-visible:bg-[#E4BA18]',
            'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
          )} />
        </form>
      </div>
      <div className='flex justify-center items-center'>
        <p className='mr-2 text-[#B2B2B2]'>#4</p>
        <form className='flex w-full' onSubmit={(e) => handleSubmit(e)}>
          <input
            className={tw(
              'text-lg min-w-0 w-3/4',
              'text-left w-full rounded-xl font-medium',
              'bg-[#F8F8F8] mr-5 border-0'
            )}
            type='email'
            placeholder="Enter email"
            autoFocus={true}
            spellCheck={false}
          />
          <input type="submit" value="Refer" className={tw(
            'inline-flex w-max mx-auto justify-center items-center',
            'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'font-medium text-black py-2 px-4 hover:cursor-pointer',
            'focus:outline-none focus-visible:bg-[#E4BA18]',
            'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
          )} />
        </form>
      </div>
      <div className='flex justify-center items-center'>
        <p className='mr-2 text-[#B2B2B2]'>#5</p>
        <form className='flex w-full' onSubmit={(e) => handleSubmit(e)}>
          <input
            className={tw(
              'text-lg min-w-0 w-3/4',
              'text-left w-full rounded-xl font-medium',
              'bg-[#F8F8F8] mr-5 border-0'
            )}
            type='email'
            placeholder="Enter email"
            autoFocus={true}
            spellCheck={false}
          />
          <input type="submit" value="Refer" className={tw(
            'inline-flex w-max mx-auto justify-center items-center',
            'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
            'font-medium text-black py-2 px-4 hover:cursor-pointer',
            'focus:outline-none focus-visible:bg-[#E4BA18]',
            'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
          )} />
        </form>
      </div>
    </div>
  );
}
    