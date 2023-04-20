import { Check } from 'phosphor-react';

import { tw } from 'utils/tw';

export type ProgressBarItem = {
  label: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
};

export type ProgressBarNode = {
  label: string;
  error?: boolean;
  items?: ProgressBarItem[];
};

export interface VerticalProgressBarProps {
  nodes: ProgressBarNode[];
  activeNodeIndex: number;
}

export function VerticalProgressBar(props: VerticalProgressBarProps) {
  return (
    <div className='m-4 flex w-full flex-col border-l-2 font-noi-grotesk dark:border-white'>
      {props.nodes.map((node, index) => {
        return (
          <div key={`node${index}`} className={tw('flex w-full', index < props.nodes.length - 1 && 'mb-12')}>
            <Check
              className={tw(
                '-ml-4 aspect-square h-7 w-7 shrink-0 rounded-full p-1 text-white',
                index < props.activeNodeIndex && 'bg-[#26AA73]',
                index === props.activeNodeIndex && 'border-2 bg-white',
                index > props.activeNodeIndex && 'border-2 border-[#DDE2E4] bg-white',
                node.error && 'animate-none bg-red-400 motion-safe:animate-none'
              )}
            />
            <div className='flex w-full flex-col'>
              <div className={tw('ml-4 text-[18px] font-semibold', index > props.activeNodeIndex && 'text-[#6A6A6A]')}>
                {node.label}
              </div>
              <div className='ml-4 flex-col'>
                {node.items?.map((item, index) => {
                  return (
                    <div key={index} className={tw('mt-4 flex items-center text-[14px] text-[#818181]')}>
                      {item.startIcon}
                      <div className='ml-2 line-clamp-1'>{item.label}</div>
                      {item.endIcon}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
