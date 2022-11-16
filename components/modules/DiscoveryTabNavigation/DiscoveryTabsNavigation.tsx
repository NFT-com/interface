import { DiscoveryTabs } from 'cypress/util/constants';

export interface NavProps {
  active: string;
  callBack: any
}

export function DiscoveryTabNav(props: NavProps) {
  return (
    <div className="w-[100%] border-[##ECECEC] border-b-[2px] mb-[20px]">
      <ul className="flex flex-row items-center justify-center text-[22px] leading-[20px] text-[#B2B2B2] font-[500]">
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
