import { Collection,Nft } from 'graphql/generated/types';

export type TxHistoryProps = {
  data: Nft | Collection;
}
export const TxHistory = () => {
  //TODO: @anthony - add tx history from indexer
  return (
    <div className="shadow-sm overflow-x-auto my-8">
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4  pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Name</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">From</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">To</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Price</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Marketplace</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          <tr>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">1.5 ETH</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">08/18/2022 18:00PST</td>
          </tr>
          <tr>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">1.5 ETH</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">08/18/2022 18:00PST</td>
          </tr>
          <tr>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">0x0</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">1.5 ETH</td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4  text-slate-500 dark:text-slate-400">08/18/2022 18:00PST</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};