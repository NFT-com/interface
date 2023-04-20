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
  activePeriod: string;
  onChange: (val: string) => void;
}
export default function TimePeriodToggle(props: TimePeriodProps) {
  return (
    <>
      <ul className='flex max-h-[46px] flex-row items-center overflow-hidden rounded-[16px] border border-[#ECECEC] font-noi-grotesk'>
        {TimePeriods.map((item, i) => {
          return (
            <li
              onClick={() => props.onChange(item.key)}
              key={i}
              className={`${
                props.activePeriod === item.key ? 'bg-[#F9D54C] text-[#000]' : 'bg-transparent'
              } m-0 flex h-[46px] w-[41px] cursor-pointer list-none items-center justify-center text-base text-[#B2B2B2] transition-all`}
            >
              {item.value}
            </li>
          );
        })}
      </ul>
    </>
  );
}
