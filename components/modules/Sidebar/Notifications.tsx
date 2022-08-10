import { tw } from 'utils/tw';

export const Notifications = () => {
  return (
    <div className='flex flex-col w-full items-center space-y-4'>
      <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
        {//TODO: return notifications from endpoint
        }
        <button className={tw(
          'inline-flex w-full h-full',
          'text-md',
          'leading-6',
          'items-center',
          'justify-center',
          'bg-[#F9D963]',
          'rounded-lg',
          'p-4'
        )}
        onClick={() => {
          //TODO: functionality
        }}>
        1 NFT Profile Connection request
        </button>
      </div>

      <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
        {//TODO: return notifications from endpoint
        }
        <button className={tw(
          'inline-flex w-full h-full',
          'text-md',
          'leading-6',
          'items-center',
          'justify-center',
          'bg-[#F9D963]',
          'rounded-lg',
          'p-4'
        )}
        onClick={() => {
          //TODO: functionality
        }}>
      2 NFT Profiles need attention
        </button>
      </div>

      <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
        {//TODO: return notifications from endpoint
        }
        <button className={tw(
          'inline-flex w-full h-full',
          'text-md',
          'leading-6',
          'items-center',
          'justify-center',
          'bg-[#F9D963]',
          'rounded-lg',
          'p-4'
        )}
        onClick={() => {
          //TODO: functionality
        }}>
      Get a free profile!
        </button>
      </div>

      <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
        {//TODO: return notifications from endpoint
        }
        <button className={tw(
          'inline-flex w-full h-full',
          'text-md',
          'leading-6',
          'items-center',
          'justify-center',
          'bg-[#F9D963]',
          'rounded-lg',
          'p-4'
        )}
        onClick={() => {
          //TODO: functionality
        }}>
        6 NFT Profiles available to mint
        </button>
      </div>
    </div>
  );
};