import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { isNullOrEmpty } from 'utils/format';

export type BarGraphProps = {
  data: any;
  label: string;
  currentMarketplace: string;
};

export const BarGraph = ({ data, label }: BarGraphProps) => {
  return (
    <div className='bg-transparent'>
      <span className='flex w-full flex-row'>{label}</span>
      {isNullOrEmpty(data) ? (
        <span>No data yet</span>
      ) : (
        <ResponsiveContainer width='100%' height={270}>
          <BarChart data={data} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
            <XAxis dataKey='name' />
            <YAxis orientation={'right'} />
            <Tooltip />
            <Bar dataKey='pv' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
