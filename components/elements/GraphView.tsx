import { tw } from 'utils/tw';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';

interface InfoCardProps {
  title: string;
  value: string;
  unit?: string
}

const InfoCard = ({ title, value, unit }: InfoCardProps) => {
  return (
    <div className="bg-white rounded-xl pl-5 pt-5 pb-5">
      <div className="text-base font-bold text-gray-500 tracking-normal">{title}</div>
      <div className="font-medium text-black text-3xl mt-1">
        <b>{value} </b>
        <span className="text-lg font-normal">{unit}</span>
      </div>
    </div>
  );
};

const data = [
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
];

export const GraphView = () => {
  return (
    <div>
      <div className={tw('bg-white flex text-always-black',
        'justify-between rounded-lg rounded-br-none rounded-bl-none')}>
        <InfoCard title={'Total NFT Value'} value={'14.08'} unit={'ETH'} />
      </div>
      <div className="bg-white">
        <ResponsiveContainer height={270} width='100.8%' className="ml-[-0.25rem]">
          <AreaChart data={data} >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A4FF" stopOpacity={0.2}/>
                <stop offset="80%" stopColor="#00A4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#00A4FF"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={tw('bg-white flex',
        'text-base text-always-black rounded-b-lg')}>
        <div className="p-4 hover:cursor-pointer">1d</div>
        <div className="p-4 hover:cursor-pointer">1w</div>
        <div className="p-4 hover:cursor-pointer">2w</div>
        <div className="p-4 hover:cursor-pointer">1m</div>
        <div className="p-4 hover:cursor-pointer">6m</div>
        <div className="p-4 hover:cursor-pointer">1y</div>
      </div>
    </div>

  );
};
