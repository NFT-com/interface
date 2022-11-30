const TimePeriods = [
  {
    key: '24h',
    value: '24h'
  },
  {
    key: '7d',
    value: '7d'
  },
  {
    key: '30d',
    value: '30d'
  },
  {
    key: 'all',
    value: 'all'
  }
];
export interface TimePeriodProps {
  activePeriod: string,
  onChange: (val: string) => void;
}
export default function TimePeriodToggle(props: TimePeriodProps) {
  return (
    <>
      <ul className="flex flex-row p-[2px] border border-[#ECECEC] rounded-[16px] font-noi-grotesk">
        {
          TimePeriods.map((item, i) => {
            return (
              <li onClick={() => props.onChange(item.key)} key={i} className={`${props.activePeriod === item.key ? 'bg-[#FFF4CA] text-[#000]' : 'bg-transparent'} w-[41px] h-[40px] flex items-center justify-center text-[#B2B2B2] rounded-[12px] list-none text-base m-0 cursor-pointer transition-all`}>{item.value}</li>
            );
          })
        }
      </ul>
    </>
  );
}
