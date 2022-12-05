const DiscoveryTabs = [
  // {
  //   name: 'NFTs',
  //   id: 0,
  //   key: 'nft'
  // },
  {
    name: 'Collections',
    id: 1,
    key: 'collections'
  },
  {
    name: 'Profiles',
    id: 2,
    key: 'profiles'
  }
];
export interface NavProps {
  active: string;
  isLeaderBoard: boolean;
  callBack: any
}

export function DiscoveryTabNav(props: NavProps) {
  return (
    <div className="w-[100%] border-[##ECECEC] border-b-[2px] mb-[20px]">
      <ul className={`${props.isLeaderBoard ? '' : 'justify-center'} relative transition-all flex flex-row items-center text-[22px] leading-[20px] text-[#B2B2B2] font-[500]`}>
        {
          DiscoveryTabs.map(tab => {
            return (
              <li key={tab.id}
                onClick={() => props.callBack(tab.key)}
                className={`${props.active === tab.key ? 'border-[#F9D54C] text-[#000000]' : 'border-[transparent]'} hover:border-[#F9D54C] border-b-[2px] transition-all list-none m-0 py-[24px] mx-[16px]`}>
                <button>{tab.name}</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}
